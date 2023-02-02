import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { useSelector } from 'react-redux';
import UtilService from '../../sip/utilService';
import { DEMO_DEFAULT_AVATAR } from '../../keys';
const CustomPopover = dynamic(() => import('../custom/CustomPopover'));

const NFTContent = styled.div`
  position: relative;
  border: 2px solid ${props => props.active ? 'green' : 'red'};
  width: 80px;
  font-size: 12px;
  margin-right: 12px;
  border-radius: 8px;
  margin-bottom: 6px;
  overflow: hidden;
  img {
    width: 70px;
    height: 70px;
    margin: 4px;
    border-radius: 8px;
  }
`

const All = styled.div`
  position: absolute;
  right: 2px;
  top: 2px;
  color: #fff;
  padding: 0 4px;
  border-radius: 4px;
  background: #0d3562;
  font-size: 11px;
`

const And = styled.div`
  padding: 1px 2px;
  background: ${props => props.active ? '#0075ff' : '#333'} ;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3px;
  cursor: pointer;
  color: #fff;
`
const Or = styled.div`
  padding: 1px 2px;
  background: ${props => props.active ? '#0075ff' : '#333'} ;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3px;
  cursor: pointer;
  color: #fff;
`

const GatedNFTDisplayNew = ({ data, editable, setAddedNFT }) => {

  const Web3Api = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const [isValidImg, setIsValidImg] = useState([]);
  const [gatedContents, setGatedContents] = useState([]);
  const { nfts: nfts721 } = useSelector(state => state.nfts);

  useEffect(() => {
    if (isInitialized) {
      onGetActivity();
    }
  }, [isInitialized, data, nfts721?.length])

  const onGetActivity = async () => {

    const nftContents = await Promise.all(data.map(async (x) => {

      const isMetasalt = UtilService.checkMetasalt(x.token_address);

      let meta = null;
      if (isMetasalt) {
        meta = await nfts721?.find(p => p.token_address === x.token_address && p.token_id === x.token_id)
      } else {
        meta = await Web3Api.token.getTokenIdMetadata({
          chain: x.chainId,
          address: x.token_address,
          token_id: x.isAll ? 1 : x.token_id,
        })
      }

      if (!meta) { return x } else {
        const metadata = JSON.parse(meta.metadata);
        const image = UtilService.ConvetImg(metadata?.image);
        const isVideo = metadata.isVideo
        return { ...x, image, name: metadata?.name, isMetasalt, isVideo }
      }
    }))

    setGatedContents(nftContents);

  }

  const onErrorVideo = (e, pp) => {
    if (e.type === 'error') {
      setIsValidImg(isValidImg.concat(pp));
    } else {
      return null
    }
  }

  const onClickAddOr = (index, value) => {
    let myArray = data;
    myArray[index].or = value;
    setAddedNFT([...myArray])
  }

  return (
    <div>
      <div className='text-center title-font'>NFTs</div>

      {gatedContents.length > 0
        ? <div className='offer-body mt-2'>
          <div className='flex flex-row hidden flex-wrap '>
            <div className="d-row flex-wrap d-center">
              {
                gatedContents.map((x, index) =>
                  <CustomPopover
                    key={index}
                    content={!x.or ? 'Mandatory NFT to access the content' : 'Need at least one NFT to access the content'}
                    placement='bottom'
                  >

                    <NFTContent active={x.or}>

                      {!x.isVideo && <img src={x.image || DEMO_DEFAULT_AVATAR} alt='nft image' />}
                      {x.isVideo && <video src={x.image} preload="auto" autoPlay={true} style={{ height: 70 }}></video>}

                      {x.isAll && <All>All</All>}

                      <div className="text-center" style={{ maxHeight: 17, overflow: 'hidden' }}>
                        {x.name}
                      </div>

                      {editable && <div className='d-center d-row'>
                        <And active={!x.or} onClick={() => onClickAddOr(index, !x.or)}>And</And>
                        <Or active={x.or} onClick={() => onClickAddOr(index, !x.or)}>Or</Or>
                      </div>}

                    </NFTContent>
                  </CustomPopover>
                )
              }
            </div>
          </div>
        </div> : <div className='text-center text-danger'>No NFTs Added!</div>}
    </div>
  );
};

export default GatedNFTDisplayNew;        
