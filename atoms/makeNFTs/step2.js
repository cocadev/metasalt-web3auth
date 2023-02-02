import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect, useCallback, useContext } from 'react';
import { useScreenshot } from 'use-react-screenshot';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { onUpdateCreator } from '../../store/actions/nfts/nfts';
import UtilService from '../../sip/utilService';
import { TinyLoading } from '../../components/loading';
import { InfuraAuth, InfuraLink } from '../../keys';
import { useWeb3Auth } from '../../services/web3auth';


function Step2({ baseFile }) {

  const router = useRouter();
  const dispatch = useDispatch();
  const videoRef = useRef();
  const imgRef = useRef();
  const { isAuthenticated } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);
  const [image, takeScreenshot] = useScreenshot();
  const [isVideo, setIsVideo] = useState(false);
  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  useEffect(() => {
    if (image) {
      onUploadThumbnail().then()
    }
  }, [image])

  const getImage = async () => {
    if (!isAuthenticated) {
      router.push('/login', undefined, { shallow: true }).then()
      return false;
    }
    setIsLoading(true);
    takeScreenshot(isVideo ? videoRef.current : imgRef.current)
  };

  const onUploadThumbnail = useCallback(async () => {
    if (!image) return false

    function dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        baseStr = atob(arr[1]), n = baseStr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = baseStr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    const result = await ipfs.add(dataURLtoFile(image, 'thumbnail.png'));

    dispatch(onUpdateCreator({ thumbnail: UtilService.ConvetImg('ipfs://' + result.path) }))
    dispatch(onUpdateCreator({ step: 3 }))
  }, [image])

  const onChangeFile = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);

      if (file.type.includes('video')) {
        dispatch(onUpdateCreator({ isVideo: true }));
        setIsVideo(true);
        setTimeout(() => {
          const myRate = videoRef.current?.clientHeight / videoRef.current?.clientWidth;
          dispatch(onUpdateCreator({ rate: myRate }))
        }, 1500)
      }
      dispatch(onUpdateCreator({ baseFile: base64 }))
      dispatch(onUpdateCreator({ file }))
    }
  };

  const onDiscard = () => {
    dispatch(onUpdateCreator({ baseFile: null, file: null, step: 1 }))
  }

  return (
    <div className="col-lg-6 m-auto">
      <h2 className="text-white">Content</h2>
      <h4 className="text-white">Upload NFT image</h4>
      <div className="d-flex">
        <div className="my-3 w-100 my-4 d-flex" style={{ minHeight: '150px', border: '1px dashed #8364E2' }}>

          <div className="d-flex flex-column m-auto">
            <div className='m-5 text-center color-7'>How do you create an NFT? Basically <span className='color-b fw-6'> you can create anything in the support file formats under 100mb JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF.</span></div>

            <div className="my-3 mx-auto d-center" >
              {baseFile && !isVideo && <picture><img ref={imgRef} src={baseFile} alt={'nft'} className='w-100' style={{ maxWidth: 360, maxHeight: 360, background: '#000' }} /></picture>}
              {baseFile && isVideo && <video ref={videoRef} className='w-100' style={{ maxWidth: 360, maxHeight: 360 }} controls >
                <source src={baseFile} type="video/mp4" />
                Your browser does not support playing this Video
              </video>}
              <button className="btn btn-primary mt-3" onClick={() => document.getElementById('file').click()}>
                <input type="file" id="file" className='d-none' onChange={onChangeFile} />
                <span>+ Browse</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex mt-3">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        {isLoading ?
          <TinyLoading />
          :
          <button className={`btn btn-primary my-3 ms-3 ${!baseFile && 'btn-disabled'}`} onClick={() => getImage()}>
            Save & Continue
          </button>
        }
      </div>
    </div>
  )
}

export default Step2;
