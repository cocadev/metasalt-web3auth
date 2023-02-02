import { useRouter } from 'next/router';
import React, { useState, useEffect, createRef, useCallback } from 'react';
import Select from 'react-select';
import { useScreenshot } from 'use-react-screenshot';
import { v4 as uuidv4 } from 'uuid';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import GatedNFTDisplayNew from '../../components/cards/GatedNFTDisplayNew';
import ModalAddNFTCommunity from '../../components/modals/modalAddNFTCommunity';
import { TinyLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { createVideo } from '../../common/api';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import { DropdownStyles } from '../../constants/dropdownlist';
import { Title } from '../../constants/globalCss'
import { BACKEND_API } from '../../keys';
import { InfuraAuth, InfuraLink } from '../../keys';

const CreateVideoPage = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useWeb3Auth()
  const [image, takeScreenshot] = useScreenshot()
  const ref = createRef(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState(null)
  const [baseFile, setBaseFile] = useState(null)
  const [addedNFT, setAddedNFT] = useState([])
  const [isModalNFT, setIsModalNFT] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const onUploadThumbnail = useCallback(async () => {
    if (!image) return false
    const result = await ipfs.add(UtilService.dataURLtoFile(image, 'thumbnail.json'))
    onUploadVideo(file, result).then()
  }, [file, image, ipfs])

  useEffect(() => {
    if (image) {
      onUploadThumbnail().then();
    }
  }, [image])

  const onChangeFile = async (e) => {
    const uploadFile = e.target.files[0];
    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile);
      setBaseFile(base64)
      setFile(uploadFile);
    }
  };

  const getImage = async () => {

    if (!isAuthenticated) {
      handleRouters('/login')
      return false;
    }

    if (!title || !description || !category) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Category';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    if (isAuthenticated) {
      setIsLoading(true)
      takeScreenshot(ref.current)
    } else {
      handleRouters('/login')
    }
  };

  const onUploadVideo = async (file, thumbnail) => {
    const videoId = uuidv4()

    const response = await fetch(`${BACKEND_API + videoId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ 'mediaType': file.type })
    })
    const res = await response.json()

    if (res?.preSignedUrl) {
      onUploadApiCall(res?.preSignedUrl, file, videoId, thumbnail).then()
    }
  }

  const onUploadApiCall = async (url, file, id, thumbnail) => {

    const duration = await UtilService.getVideoDuration(file)

    axios.put(url, file, { headers: { 'Content-Type': file.type } })
      .then(async (res) => {
        setIsLoading(false);
        if (res) {
          await createVideo({
            owner: user?._id,
            videoId: id,
            thumbnail: 'ipfs://' + thumbnail.path,
            duration,
            title,
            description,
            category,
            addedNFT: JSON.stringify(addedNFT)
          })
          dispatch(addNotification('Upload successful', 'success'))
          setIsCongrat(true);
          setTimeout(() => router.back(), 2000)
        }
      })
  }

  const handleCategory = (e) => {
    setCategory(e.value)
  }

  const onCancel = () => {
    setTitle('')
    setDescription('')
    setFile(null)
    setBaseFile(null)
  }

  return (
    <LayoutPage container congrat={isCongrat}>
      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Create New Video</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Video Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Video Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Category</h5>
                <Select
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 999 }}
                  options={[...CATEGORIES_COLLECTIONS]}
                  onChange={handleCategory}
                />

                <div className="spacer-30" />

                <div className="d-row">
                  {!isLoading ?
                    <div className="offer-btn buy-btn" onClick={getImage} style={{ width: 100 }}>Save</div>
                    :
                    <TinyLoading />
                  }

                  <div className="ml-4 offer-btn color-b" style={{ width: 100 }} onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-4 col-sm-12 col-xs-12">

            {!baseFile &&
              <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
                <div className="my-3 w-100 my-4 d-flex" style={{ minHeight: '150px', border: '1px dashed #8364E2', maxWidth: 600 }}>
                  <div className="d-flex flex-column m-auto">
                    <div className='m-3 text-center color-7'>
                      How do you upload a video? Basically
                      <span className='color-b fw-6'> you can create anything in the support file formats under 5GB MOV, MP4, WMA.</span>
                    </div>

                    <div className="my-3 mx-auto d-center">
                      <button className="btn btn-primary" onClick={() => document.getElementById('file').click()}>
                        <input type="file" id="file" className='d-none' onChange={onChangeFile} />
                        <span>+ Upload Video</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }

            {baseFile &&
              <div ref={ref} className='flex flex-wrap align-items-center justify-content-center' style={{ width: 400, height: 283 }}>
                <video
                  controls
                  src={baseFile}
                  preload="auto" autoPlay={true}
                  style={{ maxWidth: 400, maxHeight: 283, border: '3px solid brown', borderRadius: 5 }} />
              </div>
            }

            {baseFile &&
              <div className='d-center'>
                <div className="my-3 mx-auto d-center">
                  <div className="btn-main" onClick={() => document.getElementById('file').click()}>
                    <input type="file" id="file" className='d-none' onChange={onChangeFile} />
                    <span aria-hidden="true" className="icon_pencil" />
                  </div>
                </div>
              </div>
            }

            <div className='spacer-single' />

            <GatedNFTDisplayNew editable data={addedNFT} setAddedNFT={setAddedNFT} />

            <div className='d-center'>
              <div className="btn-main mt-2 cursor" style={{ padding: '5px 24px' }} onClick={() => setIsModalNFT(true)}>
                <span aria-hidden="true" className="icon_pencil" />
              </div>
            </div>

            <br />
          </div>
        </div>
      </section>

      {isModalNFT && <ModalAddNFTCommunity addedNFT={addedNFT} setAddedNFT={setAddedNFT} onClose={() => setIsModalNFT(false)} />}
    </LayoutPage>
  );
}

export default CreateVideoPage;
