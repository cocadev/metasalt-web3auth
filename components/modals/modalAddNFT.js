import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { onGetData, onUpdateGated } from '../../store/actions/nfts/nfts';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';
import { TinyLoading } from '../loading';

const ModalAddNFT = ({ onClose }) => {

  const { Moralis } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const { nfts, gated } = useSelector(state => state.nfts);
  const { addedNFT, addedGlobalNFT } = gated;
  const [tab, setTab] = useState(0);
  const [checkLoading, setCheckLoading] = useState(false);
  const [searchKey, setSearchKey] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [contractTokenId, setContractTokenId] = useState();
  const [isAll, setIsAll] = useState(true);
  const [net, setNet] = useState('eth');
  const router = useRouter();
  const dispatch = useDispatch();
  const ids = addedNFT.map(item => item.token_id)

  const onAdd = (x) => {
    dispatch(onUpdateGated({ addedNFT: [...addedNFT, x] }))
  }

  const onRemove = (x) => {
    const removedList = addedNFT.filter(item => item.token_id !== x.token_id);
    dispatch(onUpdateGated({ addedNFT: removedList }))
  }

  const onCheckNFTIndividual = async () => {
    setCheckLoading(true);
    const c1 = {
      address: contractAddress,
      chain: net,
      token_id: contractTokenId
    };
    try {
      const data = await Web3Api.token.getTokenIdMetadata(c1);
      setCheckLoading(false);
      if (data) {
        if (data && data.metadata) {
          dispatch(onUpdateGated({ addedGlobalNFT: [...addedGlobalNFT, data] }))
          onClose();
        } else {
          dispatch(addNotification('Metadata is not available', 'error'))
        }
      } else {
        dispatch(addNotification('Can\'t find the NFT!', 'error'))
      }
    } catch (e) {
      setCheckLoading(false);
      dispatch(addNotification(e.message, 'error'))
    }
  }

  const onCheckNFTAll = async () => {
    setCheckLoading(true);
    const c1 = {
      address: contractAddress,
      chain: net,
      limit: 1
    };
    try {
      const data = await Web3Api.token.getAllTokenIds(c1);
      setCheckLoading(false);
      if (data) {
        if (data && data?.result?.length > 0) {
          dispatch(onUpdateGated({ addedGlobalNFT: [...addedGlobalNFT, { ...data.result[0], isAll: true }] }))
          onClose();
        } else {
          dispatch(addNotification('Metadata is not available', 'error'))
        }
      } else {
        dispatch(addNotification('Can\'t find the NFT!', 'error'))
      }
    } catch (e) {
      setCheckLoading(false);
      dispatch(addNotification(e.message, 'error'))
    }
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Add NFTs'}
    >

      <div className="w-full flex flex-col" style={{ alignItems: 'flex-start' }}>

        <div className="d-flex flex-row justify-around color-b w-full">
          <p className={`cursor text-center ${tab === 0 ? 'border-4' : 'border-3'}`} onClick={() => setTab(0)}>+ Mainnet NFTs</p>
          <p className={`cursor text-center ${tab === 1 ? 'border-4' : 'border-3'}`} onClick={() => setTab(1)}>+ Lazy NFTs</p>
          <p className={`cursor text-center ${tab === 2 ? 'border-4' : 'border-3'}`} onClick={() => setTab(2)}>+ New NFT</p>
        </div>

        {tab === 0 && <div className="w-full d-flex align-center flex-col mb-3">
          <div className="d-flex flex-row fw-6">
            <div className={`cursor m-2 ${net === 'eth' && 'color-sky'}`} onClick={() => setNet('eth')}>Etherem</div>
            <div className={`cursor m-2 ${net === 'bsc' && 'color-sky'}`} onClick={() => setNet('bsc')}>BSC</div>
            <div className={`cursor m-2 ${net === 'Polygon' && 'color-sky'}`} onClick={() => setNet('Polygon')}>Polygon</div>
          </div>

          <input
            className="form-control"
            placeholder="Smart Contract"
            value={contractAddress}
            onChange={e => setContractAddress(e.target.value)}
          />

          <div className='d-flex mb-4'>
            <div
              className={!isAll ? 'btn-small-deactive' : 'btn-small-active'}
              onClick={() => setIsAll(true)}
            >All IDs</div>
            <div
              className={isAll ? 'btn-small-deactive' : 'btn-small-active'}
              onClick={() => setIsAll(false)}
            >Individual</div>
          </div>

          {!isAll && <input
            className="form-control"
            placeholder="Token Id"
            value={contractTokenId}
            onChange={e => setContractTokenId(e.target.value)}
          />}

          {checkLoading ? <TinyLoading /> : <input
            type="button"
            value="Add NFT"
            onClick={isAll ? onCheckNFTAll : onCheckNFTIndividual}
            className={`${(!contractAddress || (!contractTokenId && !isAll)) && 'btn-disabled'} btn-main`}
            style={{ background: '#0075ff', marginLeft: 10 }}
          />}
        </div>}

        {tab === 1 && <>
          <div className="flex flex-row w-full">
            <input
              className="w-full form-control"
              style={{ border: '1px solid #ccc' }}
              placeholder='Search NFTs'
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
            />
            <div
              style={{ width: 40, height: 40, background: '#333', borderRadius: 8, marginLeft: 6 }}
              className='d-center cursor'
              onClick={() => {
                dispatch(onGetData(Moralis))
              }}
            >
              <span className="icon_refresh" style={{ color: '#bbb' }} />
            </div>
          </div>

          <div style={{ maxHeight: 200, border: '1px solid grey', overflow: 'auto' }} className='w-full mb-3'>
            {
              nfts.map((nft, index) => {
                const { image, name } = JSON.parse(nft.metadata);
                if (searchKey && !name?.toLowerCase().includes(searchKey?.toLowerCase())) {
                  return null
                }

                return (
                  <div
                    key={index}
                    className='flex-row items-center flex align-center'
                  >
                    <div style={{ width: 50, height: 50 }} className='d-center'>
                      <img
                        src={nft?.thumbnail || image}
                        alt=""
                        style={{ width: 'auto', maxHeight: 40, maxWidth: 40 }}
                      />
                    </div>
                    <div style={{ marginLeft: 12, flex: 1 }}>
                      {name}
                    </div>
                    {ids.includes(nft.token_id) ? <span
                      className="icon_circle-slelected cursor"
                      onClick={() => onRemove(nft)}
                      style={{ marginRight: 12, fontSize: 24 }} />
                      : <span
                          className="icon_circle-empty cursor"
                          onClick={() => onAdd(nft)}
                          style={{ marginRight: 12, fontSize: 24 }} 
                        />}
                  </div>
                )
              })
            }

          </div>
        </>}

        {tab === 2 && <div className="mt-5 mb-3 d-center w-full">
          <div
            style={{ background: '#0075ff', marginLeft: 10 }}
            onClick={() => router.push('/makeNFTs?redirect=createNFTcommunities', undefined, { shallow: true })} className='btn-main'>
            Go to Create Page
          </div>

        </div>}
      </div>
    </LayoutModal>
  );
};

export default ModalAddNFT;