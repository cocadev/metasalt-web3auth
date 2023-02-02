import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ModalAddContent from '../../components/modals/modalAddContent';
import { onUpdateGated } from '../../store/actions/nfts/nfts';
import NFTCommnuity from "../../components/cards/NFTCommnuity";

function GateStep4() {

  const { gated } = useSelector(state => state.nfts);
  const { title } = gated;
  const { addedContent, gateType } = gated;
  const dispatch = useDispatch();

  const [isModalContent, setIsModalContent] = useState(false);
  const [editData, setEditData] = useState();  

  const onClose = () => {
    setIsModalContent(false);
  }

  const onDiscard = () => {
    dispatch(onUpdateGated({ addedContent: [], step: 3 }))
  }

  const onSave = () => {
    dispatch(onUpdateGated({ step: 5 }))
  }

  return (
    <div className="col-lg-9 m-auto">

      <h2 className="text-white">{title}</h2>
      <p className="color-b">{gateType?.label}</p><br />
      <h4 className="text-white">Add content that will be revealed to NFT Owners</h4>

      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-primary ms-auto my-3" 
          onClick={() => {
            setIsModalContent(true);
            setEditData(null);
          }}
        >
          + Add Content
        </button>
      </div>

      <NFTCommnuity 
        content={addedContent} 
        editable 
        onEdit={(e)=>{
          setEditData(e);
          setIsModalContent(true)
        }}
        onRemove={(e)=>{
          dispatch(onUpdateGated({ addedContent: addedContent.filter((x, k) => k !== e)}))
        }}
      />

      <div className="d-flex mt-5">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        <button className={`btn btn-primary my-3 ms-3 ${addedContent.length === 0 && 'btn-disabled'}`} onClick={onSave}>Save & Continue</button>
      </div>

      {
        isModalContent &&
        <ModalAddContent
          onClose={onClose}
          editData={editData}
          addedContent={addedContent}
          onSave={e => dispatch(onUpdateGated({addedContent: e}))}
        />
      }

    </div>
  )
}
export default GateStep4;