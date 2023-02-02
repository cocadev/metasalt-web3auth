import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import _ from 'underscore';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import UtilService from '../../sip/utilService';
import { ALCHEMY_KEY, DEMO_DEFAULT_AVATAR, MAIN_MINT1155_ADDRESS, MAIN_MINT721_ADDRESS } from '../../keys';
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

const NFTCommnuity = ({ content, editable, onEdit, onRemove }) => {

  const { user, isInitialized, account, isAuthenticated } = useMoralis();
  const { nfts: nfts721 } = useSelector(state => state.nfts);
  const Web3Api = useMoralisWeb3Api();
  const [gatedContents, setGatedContents] = useState([]);
  const [isValidImg, setIsValidImg] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const myNFTs = nfts721?.filter(item => item.owner_of?.toLowerCase() === account)

  useEffect(() => {
    if (isInitialized && content?.length > 0) {
      onGetActivity();
    }
  }, [isInitialized, content])

  const onGetActivity = async () => {

    const list = await Promise.all(content?.map(async (item) => {
      if (!item?.nfts) return item
      const nftContents = await Promise.all(item?.nfts?.map(async (x) => {

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
          const image = UtilService.ConvetImg(metadata.image);
          return { ...x, image, name: metadata?.name, isMetasalt }
        }
      }))
      return { ...item, nfts: nftContents }
    }))

    setGatedContents(list);
  }

  const onGoLink = async (contentItem) => {

    if (!isAuthenticated) {
      router.push('/login', undefined, { shallow: true })
      return false;
    }

    const { type, link, nfts } = contentItem;
    const isMyVideo = type.value === 'video';
    const isMyDiscord = type.value === 'Discord';
    const isMyMusic = type.value === 'Music';
    const extLink = isMyVideo ? `/videos/${link}` : isMyDiscord ? `/discourse/${link}` : isMyMusic ? `/musics/${link}`: link;

    const globalBalances = await alchemy.nft.getNftsForOwner(account);

    const possessNFTIds = globalBalances?.ownedNfts?.map(item => item.contract.address + '-' + item.tokenId)

    if (myNFTs.length + globalBalances?.ownedNfts?.length > 0) {

      const andNFTs = nfts?.filter(item => !item.or)
      const orNFTs = nfts?.filter(item => item.or)

      const gatedNFTAndIds = andNFTs?.map(item => item.token_address + '-' + item.token_id)
      const gatedNFTOrIds = orNFTs?.map(item => item.token_address + '-' + item.token_id)
      const metasaltIds = myNFTs.map(item => item.token_id)

      const isExistMetasaltAndNFTs = andNFTs?.find(x => x.token_address === MAIN_MINT721_ADDRESS || x.token_address === MAIN_MINT1155_ADDRESS)

      let orExist = false;
      let andExistGlobal = false;
      let andExistMetasalt = false;

      const matchAndGlobalNFTs = _.intersection(possessNFTIds, gatedNFTAndIds)

      if(matchAndGlobalNFTs?.length === gatedNFTAndIds?.length){
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

        if(!isExistMetasaltAndNFTs){
          andExistMetasalt = true;
        }

      }) 

      if (orExist && andExistMetasalt && andExistGlobal) {
        router.push(extLink, undefined, { shallow: true })
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

  // console.log('gatedContents', gatedContents)

  return (
    <div className='offer-body mt-2'>
      <div className='w-full'>
        <table>

          <thead>
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Type</th>
              <th className="text-center">NFTs</th>
              {!editable && <th className="text-center">Lock</th>}
              {editable && <th className="text-center">Edit</th>}
              {editable && <th className="text-center">Remove</th>}
            </tr>
          </thead>

          <tbody className="relative">
            {
              content?.length > 0 && gatedContents.length > 0 && gatedContents?.map((item, index) => {

                const { type, link, title } = item;
                const isMyVideo = type.value === 'video';
                const isMyDiscord = type.value === 'Discord';
                const isMyMusic = type.value === 'Music';
                const onHrefLink = isAuthenticated ? (isMyVideo ? `/videos/${link}` : isMyDiscord ? `/discourse/${link}` : isMyMusic ? `/musics/${link}` : link) : '/login'

                return (
                  <tr key={index}>
                    <td className="text-center">{title}</td>
                    <td className="text-center">{type.label}</td>
                    <td style={{ flex: 1 }}>
                      <div className="d-row flex-wrap relative">
                        {item?.nfts?.map((x, ll) =>
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
                      </div>
                    </td>

                    {!editable && <td className="text-center">
                      &nbsp;&nbsp;
                      {item?.nfts?.length > 0
                        ? <div
                          onClick={() => onGoLink(item)}
                          className='color-sky text-decoration-underline'
                          target={isMyVideo ? '_self' : '_blank'} rel="noreferrer"
                        >
                          <span aria-hidden="true" className="icon_lock_alt cursor" />
                        </div>

                        : <div
                          onClick={() => router.push(onHrefLink, undefined, { shallow: true })}
                          className='color-sky text-decoration-underline'
                        >
                          <span aria-hidden="true" className="icon_check_alt2 cursor" />
                        </div>
                      }
                    </td>}

                    {
                      editable && <td className="text-center">
                        <span aria-hidden="true" className="icon_pencil cursor" onClick={() => onEdit(item)} />
                      </td>
                    }
                    {
                      editable && <td className="text-center">
                        <span aria-hidden="true" className="icon_close cursor" onClick={() => onRemove(index)} />
                      </td>
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default (NFTCommnuity);