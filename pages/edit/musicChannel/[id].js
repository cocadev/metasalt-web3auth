import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import { TinyLoading } from '../../../components/loading';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss'
import { DropdownStyles } from '../../../constants/dropdownlist';
import { CATEGORIES_COLLECTIONS } from '../../../constants/hotCollections';
import { DEMO_AVATAR, InfuraAuth, InfuraLink, PROFILE_BG } from '../../../keys';
import { create as ipfsHttpClient } from 'ipfs-http-client';
const CustomModal = dynamic(() => import('../../../components/custom/customModal'));

const EditMusicPage = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { id: musicId } = router.query;
  const { Moralis, isInitialized } = useMoralis();
  const [file1, setFile1] = useState();
  const [baseFile1, setBaseFile1] = useState();
  const [file2, setFile2] = useState();
  const [baseFile2, setBaseFile2] = useState();
  const [bannerModal, setBannerModal] = useState();
  const [imgModal, setImgModal] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const btnRef1 = useRef();
  const btnRef2 = useRef();

  useEffect(() => {
    isInitialized && onGetBrand();
  }, [isInitialized])

  const onGetBrand = async () => {
    const MusicChannels = Moralis.Object.extend('MusicChannels');
    const query = new Moralis.Query(MusicChannels);
    query.equalTo('objectId', musicId);
    const object = await query.first();
    const { category: t, title, description, avatar, banner } = object?.attributes || '';
    const filterCategory = CATEGORIES_COLLECTIONS.find(item => item.value === t);
    setCategory({ value: t, label: filterCategory.label });
    setTitle(title);
    setDescription(description);
    avatar && setFile1(avatar);
    banner && setFile2(banner);
  }

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

  const onUpdateBrand = async () => {

    if (!title || !description || !category) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Category';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    setIsLoading(true);

    const MusicChannels = new Moralis.Query('MusicChannels');
    MusicChannels.equalTo('objectId', musicId);
    const object = await MusicChannels.first();
    await object.save()
      .then((x) => {
        x.set('title', title);
        x.set('description', description);
        x.set('category', category?.value);
        x.set('avatar', file1);
        x.set('banner', file2);
        dispatch(addNotification('Update successful', 'success'))
        return x.save();
      }, (error) => {
        dispatch(addNotification('Sorry! Failed to update the music. Try again', 'error'))
      });
    setIsLoading(false);
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
    setCategory({ value: e.value, label: e.label });
  }

  const onCancel = () => {
    onGetBrand();
  }

  return (
    <LayoutPage container>

      <section>

        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Edit Music</Title>

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
                  value={category}
                />

                <div className="spacer-30" />

                <div className="d-row ">
                  {!isLoading ? <div className="offer-btn buy-btn" onClick={onUpdateBrand} style={{ width: 100 }}>
                    Save
                  </div> : <TinyLoading />}

                  <div
                    className="ml-4 offer-btn color-b"
                    style={{ width: 100 }}
                    onClick={() => onCancel()}
                  >Cancel</div>
                </div>

              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5 className="text-center mt-50 color-b">Music Community Image (Optional)</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='browse'>
                <img className='profile-avatar' type="button" id="get_file" style={{ marginTop: 0, }} src={baseFile1 || UtilService.ConvetImg(file1) || DEMO_AVATAR} alt='avatar' /><br />
                <input id='upload_file' type="file" multiple onChange={onChangeFile1} className="cursor" ref={btnRef1} />
              </div>

              <div className="center-div mt-20">
                <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => btnRef1.current.click()} >
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!baseFile1 && !file1) && <div className="btn-danger ml-2 cursor" onClick={() => setImgModal(true)}>
                  <span aria-hidden="true" className="icon_trash" />
                </div>}
              </div>

            </div>

            <h5 className="text-center color-b">Music Banner (Optional)</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='browse' style={{ postion: 'relative' }}>
                <div id="get_file">
                  {(baseFile2 || file2) && <img className='profile-banner' type="button" id="get_file" src={baseFile2 || UtilService.ConvetImg(file2)} alt='avatar' />}
                  {!(baseFile2 || file2) && <div className='profile-banner' style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />}
                  <br />
                  <input id='upload_file' type="file" onChange={onChangeFile2} className="cursor" ref={btnRef2} />
                </div>
              </div>

              <div className="center-div">
                <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => btnRef2.current.click()} >
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!baseFile2 && !file2) && <div className="btn-danger ml-2 cursor" onClick={() => setBannerModal(true)}>
                  <span aria-hidden="true" className="icon_trash" />
                </div>}
              </div>

            </div>

            <br />

          </div>
        </div>

      </section>

      <br />

      {imgModal && <CustomModal
        title={'Remove Avatar'}
        description={'Are you sure about removing the Avatar?'}
        onClose={() => setImgModal(false)}
        onApprove={onRemoveProfile}
      />}

      {bannerModal && <CustomModal
        title={'Remove Banner'}
        description={'Are you sure about removing the Banner?'}
        onClose={() => setBannerModal(false)}
        onApprove={onRemoveBanner}
      />}

    </LayoutPage>
  );
}

export default EditMusicPage;

