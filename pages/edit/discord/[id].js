import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import { Loading } from '../../../components/loading';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss'
import { DEMO_DEFAULT_AVATAR, PROFILE_BG, InfuraAuth, InfuraLink, } from '../../../keys';
import CustomModal from '../../../components/custom/customModal';
import ModalAddNFTCommunity from '../../../components/modals/modalAddNFTCommunity';
import GatedNFTDisplayNew from '../../../components/cards/GatedNFTDisplayNew';
import { create as ipfsHttpClient } from 'ipfs-http-client';
const CustomPopover = dynamic(() => import('../../../components/custom/CustomPopover'));

const EditDiscordServerPage = () => {

  const router = useRouter();
  const { id } = router.query;
  const { Moralis } = useMoralis();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [baseFile, setBaseFile] = useState();
  const [file, setFile] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [isCongrat, setIsCongrat] = useState(false);
  const [bannerModal, setBannerModal] = useState();
  const [removeModal, setRemoveModal] = useState(false);
  const [addedNFT, setAddedNFT] = useState([]);
  const [isModalNFT, setIsModalNFT] = useState(false);
  const { data } = useMoralisQuery('DiscourseServers', query => query.equalTo('objectId', id).limit(1), [id]);
  const { thumbnail = DEMO_DEFAULT_AVATAR, title: serverTitle, description: serverDescription, addedNFT: serverNFT } = data[0]?.attributes || '-';
  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const btnRef = useRef();

  useEffect(() => {
    setTitle(serverTitle);
    setDescription(serverDescription);
    setBaseFile(UtilService.ConvetImg(thumbnail));
    serverNFT && setAddedNFT(JSON.parse(serverNFT));
  }, [data])

  const onChangeFile = async (e) => {
    let uploadFile = e.target.files[0];

    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile);
      setBaseFile(base64)
      setFile(uploadFile);
    }
  };

  const onUpdateServer = async () => {
    setIsLoading(true)
    let image;
    if (file) {
      const result = await ipfs.add(file);
      image = 'ipfs://' + result.path;
    }

    const DiscourseServers = new Moralis.Query('DiscourseServers');
    DiscourseServers.equalTo('objectId', id);
    const object = await DiscourseServers.first();
    await object.save()
      .then((x) => {
        file && x.set('thumbnail', image);
        x.set('title', title);
        x.set('description', description);
        x.set('addedNFT', JSON.stringify(addedNFT));
        dispatch(addNotification('Update successful', 'success'))
        setIsCongrat(true);
        setTimeout(() => {
          router.back();
        }, 2000)
        return x.save();
      }, (error) => {
        dispatch(addNotification('Sorry! Failed to update the server. Try again', 'error'))
      });

    setIsLoading(false);

  }

  const onRemoveBanner = async () => {
    setFile(null);
    setBaseFile(null);
    setBannerModal(false)
  }

  const onCancel = () => {
    setFile();
    setBaseFile();
    setTitle('');
    setDescription('');
  }

  const onRemoveDiscourse = async() => {
    setRemoveModal(false);
    setIsLoading(true)
    const DiscourseServersQuery = new Moralis.Query('DiscourseServers');
    DiscourseServersQuery.equalTo('objectId', id);
    const object = await DiscourseServersQuery.first();

    if (object) {
      object.destroy().then(() => {
        setIsLoading(false)
        dispatch(addNotification('Remove successful', 'success'));
        router.push('/home', undefined, { shallow: true })
      }, (error) => {
      });
    } else {
      setIsLoading(false)
      dispatch(addNotification('Can\'t remove this Discourse!', 'error'));
    }
  }

  return (
    <LayoutPage container congrat={isCongrat}>
      {isLoading && <Loading />}
      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Update Discourse Server</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Discourse Server Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Discourse Server Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-30" />

                <div className="d-row ">
                  <div className="offer-btn buy-btn" onClick={onUpdateServer} style={{ width: 100 }}>
                    Save
                  </div>

                  <div
                    className="ml-4 offer-btn color-b"
                    style={{ width: 100 }}
                    onClick={() => onCancel()}
                  >Cancel</div>

                  <div
                    className="ml-4 offer-btn color-b bg-red"
                    style={{ width: 100 }}
                    onClick={() => setRemoveModal(true)}
                  >Remove</div>
                </div>

              </div>

            </form>
          </div>

          <div className="col-lg-4 col-sm-6 col-xs-12">

            <h5 className="text-center color-b">Discord Banner </h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='browse' style={{ postion: 'relative' }}>
                <div id="get_file">
                  {(baseFile || file) && <img className='profile-banner' type="button" id="get_file" src={baseFile || file} alt='avatar' />}
                  {!(baseFile || file) && <div className='profile-banner' style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />}
                  <br />
                  <input id='upload_file' type="file" onChange={onChangeFile} className="cursor" ref={btnRef} />
                </div>
              </div>

              <div className="center-div">

                <CustomPopover content="Suggested Size is 680 * 90" placement="bottom">
                  <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => btnRef.current.click()} >
                    <span aria-hidden="true" className="icon_pencil" />
                  </div>
                </CustomPopover>

                {!(!baseFile && !file) && <div className="btn-danger ml-2 cursor" onClick={() => setBannerModal(true)}>
                  <span aria-hidden="true" className="icon_trash" />
                </div>}
              </div>

            </div>

            <GatedNFTDisplayNew 
              data={addedNFT} 
              editable 
              setAddedNFT={setAddedNFT}
            />

            <div className='d-center'>
              <div className="btn-main mt-2 cursor" style={{ padding: '5px 24px' }} onClick={() => setIsModalNFT(true)} >
                <span aria-hidden="true" className="icon_pencil" />
              </div>
            </div>

            <br />

          </div>
        </div>
      </section>

      {bannerModal && <CustomModal
        title={'Remove Banner'}
        description={'Are you sure about removing the Banner?'}
        onClose={() => setBannerModal(false)}
        onApprove={onRemoveBanner}
      />}

      {removeModal && <CustomModal
        title={'Remove Discourse'}
        description={'Are you sure about removing the Discourse?'}
        onClose={() => setRemoveModal(false)}
        onApprove={onRemoveDiscourse}
      />}

      {
        isModalNFT &&
        <ModalAddNFTCommunity
          onClose={() => setIsModalNFT(false)}
          setAddedNFT={setAddedNFT}
          addedNFT={addedNFT}
        />
      }

    </LayoutPage>
  );
}

export default EditDiscordServerPage;

