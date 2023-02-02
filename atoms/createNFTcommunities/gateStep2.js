import React from "react";
import { useDispatch } from "react-redux";
import { onUpdateGated } from '../../store/actions/nfts/nfts';
import UtilService from '../../sip/utilService';
import { addNotification } from '../../store/actions/notifications/notifications';

function GateStep2({ baseFile }) {

  const dispatch = useDispatch();
  const onChangeFile = async (e) => {

    let file = e.target.files[0];

    if (!file?.type?.includes('image')) {
      dispatch(addNotification('Only allowed to upload the image file here!', 'error'));
      return false;
    }

    if (file) {
      const base64 = await UtilService.convertBase64(file);
      dispatch(onUpdateGated({ baseFile: base64 }))
      dispatch(onUpdateGated({ file }))
    }
  };

  const onDiscard = () => {
    dispatch(onUpdateGated({ baseFile: null, file: null, step: 1 }))
  }

  return (
    <div className="col-lg-6 m-auto">
      <h2 className="text-white">Content</h2>
      <h4 className="text-white">Upload NFT Community image</h4>
      <div className="d-flex">
        <div className="my-3 w-100 my-4 d-flex" style={{ minHeight: "150px", border: "1px dashed #8364E2" }}>

          <div className="d-flex flex-column m-auto">
            <div className='m-4 text-center color-7'>Create a community landing page. The landing page file supports JPG, PNG, GIF, and SVG files under 100MB.</div>

            <div className="my-3 mx-auto d-center">
              {baseFile && <img src={baseFile} alt={'nft'} style={{ maxWidth: 300, maxHeight: 300 }} />} <br />
              <button className="btn btn-primary mt-3" onClick={e => document.getElementById('file').click()}>
                <input type="file" id="file" className='d-none' onChange={onChangeFile} />
                <span>+ Browse</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex mt-3">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        <button
          className={`btn btn-primary my-3 ms-3 ${!baseFile && 'btn-disabled'}`}
          onClick={() => dispatch(onUpdateGated({ step: 4 }))}
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}

export default GateStep2;