import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ModalAddNFT from '../../components/modals/modalAddNFT';
import { onUpdateGated } from '../../store/actions/nfts/nfts';
import moment from 'moment';
import UtilService from "../../sip/utilService";

function GateStep3() {

  const { gated } = useSelector(state => state.nfts);
  const { title, addedNFT, andOrList, addedGlobalNFT } = gated;
  const [isModalNFT, setIsModalNFT] = useState(false);
  const [isValidImg, setIsValidImg] = useState([]);
  const dispatch = useDispatch();

  const onClose = () => {
    setIsModalNFT(false);
    dispatch(onUpdateGated({ andOrList: [] }))
  }

  const onDiscard = () => {
    dispatch(onUpdateGated({ addedNFT: [], step: 2 }))
  }

  const onSave = () => {
    dispatch(onUpdateGated({ step: 4 }))
  }

  const onErrorVideo = (e, pp) => {
    if(e.type === 'error'){
      setIsValidImg(isValidImg.concat(pp));
    }else{
      return null
    }
  }
  
  return (
    <div className="col-lg-6 m-auto">
      <h2 className="text-white">{title}</h2>
      <h4 className="text-white">Give access to these NFTs Owners</h4>
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary ms-auto my-3" onClick={() => setIsModalNFT(true)}>+ Add NFT</button>
      </div>

      {
        [...addedNFT, ...addedGlobalNFT].map((item, index) => {

          let { image, name } = JSON.parse(item.metadata) || '-';
          image = UtilService.ConvetImg(metadata.image);

          return <div className="my-3 relative" style={{ border: "2px solid #8364E2", borderRadius: "10px" }}>
            <div key={index} className="d-flex py-3 px-4 align-items-center justify-content-between relative">
              <div className='d-center' style={{ width: 120 }}>
                {!isValidImg.includes(index) && <video src={image} preload="auto" autoPlay={true} onError={e => onErrorVideo(e, index)} style={{ height: 50 }}></video>}
                {isValidImg.includes(index) && <img src={image} alt="pic" className='img-fluid' style={{ height: 50 }} />}
              </div>
              <h4 className="text-white m-0">{name}</h4>
              <h5 className="text-white m-0">{moment(item.synced_at).format('L, LT')}</h5>
              <span
                className='icon_close_alt f-32 position-absolute cursor'
                style={{ right: -20, top: -20 }}
                onClick={() => {
                  const removedList = addedNFT.filter(x => x.token_id !== item.token_id);
                  dispatch(onUpdateGated({ addedNFT: removedList, andOrList: [] }))
                }}
              />
            </div>

            {index !== [...addedNFT, ...addedGlobalNFT].length - 1 &&
              <div className='d-flex mb-3 mt-3 position-absolute cursor' style={{ right: -150, bottom: -45 }}>
                <div
                  className={!andOrList.includes(index) ? 'btn-small-deactive' : 'btn-small-active'}
                  style={{ width: 50 }}
                  onClick={() => { !andOrList.includes(index) && dispatch(onUpdateGated({ andOrList: [...andOrList, index] })) }}
                >AND</div>
                <div
                  className={andOrList.includes(index) ? 'btn-small-deactive' : 'btn-small-active'}
                  style={{ width: 50 }}
                  onClick={() => {
                    const removed = andOrList.filter(c => c !== index)
                    dispatch(onUpdateGated({ andOrList: [...removed] }))
                  }
                  }
                >OR</div>
              </div>}

          </div>
        })
      }

      <div className="d-flex">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        <button className={`btn btn-primary my-3 ms-3 ${[...addedNFT, ...addedGlobalNFT].length === 0 && 'btn-disabled'}`} onClick={onSave}>Save & Continue</button>
      </div>

      {
        isModalNFT &&
        <ModalAddNFT
          onClose={onClose}
        />
      }
    </div>
  )
}

export default GateStep3;