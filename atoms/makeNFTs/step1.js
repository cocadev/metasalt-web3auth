import dynamic from 'next/dynamic';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateCreator } from '../../store/actions/nfts/nfts';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


function Step1() {

  const dispatch = useDispatch();
  const { nft } = useSelector(state => state.nfts);
  const { title, description, counts, erc1155, privateSale } = nft;
  const isAvailable = title && description && counts > 0;
  
  const onDiscard = () => {
    dispatch(onUpdateCreator({ description: null, title: null, counts: 1, step: 0 }))
  }

  return (
    <div className="col-lg-6 m-auto">
      <h2 className="text-white">Details</h2>
      <h4 className="text-white">Give your NFT a unique name</h4>
      <div className="d-flex mb-2" style={{ border: '1px solid #ccc' }}>
        <textarea
          className="form-control m-0"
          rows="2"
          style={{ border: '1px solid #ccc' }}
          value={title}
          onChange={e => dispatch(onUpdateCreator({ title: e.target.value }))}
        />
      </div>
      <div className="d-flex mb-4">
        <h5 className="text-white ms-auto">{title?.length || 0}/35</h5>
      </div>
      <h4 className="text-white">Describe your NFT (utility, art, collectible)</h4>
      <div className="d-flex mb-4">
        <ReactQuill
          className='w-100 text-white mb-4'
          style={{ minHeight: '150px' }}
          value={description}
          onChange={e => dispatch(onUpdateCreator({ description: e }))}
        />
      </div>
      <div className="d-flex">
        <h5 className="text-white ms-auto my-2">{description?.length || 0}/150</h5>
      </div>

      <div className='d-flex mb-3 mt-3'>
        <div
          className={erc1155 ? 'btn-small-deactive' : 'btn-small-active'}
          onClick={() => dispatch(onUpdateCreator({ erc1155: false }))}
        >ERC721</div>
        <div
          className={!erc1155 ? 'btn-small-deactive' : 'btn-small-active'}
          onClick={() => dispatch(onUpdateCreator({ erc1155: true }))}
        >ERC1155</div>
      </div>

      {erc1155 && <>
        <h4 className="text-white">Number of NFTs that should be minted</h4>
        <div className="d-flex mb-2" style={{ border: '1px solid #8364E2' }}>
          <input
            className="form-control m-0"
            style={{ border: '1px solid #ccc' }}
            type="number"
            value={counts}
            onChange={e => dispatch(onUpdateCreator({ counts: e.target.value }))}
          />
        </div>
      </>}

      <div className='d-flex mb-3 mt-5'>
        <div
          className={privateSale ? 'btn-small-deactive' : 'btn-small-active'}
          onClick={() => dispatch(onUpdateCreator({ privateSale: false }))}
        >Public</div>
        <div
          className={!privateSale ? 'btn-small-deactive' : 'btn-small-active'}
          onClick={() => dispatch(onUpdateCreator({ privateSale: true }))}
        >Private</div>
      </div>

      <div className="d-flex">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        <button className={`btn btn-primary my-3 ms-3 ${!isAvailable && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 2 }))}>Save & Continue</button>
      </div>
    </div>
  )
}

export default Step1;
