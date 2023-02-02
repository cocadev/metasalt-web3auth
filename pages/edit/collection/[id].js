import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import { TinyLoading } from '../../../components/loading';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss';
import { DEMO_DEFAULT_AVATAR, InfuraAuth, InfuraLink } from '../../../keys';
import { create as ipfsHttpClient } from 'ipfs-http-client';
const CustomPopover = dynamic(() => import('../../../components/custom/CustomPopover'));
const CustomModal = dynamic(() => import('../../../components/custom/customModal'));

const EditCollectionPage = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const collectionId = router.query.id;

  const { Moralis, account, isInitialized } = useMoralis();
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

  const { data: brands } = useMoralisQuery('RealBrands', query => query.equalTo('creatorId', account), [account]);

  const MYBRANDS = brands.map((item, index) => {
    return {
      id: index,
      value: item.id,
      label: item.attributes.title,
      icon: 'fa-image',
      title: item.attributes.title,
      description: item.attributes.description,
      banner: item.attributes.banner,
    }
  })

  useEffect(() => {
    isInitialized && MYBRANDS.length > 0 && onGetCollection();
  }, [isInitialized, brands])

  const onGetCollection = async () => {
    const Collections = Moralis.Object.extend('Brands');
    const query = new Moralis.Query(Collections);
    query.equalTo('objectId', collectionId);

    const object = await query.first();
    const { title, description, avatar, banner, brand } = object?.attributes || '';
    const filterCategory = MYBRANDS.find(item => item.value === brand);
    setCategory({ value: filterCategory.value, label: filterCategory.title });
    setTitle(title);
    setDescription(description);
    avatar && setFile1(avatar);
    banner && setFile2(banner);
  }

  const btnRef1 = useRef();
  const btnRef2 = useRef();

  const onChangeFile1 = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setBaseFile1(base64);
      const result = await ipfs.add(file);
      setFile1('ipfs://' + result.path);
    }
  };

  const onChangeFile2 = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setBaseFile2(base64);
      const result = await ipfs.add(file);
      setFile2('ipfs://' + result.path);    }
  };

  const onUpdateCollection = async () => {

    if (!account) {
      router.push('/wallet', undefined, { shallow: true })
      return false;
    }

    if (!title || !description || !category || !file1 || !file2) {
      const param = !title ? 'Title' : !description ? 'Description' : !category ? 'Brand' : !file1 ? 'Collection Image' : 'Collection Banner';
      dispatch(addNotification(`${param} is not optional.`, 'error'))

      return false;
    }

    setIsLoading(true);

    const Brands = new Moralis.Query('Brands');
    Brands.equalTo('objectId', collectionId);
    const object = await Brands.first();
    await object.save()
      .then((x) => {
        x.set('title', title);
        x.set('description', description);
        x.set('brand', category?.value);
        x.set('avatar', file1);
        x.set('banner', file2);
        dispatch(addNotification('Update successful', 'success'))
        return x.save();
      }, (error) => {
        dispatch(addNotification('Sorry! Failed to update the collection. Try again', 'error'))
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

  const handleBrand = async (e) => {
    setCategory({ value: e.value, label: e.label });

    // setBrand(e.value);
    // const RealBrandsQuery = new Moralis.Query('RealBrands');
    // RealBrandsQuery.equalTo('objectId', e.value);
    // const object1 = await RealBrandsQuery.first();
    // setCategory(object1?.attributes?.category);
  }

  const onCancel = () => {
    onGetCollection();
  }

  return (
    <LayoutPage container>

      <section>

        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Edit Collection</Title>

                <div className="spacer-single"></div>

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
                  data-autoresize
                  className="form-control"
                  placeholder="Tell the world your story!"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10" />

                <div className="d-row align-center">
                  <h5 className="color-b">Brand</h5>
                  <Link href='/create/brand' prefetch={false}>
                    <input type="button" className="btn-main tiny-btn" value="New Brand" style={{ width: 85 }} />
                  </Link>
                </div>

                <div className='dropdownSelect one'>
                  <Select
                    styles={selectStyles}
                    menuContainerStyle={{ 'zIndex': 999 }}
                    options={[...MYBRANDS]}
                    onChange={handleBrand}
                    value={category}
                  />
                </div>

                <div className="spacer-30" />

                <div className="d-row ">
                  {!isLoading ? <div className="offer-btn buy-btn" onClick={onUpdateCollection} style={{ width: 100 }}>
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
            <h5 className="text-center mt-50 color-b">Collection Image</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='browse'>
                <img className='profile-avatar' type="button" id="get_file" style={{ marginTop: 0, }} src={baseFile1 || file1 || DEMO_DEFAULT_AVATAR} alt='avatar' /><br />
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

            <h5 className="text-center color-b">Collection Banner</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='browse' style={{ postion: 'relative' }}>
                <div id="get_file">
                  {(baseFile2 || file2) && <img className='profile-banner' type="button" id="get_file" src={baseFile2 || file2} alt='avatar' />}
                  {!(baseFile2 || file2) && <div className='profile-banner' />}
                  <br />
                  <input id='upload_file' type="file" onChange={onChangeFile2} className="cursor" ref={btnRef2} />
                </div>
              </div>

              <div className="center-div">
                
                <CustomPopover content="Suggested Size is 680 * 90" placement="bottom">
                  <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => btnRef2.current.click()} >
                    <span aria-hidden="true" className="icon_pencil" />
                  </div>
                </CustomPopover>

                {!(!baseFile2 && !file2) && <div className="btn-danger ml-2 cursor" onClick={() => setBannerModal(true)}>
                  <span aria-hidden="true" className="icon_trash" />
                </div>}
              </div>

            </div>
            <br />

          </div>

        </div>

      </section>

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

export default EditCollectionPage;

const selectStyles = {
  option: (base, state) => ({
    ...base,
    background: '#303030',
    // color: "hsl(0, 0%, 50%)",
    color: '#fff',
    borderRadius: state.isFocused ? '0' : 0,
    '&:hover': {
      backgroundColor: '#8364E2',
      color: '#fff'
    }
  }),
  menu: base => ({
    ...base,
    borderRadius: 0,
    marginTop: 0
  }),
  menuList: base => ({
    ...base,
    padding: 0
  }),
  control: (base, state) => ({
    ...base,
    padding: 2
  })
};