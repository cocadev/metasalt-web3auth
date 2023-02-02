import { useRouter } from 'next/router';
import React, { memo, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import renderHTML from 'react-render-html';
import Skeleton from 'react-loading-skeleton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Web3 from 'web3';
import axios from 'axios';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import UtilService from '../../sip/utilService';

const royaltyABI = require('../../constants/abis/royaltyABI.json');

const Tag = styled.div`
  background: #333;
  padding: 3px 12px;
  border: 1px solid #555;
  border-radius: 18px;
  margin: 3px 5px;
  font-size: 14px;
`

const Property = styled.div`
  background: #333;
  padding: 3px 12px;
  border: 1px solid #777;
  border-radius: 4px;
  margin: 5px 5px;
  font-size: 14px;
  width: 140px;

  div:nth-child(1) {
    font-size: 12px;
    text-transform: uppercase;
    color: #15b2e5
  }

  div:nth-child(2) {
    font-size: 16px;
    font-weight: 500;
    height: 25px;
    overflow: hidden;
    color: #ccc
  }

  div:nth-child(3) {
    font-size: 12px;
    color: #888
  }
`

const ItemLeftBox = ({ myNFT, brand, totalSupply, sales, creatorAddress, verificationData, orderDataByTokenId }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const [isTitleDescription, setIsTitleDescription] = useState(true)
  const [isTitleDetails, setIsTitleDetails] = useState(true)
  const [isTagsDetails, setIsTagsDetails] = useState(true)
  const [isPropertiesDetails, setIsPropertiesDetails] = useState(true)
  const [fullDisplay, setFullDisplay] = useState(false)
  const [globalRoyalty, setGlobalRoyalty] = useState()

  const { token_id: ercTokenId, token_address, net } = router.query
  const {
    image,
    description,
    category,
    tags,
    attributes,
    royalties,
    isVideo,
    animation_url,
    thumbnail
  } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || ''
  const createdOrder = useMemo(() => orderDataByTokenId.find(item => item?.completed === false), [orderDataByTokenId])
  const { isInitialized, chainId } = useMoralis()

  const type = myNFT?.contract_type || 'ERC721';
  const cTags = tags ? JSON.parse(tags) : [];
  const cImage = animation_url || myNFT?.image || image;

  const ipfsImage = UtilService.ConvetImg(cImage);
  const totalSale = sales.reduce((s, f) => s + (f.owner_of !== creatorAddress ? Number(f.amount) : 0), 0);
  const isNFTVideo = (animation_url && animation_url !== image) ? true : (!!isVideo);

  useEffect(() => {
    try {
      ipfsImage && axios.get(ipfsImage).then(res => {
        if (res) {
          setFullDisplay(true)
        } else {
          setFullDisplay(false)
        }
      })
    } catch {

    }
  }, [ipfsImage])

  useEffect(() => {
    isInitialized && !UtilService.checkMetasalt(token_address) && onGetRoyalty()
  }, [isInitialized])

  const onGetRoyalty = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(royaltyABI.RoyaltyEngineV1ABI, UtilService.getRoyaltyAddress(net));
      const res = await contract.methods.getRoyaltyView(token_address, ercTokenId, 10000).call();
      if (res.amounts.length === 0) {
        setGlobalRoyalty(0);
      } else {
        setGlobalRoyalty((res.amounts[0] / 10000 * 100))
      }
    } catch {
    }
  }

  const LoadingSkeleton = () => {
    return <Skeleton width={100} height={25} />
  }

  /*
  useEffect(() => {
    ipfsImage && axios.head(ipfsImage).then(res => {
      const type = res.headers['content-type'];
      if (type.includes('video')) {
        setIsValidVideo(true)
      } else {
        setIsValidVideo(false)
      }
    })
  }, [ipfsImage])
  */

  return (
    <div>
      {createdOrder &&
        <div className='order-btn-big'>
          <div className='transform-order-text'>Buy</div>
        </div>
      }

      {verificationData.length > 0 &&
        <picture>
          <img
            src={'/img/approval.png'}
            alt='lazy'
            style={{ width: 70, position: 'absolute', right: 0, top: -15, background: '#fff', borderRadius: 35 }}
          />
        </picture>
      }

      {!isNFTVideo &&
        <picture>
          <img
            src={fullDisplay ? ipfsImage : thumbnail}
            alt=''
            style={{ height: 'auto', maxWidth: '100%', maxHeight: 600 }}
          />
        </picture>
      }

      {isNFTVideo && <video src={ipfsImage} controls className='w-100'></video>}

      {!ipfsImage && <Skeleton height={400} />}

      <div className='offer-title' onClick={() => setIsTitleDescription(!isTitleDescription)}>
        <div><span aria-hidden="true" className="icon_menu"></span>&nbsp;&nbsp;Description</div>
        <span aria-hidden="true" className={`arrow_carrot-${!isTitleDescription ? 'down' : 'up'} text24`}></span>
      </div>

      {isTitleDescription &&
        <div className='offer-body'>
          {myNFT ?
            <div className="mt-2">
              {(description && renderHTML(UtilService.convertEmoji(description)))}
            </div>
            :
            <div className="w-100 mt-2">
              <Skeleton height={30} />
              <Skeleton height={30} />
              <Skeleton height={30} />
            </div>
          }
        </div>
      }

      {tags && cTags.length > 0 &&
        <>
          <div className='offer-title' onClick={() => setIsTagsDetails(!isTagsDetails)}>
            <div><span aria-hidden="true" className="icon_menu"></span>&nbsp;&nbsp;Tags</div>
            <span aria-hidden="true" className={`arrow_carrot-${!isTitleDescription ? 'down' : 'up'} text24`}></span>
          </div>

          {isTagsDetails &&
            <div className='offer-body'>
              <div className="mt-2 d-flex flex-row flex-wrap">
                {cTags.map((item, index) => <Tag key={index}>{item}</Tag>)}
              </div>
            </div>
          }
        </>
      }

      {attributes && Array.isArray(attributes) && attributes.length > 0 &&
        <>
          <div className='offer-title' onClick={() => setIsPropertiesDetails(!isPropertiesDetails)}>
            <div><span aria-hidden="true" className="icon_menu"></span>&nbsp;&nbsp;Properties</div>
            <span aria-hidden="true" className={`arrow_carrot-${!isPropertiesDetails ? 'down' : 'up'} text24`}></span>
          </div>

          {isPropertiesDetails &&
            <div className='offer-body'>
              <div className="mt-2 d-flex flex-row flex-wrap">
                {attributes.map((item, index) =>
                  <Property key={index}>
                    <div>{item.trait_type}</div>
                    <div>{item.value}</div>
                  </Property>
                )}
              </div>
            </div>
          }
        </>
      }

      <div className='offer-title' onClick={() => setIsTitleDetails(!isTitleDetails)}>
        <div>
          <span aria-hidden="true" className="icon_building"></span>&nbsp;&nbsp;Details
        </div>
        <span aria-hidden="true" className={`arrow_carrot-${!isTitleDetails ? 'down' : 'up'} text24`}></span>
      </div>

      {isTitleDetails && <div className='offer-body'>

        <div className="w-100 mt-2 d-flex flex-row justify-content-between">
          <div>Contract Address</div>
          {myNFT ?
            <a
              href={`https://etherscan.io/address/${token_address}`}
              target="_blank"
              style={{ color: '#3291e9' }}
              rel="noreferrer"
            >
              {(token_address?.substr(0, 6) + '...' + token_address?.substr(-4))}
            </a>
            :
            <LoadingSkeleton />
          }
        </div>

        <div className="w-100 mt-2 d-flex flex-row justify-content-between">
          <div>Token ID</div>
          {myNFT ?
            <CopyToClipboard
              text={ercTokenId}
              onCopy={() => dispatch(addNotification('Token ID copied to your clipboard', 'Info'))}>
              <div className="cursor" title="Copy">{(ercTokenId?.substr(0, 9) + '...' + ercTokenId?.substr(-4))}</div>
            </CopyToClipboard>
            :
            <LoadingSkeleton />
          }
        </div>

        <div className="w-100 mt-2 d-flex flex-row justify-content-between">
          <div>Token Standard</div>
          {myNFT ? <div>{type}</div> : <LoadingSkeleton />}
        </div>

        <div className="w-100 mt-2 d-flex flex-row justify-content-between">
          <div>Blockchain</div>
          {myNFT ? <div>{UtilService.getChain(chainId)}</div> : <LoadingSkeleton />}
        </div>

        {brand &&
          <div className="w-100 mt-2 d-flex flex-row justify-content-between">
            <div>Brand</div>
            {myNFT ? <div>{brand?.title}</div> : <LoadingSkeleton />}
          </div>
        }

        <div className="w-100 mt-2 d-flex flex-row justify-content-between">
          <div>Collection</div>
          {myNFT ? <div>{category?.label}</div> : <LoadingSkeleton />}
        </div>

        <div className="w-100 mt-2 d-flex flex-row justify-content-between">
          <div>Creator Fee</div>
          {myNFT ? <div>{(globalRoyalty || royalties / 10 || 0)}%</div> : <LoadingSkeleton />}
        </div>

        {type === 'ERC1155' &&
          <div className="w-100 mt-2 d-flex flex-row justify-content-between">
            <div>Total Supply</div>
            {myNFT ? <div>{totalSupply}</div> : <LoadingSkeleton />}
          </div>
        }

        {type === 'ERC1155' &&
          <div className="w-100 mt-2 d-flex flex-row justify-content-between">
            <div>Total Sold</div>
            {myNFT ? <div>{totalSale}</div> : <LoadingSkeleton />}
          </div>
        }

      </div>}
    </div>
  );
}

export default memo(ItemLeftBox);
