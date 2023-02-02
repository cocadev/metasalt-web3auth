import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateCreator } from '../../store/actions/nfts/nfts';
import Html5QrcodePlugin from './Html5QrcodePlugin';


function Step3() {

  const dispatch = useDispatch();
  const { nft } = useSelector(state => state.nfts);
  const { title, tokenPrice, counts } = nft;
  const [isQrcode, setIsQrcode] = useState(false)

  const onNewScanResult = (decodedText, decodedResult) => {
    dispatch(onUpdateCreator({ code: decodedResult?.decodedText }))
  }

  const onDiscard = () => {
    dispatch(onUpdateCreator({ code: null, step: 2 }))
  }

  return (
    <div className="col-lg-6 m-auto">
      <h2 className="text-white">Content</h2>
      <h4 className="text-white">Upload NFT image</h4>
      <div className="d-flex">
        <div className="w-full mt-3">
          <Html5QrcodePlugin fps={10} qrbox={250} qrCodeSuccessCallback={onNewScanResult} />
        </div>
      </div>

      <h4 className="text-white mt-5">Generate the QR code</h4>
      <button className="btn btn-primary ms-auto my-3" onClick={() => setIsQrcode(true)}>Create QR Code</button>
      <br />

      {isQrcode &&
        <>
          <QRCode value={JSON.stringify({ title, price: tokenPrice, counts })} />
          <div className='mt-2'>QR code</div>
        </>
      }

      <div className="d-flex mt-4">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        <button className="btn btn-primary my-3 ms-3" onClick={() => dispatch(onUpdateCreator({ step: 4 }))}>
          Save & Continue
        </button>
      </div>
    </div>
  )
}

export default Step3;
