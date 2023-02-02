import dynamic from 'next/dynamic';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateGated } from '../../store/actions/nfts/nfts';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function GateStep1() {

  const dispatch = useDispatch();
  const { gated } = useSelector(state => state.nfts);
  const { title, description } = gated;
  const isAvailable = title && description;

  const onDiscard = () => {
    dispatch(onUpdateGated({ description: null, title: null, step: 0 }))
  }

  return (
    <div className="col-lg-6 m-auto">
      <h2 className="text-white">Details</h2>
      <h4 className="text-white">Name your NFT gate</h4>
      <div className="d-flex mb-2" style={{ border: "1px solid #ccc" }}>
        <textarea
          className="form-control m-0"
          rows="2"
          style={{ border: "1px solid #ccc" }}
          value={title}
          onChange={e => dispatch(onUpdateGated({ title: e.target.value }))}
        />
      </div>
      <div className="d-flex mb-4">
        <h5 className="text-white ms-auto">{title?.length}/154</h5>
      </div>
      <h4 className="text-white">Describe what it does and why</h4>
      <div className="d-flex mb-4">
        <ReactQuill
          className='w-100 text-white mb-4'
          style={{ minHeight: "150px" }}
          value={description}
          onChange={e => dispatch(onUpdateGated({ description: e }))}
        />
      </div>
      <div className="d-flex">
        <h5 className="text-white ms-auto my-2">{description?.length}/154</h5>
      </div>
      <div className="d-flex">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        <button className={`btn btn-primary my-3 ms-3 ${!isAvailable && 'btn-disabled'}`} onClick={() => dispatch(onUpdateGated({ step: 2 }))}>Save & Continue</button>
      </div>
    </div>
  )
}
export default GateStep1;