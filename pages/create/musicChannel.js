import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import { TinyLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { createMusicChannel, getMusicChannelsByCreatorId } from '../../common/api';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import { Title } from '../../constants/globalCss'
import { DropdownStyles } from '../../constants/dropdownlist';
import { DEMO_AVATAR, DEMO_BACKGROUND, InfuraAuth, InfuraLink, PROFILE_BG } from '../../keys';

const CustomSlide = dynamic(() => import('../../components/custom/CustomSlide'));
const CustomModal = dynamic(() => import('../../components/custom/customModal'));

const CreateMusicChannelPage = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useWeb3Auth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const btnRef1 = useRef();
  const btnRef2 = useRef();
  const [file1, setFile1] = useState(null);
  const [baseFile1, setBaseFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [baseFile2, setBaseFile2] = useState(null);
  const [imgModal, setImgModal] = useState(false)
  const [bannerModal, setBannerModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isCongrat, setIsCongrat] = useState(false);
  const [data, setData] = useState([])

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    const loadMusicChannelsByCreatorId = async () => {
      const response = await getMusicChannelsByCreatorId({ creatorId: user?.account })
      response && setData(response)
    }

    if (user?.account) {
      loadMusicChannelsByCreatorId().then()
    }
  }, [user?.account])

  const onChangeFile1 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setBaseFile1(base64);
      const result = await ipfs.add(file);
      setFile1('ipfs://' + result.path);
    }
  };

  const onChangeFile2 = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setBaseFile2(base64);
      const result = await ipfs.add(file);
      setFile2('ipfs://' + result.path);
    }
  };

  const onSaveProfile = async () => {

    if (!isAuthenticated) {
      router.push('/login', undefined, { shallow: true }).then()
      return false;
    }

    if (!title || !description || !category) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Category';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    setIsLoading(true);
    const response = await createMusicChannel({
      title,
      description,
      category,
      avatar: file1,
      banner: file2,
      creatorId: user?.account,
    })
    setIsLoading(false);

    if (response) {
      dispatch(addNotification(response?.message, 'success'))
      setIsCongrat(true);
      setTimeout(() => router.back(), 2000)      
    } else {
      dispatch(addNotification('Sorry! Failed to create new music community. Try again', 'error'))
    }
  }

  const onRemoveProfile = async () => {
    setFile1(null);
    setBaseFile1(null);
    setImgModal(false)
  }

  const onRemoveBanner = async () => {
    setFile2(null);
    setBaseFile2(null);
    setBannerModal(false)
  }

  const handleCategory = (e) => {
    setCategory(e.value);
  }

  const onCancel = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setFile1(null)
    setBaseFile1(null)
    setFile2(null)
    setBaseFile2(null)
    setImgModal(false)
    setBannerModal(false)
  }

  return (
    <LayoutPage container congrat={isCongrat}>
      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Create New Music Channel</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Enter Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Tell the world your story!"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Type</h5>
                <Select
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 999 }}
                  options={[...CATEGORIES_COLLECTIONS]}
                  onChange={handleCategory}
                />

                <div className="spacer-20" />

                <div className="d-row ">
                  {!isLoading ?
                    <div className="offer-btn buy-btn" style={{ width: 100 }} onClick={onSaveProfile}>
                      Save
                    </div>
                    :
                    <TinyLoading />
                  }

                  <div className="ml-4 offer-btn color-b" style={{ width: 100 }} onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5 className="text-center mt-50 color-b">Music Channel Image (Optional)</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse'>
                <picture>
                  <img className='profile-avatar' id="get_file" style={{ marginTop: 0, }} src={baseFile1 || UtilService.ConvetImg(file1) || DEMO_AVATAR} alt='avatar' />
                </picture>
                <br/>
                <input id='upload_file' type="file" multiple onChange={onChangeFile1} className="cursor" ref={btnRef1} />
              </div>

              <div className="center-div mt-20">
                <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => btnRef1.current.click()}>
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!baseFile1 && !file1) &&
                  <div className="btn-danger ml-2 cursor" onClick={() => setImgModal(true)}>
                    <span aria-hidden="true" className="icon_trash" />
                  </div>
                }
              </div>
            </div>

            <h5 className="text-center color-b">Music Banner (Optional)</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse position-relative'>
                <div id="get_file">
                  {(baseFile2 || file2) &&
                    <picture>
                      <img className='profile-banner' id="get_file" src={baseFile2 || UtilService.ConvetImg(file2)} alt='avatar' />
                    </picture>
                  }
                  {!(baseFile2 || file2) &&
                    <div className='profile-banner' style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />
                  }
                  <br />
                  <input id='upload_file' type="file" onChange={onChangeFile2} className="cursor" ref={btnRef2} />
                </div>
              </div>

              <div className="center-div">
                <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => btnRef2.current.click()}>
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!baseFile2 && !file2) &&
                  <div className="btn-danger ml-2 cursor" onClick={() => setBannerModal(true)}>
                    <span aria-hidden="true" className="icon_trash" />
                  </div>
                }
              </div>
            </div>
            <br/>
          </div>
        </div>
      </section>

      {isAuthenticated && <h3 className="color-b" style={{ textAlign: 'center' }}>My Music Channels</h3>}

      <div className='flex flex-wrap center mt-30 justify-center'>
        {isAuthenticated && data?.map((item, index) => (
          <div key={index} className="mt-10">
            <CustomSlide
              index={index + 1}
              avatar={item.attributes.avatar || DEMO_AVATAR}
              banner={item.attributes.banner || DEMO_BACKGROUND}
              username={item.attributes.title}
              uniqueId={item.attributes.description}
              collectionId={item.id}
              music={true}
              // disableNavigate={true}
            />
          </div>
        ))}
      </div>

      <br/>

      {imgModal &&
        <CustomModal
          title={'Remove Avatar'}
          description={'Are you sure about removing the Avatar?'}
          onClose={() => setImgModal(false)}
          onApprove={onRemoveProfile}
        />
      }

      {bannerModal &&
        <CustomModal
          title={'Remove Banner'}
          description={'Are you sure about removing the Banner?'}
          onClose={() => setBannerModal(false)}
          onApprove={onRemoveBanner}
        />
      }
    </LayoutPage>
  );
}

export default CreateMusicChannelPage;
