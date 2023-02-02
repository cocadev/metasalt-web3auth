import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import { TinyLoading } from '../../components/loading';
import GatedNFTDisplayNew from '../../components/cards/GatedNFTDisplayNew';
import ModalAddNFTCommunity from '../../components/modals/modalAddNFTCommunity';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { createMusic, getMusicChannelsByCreatorId } from '../../common/api';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import { DropdownStyles } from '../../constants/dropdownlist';
import { Title } from '../../constants/globalCss'
import { BACKEND_API, InfuraAuth, InfuraLink } from '../../keys';

const CreateVideoPage = () => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useWeb3Auth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState(null)
  const [baseFile, setBaseFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [baseFileThumbnail, setBaseFileThumbnail] = useState(null)
  const [isModalNFT, setIsModalNFT] = useState(false)
  const [addedNFT, setAddedNFT] = useState([])
  const [isCongrat, setIsCongrat] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [channel, setChannel] = useState('');
  const [musicChannels, setMusicChannels] = useState([])

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    const loadMusicChannelsByCreatorId = async () => {
      const response = await getMusicChannelsByCreatorId({ creatorId: user?.account })
      if (response) {
        const reMusicChannels = response.map((item) => {
          return {
            label: item.attributes.title,
            value: item.id
          }
        })
        setMusicChannels(reMusicChannels)
      }
    }

    if (user?.account) {
      loadMusicChannelsByCreatorId().then()
    }
  }, [user?.account])

  const onChangeFile = async (e) => {
    let uploadFile = e.target.files[0];
    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile);
      setBaseFile(base64);
      setFile(uploadFile);
    }
  };

  const onChangeMusicThumbnail = async (e) => {
    const uploadFile = e.target.files[0];
    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile);
      setBaseFileThumbnail(base64)
      const result = await ipfs.add(uploadFile);
      setThumbnail('ipfs://' + result.path);
    }
  };

  const onUploadMusic = async () => {

    if (!isAuthenticated) {
      router.push('/login', undefined, { shallow: true }).then()
      return false;
    }

    if (!title || !description || !baseFile || !channel) {
      const param = !title ? 'Title' : !description ? 'Description' : !channel ? 'Channel' : 'Music File';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }

    setIsLoading(true);

    const musicId = uuidv4();

    const response = await fetch(`${BACKEND_API + musicId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ 'mediaType': file.type })
    })

    const res = await response.json();
    if (res?.preSignedUrl) {
      onUploadApiCall(res?.preSignedUrl, musicId).then()
    }
  }

  const onUploadApiCall = async (url, id) => {

    axios.put(url, file, { headers: { 'Content-Type': file.type } })
      .then(async (res) => {
        if (res) {
          await createMusic({
            owner: user?.id,
            musicId: id,
            title,
            description,
            category,
            musicChannelId: channel,
            addedNFT: JSON.stringify(addedNFT),
            thumbnail
          })
          setIsLoading(false);
          dispatch(addNotification('Upload successful', 'success'))
          setIsCongrat(true);
          setTimeout(() => router.back(), 2000)
        }
      })
  }

  const handleCategory = (e) => {
    setCategory(e.value);
  }

  const handleChannel = (e) => {
    setChannel(e.value);
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
                <Title left>Create New Music</Title>

                <div className="spacer-single"/>

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Video Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10"/>

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Video Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10"/>

                <h5 className="color-b">Category</h5>
                <Select
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 998 }}
                  options={CATEGORIES_COLLECTIONS}
                  onChange={handleCategory}
                />

                <div className="spacer-30"/>

                <div className="d-row align-center">
                  <h5 className="color-b">Music Channel</h5>
                  <Link href='/create/musicChannel' prefetch={false}>
                    <input type="button" className="btn-main tiny-btn" value="New Channel"/>
                  </Link>
                </div>

                <Select
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 999 }}
                  options={musicChannels}
                  onChange={handleChannel}
                />

                <div className="spacer-30"/>

                <div className="d-row ">
                  {!isLoading ?
                    <div className="offer-btn buy-btn" onClick={onUploadMusic} style={{ width: 100 }}>Save</div>
                    :
                    <TinyLoading/>
                  }

                  <div className="ml-4 offer-btn color-b" style={{ width: 100 }} onClick={() => onCancel()}>Cancel</div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-4 col-sm-12 col-xs-12">

            <div className="w-full">
              <div className="my-3 mx-auto d-center">
                <div className="flex flex-row">
                  <button className="btn btn-primary" onClick={() => document.getElementById('file').click()}>
                    <input type="file" id="file" className='d-none' onChange={onChangeFile}/>
                    <span>+ Upload Music</span>
                  </button>
                </div>
                <br/>
                <div className="color-b text-center overflow-hidden" style={{ width: 300 }}>{file && file.name}</div>
              </div>
            </div>

            {!baseFileThumbnail &&
              <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
                <div className="my-3 w-100 my-4 d-flex"
                     style={{ minHeight: '150px', border: '1px dashed #8364E2', maxWidth: 600 }}>
                  <div className="d-flex flex-column m-auto">
                    <div className='m-3 text-center color-7'>
                      How do you upload a thumbnail? Basically
                      <span className='color-b fw-6'> you can create anything in the support file formats under JPG, JPEG, BMP...</span>
                    </div>

                    <div className="my-3 mx-auto d-center">
                      <button className="btn btn-primary" onClick={() => document.getElementById('thumbnail').click()}>
                        <input type="file" id="thumbnail" className='d-none' onChange={onChangeMusicThumbnail}/>
                        <span>+ Upload Thumbnail</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }

            <div className='d-center'>
              {baseFileThumbnail && <picture><img style={{ width: 300 }} src={baseFileThumbnail} alt='' /></picture>}
            </div>

            {baseFile &&
              <div className='d-center'>
                <div className="my-3 mx-auto d-center">
                  <div className="btn-main" onClick={() => document.getElementById('file').click()}>
                    <input type="file" id="file" className='d-none' onChange={onChangeFile}/>
                    <span aria-hidden="true" className="icon_pencil"/>
                  </div>
                </div>
              </div>
            }

            <div className='spacer-single'/>

            <GatedNFTDisplayNew editable data={addedNFT} setAddedNFT={setAddedNFT}/>

            <div className='d-center'>
              <div className="btn-main mt-2 cursor" style={{ padding: '5px 24px' }} onClick={() => setIsModalNFT(true)}>
                <span aria-hidden="true" className="icon_pencil"/>
              </div>
            </div>

            <br/>
          </div>
        </div>
      </section>

      {isModalNFT &&
        <ModalAddNFTCommunity addedNFT={addedNFT} setAddedNFT={setAddedNFT} onClose={() => setIsModalNFT(false)}/>}
    </LayoutPage>
  );
}

export default CreateVideoPage;