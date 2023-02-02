import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import LayoutModal from './layoutModal';
import styled from 'styled-components';
import _ from 'underscore';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import UtilService from '../../sip/utilService';
import { ALCHEMY_KEY, DEMO_DEFAULT_AVATAR, MAIN_MINT1155_ADDRESS, MAIN_MINT721_ADDRESS, PROD } from '../../keys';
import bigInt from 'big-integer';
import { Alchemy, Network } from 'alchemy-sdk';
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

const config = {
  apiKey: ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

const LayoutGated = ({ data, title }) => {

  const router = useRouter();
  const [isShowGatedModal, setIsShowGatedModal] = useState(true);
  const { user, isInitialized, account, isAuthenticated, Moralis } = useMoralis();
  const { nfts: nfts721 } = useSelector(state => state.nfts);
  const Web3Api = useMoralisWeb3Api();
  const [gatedContents, setGatedContents] = useState([]);
  const [isValidImg, setIsValidImg] = useState([]);
  const [gatingNFTs, setGatingNFTs] = useState([]);
  const dispatch = useDispatch();
  const myNFTs = nfts721?.filter(item => item.owner_of?.toLowerCase() === account)
  const content = data ? JSON.parse(data) : [];

  useEffect(() => {
    if (isInitialized) {
      onGetNFTs();
    }
  }, [isInitialized, data])

  useEffect(() => {
    if (isInitialized) {
      onGetActivity();
    }
  }, [isInitialized, gatingNFTs])

  const onGetNFTs = async () => {
    const nftData = await Moralis.Cloud.run('GetAllNFTs', {
      page: 0,
      step: 10,
      prod: PROD,
      multi: content.map(x => x.token_id)
    })

    const hexTokensData = await nftData.data.map(i => {
      const hextokenId = UtilService.checkHexa(i.token_id) ? i.token_id : '0x' + bigInt(i.token_id).toString(16);
      return { ...i, token_id: hextokenId }
    })
    setGatingNFTs(hexTokensData)
  }

  const onGetActivity = async () => {

    const nftContents = await Promise.all(content?.map(async (x) => {

      const isMetasalt = UtilService.checkMetasalt(x.token_address)

      let meta = null;
      if (isMetasalt) {
        meta = await gatingNFTs?.find(p => p.token_address?.toLowerCase() === x.token_address?.toLowerCase() && p.token_id === x.token_id)
      } else {
        meta = await Web3Api.token.getTokenIdMetadata({
          chain: x.chainId,
          address: x.token_address,
          token_id: x.isAll ? 1 : x.token_id,
        })
      }
      if (!meta) { return x } else {
        const metadata = JSON.parse(meta.metadata);
        const image = UtilService.ConvetImg(metadata.image);
        return { ...x, image, name: metadata?.name, isMetasalt }
      }
    }))
    setGatedContents([...nftContents]);
  }

  const onRevealContent = async () => {

    if (!isAuthenticated) {
      router.push('/login', undefined, { shallow: true })
      return false;
    }

    if (content?.length === 0) {
      setIsShowGatedModal(false);
      return false;
    }
    const globalBalances = await alchemy.nft.getNftsForOwner(account);

    const possessNFTIds = globalBalances?.ownedNfts?.map(item => item.contract.address + '-' + item.tokenId)

    if (myNFTs.length + globalBalances?.ownedNfts?.length > 0) {

      const andNFTs = content?.filter(item => !item.or)
      const orNFTs = content?.filter(item => item.or)

      const gatedNFTAndIds = andNFTs?.map(item => item.token_address + '-' + item.token_id)
      const gatedNFTOrIds = orNFTs?.map(item => item.token_address + '-' + item.token_id)
      const metasaltIds = myNFTs.map(item => item.token_id)

      const isExistMetasaltAndNFTs = andNFTs?.find(x => x.token_address === MAIN_MINT721_ADDRESS || x.token_address === MAIN_MINT1155_ADDRESS)

      const isNoGlobalNFTS = content.find((pp) => !UtilService.checkMetasalt(pp.token_address))

      let orExist = false;
      let andExistGlobal = false;
      let andExistMetasalt = false;

      const matchAndGlobalNFTs = _.intersection(possessNFTIds, gatedNFTAndIds)

      if (!isNoGlobalNFTS) {
        andExistGlobal = true;
      }
      if (matchAndGlobalNFTs?.length === gatedNFTAndIds?.length) {
        andExistGlobal = true;
      }

      possessNFTIds?.map((item) => {

        if (gatedNFTOrIds.includes(item)) {
          orExist = true;
        }

        const dupliOr = _.intersection(metasaltIds, orNFTs.map(x => x.token_id))
        const dupliAnd = _.intersection(metasaltIds, andNFTs.map(x => x.token_id))

        if (dupliOr.length > 0) {
          orExist = true;
        }

        if (dupliAnd.length > 0 && dupliAnd.length === orNFTs.length) {
          andExistMetasalt = true;
        }

        if (!isExistMetasaltAndNFTs) {
          andExistMetasalt = true;
        }

      })

      // console.log('¬¬¬¬¬¬¬¬¬¬¬ orExist ¬¬¬¬¬¬¬¬¬¬', orExist)    
      // console.log('¬¬¬¬¬¬¬¬¬¬¬ andExistMetasalt ¬¬¬¬¬¬¬¬¬¬', andExistMetasalt)
      // console.log('¬¬¬¬¬¬¬¬¬¬¬ andExistGlobal ¬¬¬¬¬¬¬¬¬¬', andExistGlobal)

      if (orExist && andExistMetasalt && andExistGlobal) {
        setIsShowGatedModal(false)
        // alert('visible!')
      } else {
        dispatch(addNotification('You don\'t have the NFTs needed to access this content.', 'error'))
      }

    } else {
      if (!window.ethereum) {
        dispatch(addNotification('🦊 You must install Metamask in your browser.', 'error', 'metamask'))
        return false;
      }
      if (!user) {
        dispatch(addNotification('🦊 You are not logged in the website!', 'error'))
        return false;
      }
      dispatch(addNotification('You don\'t have any NFT in your wallet, please purchase at least one NFT to reveal the content', 'error'))
    }
  }

  const onErrorVideo = (e, pp) => {
    if (e.type === 'error') {
      setIsValidImg(isValidImg.concat(pp));
    } else {
      return null
    }
  }

  const onClose = () => {

  }

  return (
    <div>
      <LayoutModal
        isOpen={isShowGatedModal ? true : false}
        onClose={onClose}
        title={title}
        hiddenClose
      >

        <div className="d-center" >

          <div className='offer-body mt-2'>
            <div className='w-full'>

              <div className="d-row flex-wrap relative">
                {gatedContents?.map((x, ll) =>
                  <CustomPopover
                    key={ll}
                    content={!x.or ? 'Mandatory NFT to access the content' : 'Need at least one NFT to access the content'}
                    placement='bottom'
                  >
                    <NFTContent active={x.or} >
                      {isValidImg.includes('g' + ll) && <img src={x.image || DEMO_DEFAULT_AVATAR} alt='nft image' />}
                      {!isValidImg.includes('g' + ll) && <video src={x.image} preload="auto" autoPlay={true} onError={e => onErrorVideo(e, 'g' + ll)} style={{ height: 70 }} />}
                      {x.isAll && <All>All</All>}
                      <div className="text-center" style={{ maxHeight: 21, overflow: 'hidden' }}>{x.name}</div>
                    </NFTContent>
                  </CustomPopover>
                )}

                {gatedContents.length === 0 && <div>No Token Gated</div>}
              </div>

            </div>
          </div>

          <div className="row align-center mt-3">

            <div
              className="offer-btn"
              onClick={() => router.back()}
              style={{ width: 100, marginRight: 20 }}
            >
              Cancel
            </div>

            <div
              className={'offer-btn buy-btn cursor'}
              style={{ width: 200 }}
              onClick={onRevealContent}
            >
              Access the Content
            </div>
          </div>

        </div>

      </LayoutModal>
    </div>
  );
};

export default LayoutGated;
