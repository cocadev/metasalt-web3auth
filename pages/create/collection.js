import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import { TinyLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { createCollection, getBrandsByCreator, getCollectionsByCreator } from '../../common/api';
import { Title } from '../../constants/globalCss';
import { DropdownStyles } from '../../constants/dropdownlist';
import { DEMO_AVATAR, DEMO_BACKGROUND, DEMO_DEFAULT_AVATAR, InfuraAuth, InfuraLink } from '../../keys';

const CustomSlide = dynamic(() => import('../../components/custom/CustomSlide'));
const CustomPopover = dynamic(() => import('../../components/custom/CustomPopover'));
const CustomModal = dynamic(() => import('../../components/custom/customModal'));

const CreateCollectionPage = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useWeb3Auth()
  const [file1, setFile1] = useState(null)
  const [baseFile1, setBaseFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [baseFile2, setBaseFile2] = useState(null)
  const [bannerModal, setBannerModal] = useState(false)
  const [imgModal, setImgModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)
  const [myBrands, setMyBrands] = useState([])
  const [myCollections, setMyCollections] = useState([])
  const avatarRef = useRef()
  const bannerRef = useRef()

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const onChangeFile1 = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      const result = await ipfs.add(file);
      setBaseFile1(base64);
      setFile1('ipfs://' + result.path);
    }
  };

  const onChangeFile2 = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      const result = await ipfs.add(file);
      setBaseFile2(base64);
      setFile2('ipfs://' + result.path);
    }
  };

  const onSaveProfile = async () => {

    if (!isAuthenticated) {
      router.push('/login', undefined, { shallow: true }).then()
      return false;
    }

    if (!title || !description || !brand || !file1 || !file2) {
      const param = !title ? 'Title' : !description ? 'Description' : !brand ? 'Brand' : !file1 ? 'Collection Image' : 'Collection Banner';
      dispatch(addNotification(`${param} is not optional.`, 'error'))
      return false;
    }

    setIsLoading(true);
    const response = await createCollection({
      title,
      description,
      avatar: file1,
      banner: file2,
      brandId: brand,
      category,
      creatorId: user?.account,
      BGUID: uuidv4(),
    })
    setIsLoading(false)

    if (response?.success) {
      dispatch(addNotification(response.message, 'success'))
      setIsCongrat(true)
      setTimeout(() => router.back(), 2000)
    } else {
      dispatch(addNotification('Sorry! Failed to create a new collection. Try again', 'error'))
    }
  }

  const onRemoveProfile = async () => {
    setFile1(null)
    setBaseFile1(null)
    setImgModal(false)
  }

  const onRemoveBanner = async () => {
    setFile2(null)
    setBaseFile2(null)
    setBannerModal(false)
  }

  const handleBrand = async (e) => {
    setBrand(e.value)
    const filtered = myBrands.filter(item => item.value === e.value)
    setCategory(filtered[0].category)
  }

  const onCancel = () => {
    setFile1(null)
    setBaseFile1(null)
    setFile2(null)
    setBaseFile2(null)
    setBannerModal(false)
    setImgModal(false)
    setTitle('')
    setDescription('')
    setCategory('')
  }


  useEffect(() => {
    const loadBrandsByCreator = async () => {
      const response1 = await getBrandsByCreator({ creatorId: user?.account })
      if (response1) {
        const brands = response1.map((item, index) => {
          return {
            id: index,
            value: item._id,
            label: item.title,
            icon: 'fa-image',
            ...item
          }
        })
        setMyBrands(brands)
      }
      const response2 = await getCollectionsByCreator({ creatorId: user?.account })
      response2 && setMyCollections(response2)
    }

    if (user?.account) {
      loadBrandsByCreator().then()
    }
  }, [user?.account])

  return (
    <LayoutPage container congrat={isCongrat}>

      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Create New Collection</Title>

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

                <div className="d-row align-center">
                  <h5 className="color-b">Brand</h5>
                  <Link href='/create/brand' prefetch={false}>
                    <input type="button" className="btn-main tiny-btn" value="New Brand" style={{ width: 85 }} />
                  </Link>
                </div>

                <div className='dropdownSelect one'>
                  <Select
                    styles={DropdownStyles}
                    menuContainerStyle={{ 'zIndex': 999 }}
                    options={myBrands}
                    onChange={handleBrand}
                  />
                </div>

                <div className="spacer-30" />

                <div className="d-row ">
                  {!isLoading ?
                    <div className="offer-btn buy-btn" onClick={onSaveProfile} style={{ width: 100 }}>Save</div>
                    :
                    <TinyLoading />
                  }

                  <div className="ml-4 offer-btn color-b" style={{ width: 100 }} onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5 className="text-center mt-50 color-b">Collection Image</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse'>
                <picture>
                  <img className='profile-avatar' id="get_file" style={{ marginTop: 0, }} src={baseFile1 || UtilService.ConvetImg(file1) || DEMO_DEFAULT_AVATAR} alt='avatar' />
                </picture>
                <br/>
                <input id='upload_file' type="file" multiple onChange={onChangeFile1} className="cursor" ref={avatarRef} />
              </div>

              <div className="center-div mt-20">
                <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => avatarRef.current.click()}>
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!baseFile1 && !file1) &&
                  <div className="btn-danger ml-2 cursor" onClick={() => setImgModal(true)}>
                    <span aria-hidden="true" className="icon_trash" />
                  </div>
                }
              </div>
            </div>

            <h5 className="text-center color-b">Collection Banner</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='browse position-relative'>
                <div id="get_file">
                  {(baseFile2 || file2) &&
                    <picture>
                      <img className='profile-banner' id="get_file" src={baseFile2 || UtilService.ConvetImg(file2)} alt='avatar' />
                    </picture>
                  }
                  {!(baseFile2 || file2) && <div className='profile-banner' />}
                  <br />
                  <input id='upload_file' type="file" onChange={onChangeFile2} className="cursor" ref={bannerRef} />
                </div>
              </div>

              <div className="center-div">
                <CustomPopover content="Suggested Size is 680 * 90" placement="bottom">
                  <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => bannerRef.current.click()} >
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

      {isAuthenticated && <h3 className="text-center color-b">My Collections</h3>}

      <div className='flex flex-wrap center mt-30 mb-5 justify-center'>
        {isAuthenticated && myCollections?.map((item, index) => (
          <div key={index} className="mt-10">
            <CustomSlide
              index={index + 1}
              avatar={UtilService.ConvetImg(item.avatar) || DEMO_AVATAR}
              banner={UtilService.ConvetImg(item.banner) || DEMO_BACKGROUND}
              username={item.title}
              uniqueId={item.description}
              collectionId={item._id}
            />
          </div>
        ))}
      </div>

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

export default CreateCollectionPage;
