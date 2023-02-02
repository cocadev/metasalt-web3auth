import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import QRCode from 'react-qr-code';
import { useMoralisWeb3Api } from 'react-moralis';
import { useSelector } from 'react-redux';
import LayoutPage from '../../../../components/layouts/layoutPage';
import { MetaTag } from '../../../../components/MetaTag';
import usePrice from '../../../../hooks/usePrice';
import { useWeb3Auth } from '../../../../services/web3auth';
import UtilService from '../../../../sip/utilService';
import {
  getBrandById,
  getHideNFTByTokenIdAndTokenAddress,
  getLazyMintByTokenId,
  getLazyMintsByTokenId,
  getLazyMintTransfersByTokenId,
  getMintSupplyErc1155ByTokenId,
  getOrderDataByTokenId,
  getRequestOrdersByTokenId,
  getUserByAccount,
  getVerificationByVerifierAndTokenURI,
} from '../../../../common/api';
import {
  GOERLI_MORALIS_APPID,
  GOERLI_MORALIS_SERVER_URL,
  MORALIS_API_KEY,
  PROD,
  PROD_MORALIS_APPID,
  PROD_MORALIS_SERVER_URL,
} from '../../../../keys';

const ModalHideNFT = dynamic(() => import('../../../../components/modals/modalHideNFT'));
const ModalDeleteNFT = dynamic(() => import('../../../../components/modals/modalDeleteNFT'));
const ModalTransferNFT = dynamic(() => import('../../../../components/modals/social/modalTransferNFT'));
const ModalSwitchNetwork = dynamic(() => import('../../../../components/modals/warnings/modalSwitchNetwork'));
const ItemLeft = dynamic(() => import('../../../../atoms/itemDetail/itemLeft'));
const ItemRightHeader = dynamic(() => import('../../../../atoms/itemDetail/itemRightHeader'));
const ItemRequest = dynamic(() => import('../../../../atoms/itemDetail/itemRequest'));
const ItemActivity = dynamic(() => import('../../../../atoms/itemDetail/itemActivity'));
const ItemSell = dynamic(() => import('../../../../atoms/itemDetail/itemSell'));
const ItemStopSale = dynamic(() => import('../../../../atoms/itemDetail/itemStopSale'));
const ItemBuy = dynamic(() => import('../../../../atoms/itemDetail/itemBuy'));
const ItemRequestOrder = dynamic(() => import('../../../../atoms/itemDetail/itemRequestOrder'));

const FinalPrice = styled.div`
  font-size: 40px;
  font-weight: 500;
  color: #bbb;

  @media only screen and (max-width: 768px) {
    font-size: 24px;
  }
`

const NftDetail = function (props) {

  const {
    net,
    token_address,
    ercTokenId,
    image,
    name,
    description,
    isERC1155,
    totalSupply,
    creator: erc1155Creator,
    lazyMintByTokenId,
    hiddenData,
    lazyMintsByTokenId,
    lazyMintTransfers,
    requestOrdersByTokenId,
    orderDataByTokenId
  } = props;

  const router = useRouter()
  const { user, isAuthenticated } = useWeb3Auth()
  const Web3Api = useMoralisWeb3Api()
  const { eth: ethPrice, matic: maticPrice } = usePrice()
  const [myNFT, setMyNFT] = useState(null)
  const [switchNetworkModal, setSwitchNetworkModal] = useState(false)
  const [changedPrice, setChangedPrice] = useState()
  const [brand, setBrand] = useState(null)
  const [isCongrat, setIsCongrat] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [isRemoveModal, setIsRemoveModal] = useState(false)
  const [isTransferModal, setIsTransferModal] = useState(false)
  const [isHideModal, setIsHideModal] = useState(false)
  const [sales, setSales] = useState([])
  const [verificationData, setVerificationData] = useState([])

  const { users } = useSelector(state => state.users)
  const account = user?.account.toLowerCase()
  const price = (net === 'polygon' || net === 'mumbai') ? maticPrice : ethPrice

  const acceptedData = useMemo(() => {
    const result = requestOrdersByTokenId.find(item => item.requestor === account)
    return result || null
  }, [account, requestOrdersByTokenId])

  const me = users?.find(z => z.account === myNFT?.owner_of);
  const createdOrder = useMemo(() => orderDataByTokenId.find(item => item?.completed === false), [orderDataByTokenId])
  const qrLink = `https://metasalt.io/nftmarketplace/${net}/${token_address}/${ercTokenId}`

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const onGetNFT = useCallback(async () => {
    if (ercTokenId && token_address && lazyMintByTokenId) {
      setMyNFT({
        ...lazyMintByTokenId,
        owner_of: lazyMintByTokenId?.owner || lazyMintByTokenId?.creator,
        create_of: lazyMintByTokenId?.creator
      })
    } else {
      onGetGlobalNFT().then()
    }
    // fetchTokenIdOwners().then()
  }, [ercTokenId, token_address, lazyMintByTokenId])

  useEffect(() => {
    onGetNFT().then()
  }, [onGetNFT])

  useEffect(() => {
    if (brandObject) {
      onGetBrand(brandObject).then()
    }
  }, [myNFT])

  useEffect(() => {
    const loadVerificationData = async () => {
      const response = await getVerificationByVerifierAndTokenURI({ verifier: account, tokenURI: ercTokenId })
      response && setVerificationData(response)
    }

    if (account && ercTokenId) {
      loadVerificationData().then()
    }
  }, [account, ercTokenId])

  const creatorAddress = myNFT?.create_of || erc1155Creator?.toLowerCase() || myNFT?.owner_of
  const digital_tokenId = UtilService.checkHexa(ercTokenId) ? UtilService.DecimalToHex(ercTokenId) : ercTokenId;

  const fetchTokenIdOwners = async () => {
    const options = {
      address: token_address,
      token_id: UtilService.DecimalToHex(ercTokenId),
      chain: net,
    };
    const tokenIdOwners = await Web3Api.token.getTokenIdOwners(options);
    setSales([...tokenIdOwners?.result])
  };

  const onGetGlobalNFT = async () => {
    const c1 = {
      address: token_address,
      chain: net,
      token_id: digital_tokenId
    };
    try {
      const data = await Web3Api.token.getTokenIdMetadata(c1);
      setMyNFT(data);
    } catch (e) {
      console.log('e: ', e)
    }
  }

  const priceChain = UtilService.getChain4(net)
  const brandObject = myNFT?.metadata && JSON.parse(myNFT?.metadata)?.brand;
  const finalPrice = createdOrder ? (createdOrder.price || price) : (changedPrice);
  const privateSale = myNFT?.privateSale || false;
  const isMine = (myNFT?.owner_of?.account?.toLowerCase() === account || myNFT?.owner_of === account);

  const onGetBrand = async (x) => {
    const response = await getBrandById(x.value)
    response && setBrand({ ... response, id: response._id })
  }

  const onAuthenticate = () => {

    if (!isAuthenticated) {
      handleRouters('/login')
      return false
    }

    if (verificationData.length <= 0) {
      handleRouters(`/authentication?token=${ercTokenId}`)
    }
  }

  console.log('-- isMine --', isMine)
  console.log('-- createdOrder --', createdOrder)
  console.log('-- account --', account)
  console.log('-- myNFT --', myNFT)

  return (
    <div>
      <MetaTag {...{
        title: name,
        description: description,
        image: UtilService.ConvetImg(image)
      }} />
      <LayoutPage congrat={isCongrat}>

        <div className="d-center mb-5">
          <div className='row container mt-5'>

            <div className="col-md-5 text-center relative pt-18">
              <ItemLeft
                myNFT={myNFT}
                brand={brand}
                totalSupply={totalSupply}
                sales={sales}
                creatorAddress={creatorAddress}
                verificationData={verificationData}
                orderDataByTokenId={orderDataByTokenId}
              />
            </div>

            <div className="col-md-7">
              <div className="item_info">

                <ItemRightHeader
                  myNFT={myNFT}
                  brand={brand}
                  creator={myNFT?.creator}
                  totalSupply={totalSupply}
                />

                <div className='offer-card mt-20'>

                  {myNFT ? <div>
                    {<div className="flex flex-row align-center">

                      {finalPrice && <FinalPrice>
                        {finalPrice || ''}&nbsp;
                        {UtilService.getPriceUnit(priceChain)}
                      </FinalPrice>}
                    </div>}

                    {finalPrice && <div className="color-b"> ${(finalPrice * price)?.toFixed(2)} USD</div>}
                  </div> : <Skeleton height={50} />}

                  {myNFT ? <div>
                    {
                      (isMine && (!createdOrder || createdOrder.maker?.toLowerCase() !== account)) &&
                      <ItemSell {...{
                        changedPrice,
                        setChangedPrice,
                        setSwitchNetworkModal,
                        myNFT,
                        lazyMintsByTokenId,
                        orderDataByTokenId
                      }} />
                    }

                    {
                      (isMine && createdOrder && createdOrder.maker?.toLowerCase() === account) &&
                      <ItemStopSale {...{ setSwitchNetworkModal, priceChain, orderDataByTokenId }} />
                    }

                    {
                      ((myNFT?.owner_of?.account?.toLowerCase() || myNFT?.owner_of) !== account) && createdOrder && (acceptedData?.confirmed || !privateSale) &&
                      <ItemBuy {...{
                        me,
                        changedPrice,
                        setSwitchNetworkModal,
                        myNFT,
                        setIsCongrat,
                        lazyMintsByTokenId,
                        orderDataByTokenId
                      }} />
                    }

                    {
                      myNFT?.owner_of !== account && createdOrder && privateSale &&
                      <ItemRequestOrder {...{ requestOrdersByTokenId }} />
                    }

                    <div
                      className={`offer-btn ${verificationData.length > 0 && 'disable-btn'}`}
                      onClick={onAuthenticate}>
                      <span style={{ marginRight: 12, fontSize: 20 }} aria-hidden="true" className="icon_lock-open_alt"></span>
                      {verificationData.length > 0 ? 'Authenticated' : 'Authenticate'}
                    </div>
                  </div> : <div>
                    <Skeleton height={30} />
                    <Skeleton height={30} />
                    <Skeleton height={30} />
                  </div>}

                </div>

                {isMine && <ItemRequest requestOrdersByTokenId={requestOrdersByTokenId} />}

                <ItemActivity {...{ sales, lazyMintTransfers }} />

                {
                  myNFT?.lazyMint && isMine &&
                  <div
                    className={`btn bg-primary mt-4 ${createdOrder && 'btn-disabled'}`}
                    onClick={() => setIsTransferModal(true)}
                  >
                    <span className="color-b">Transfer NFT</span>
                  </div>
                }

                {
                  isMine &&
                  <div
                    className={'btn bg-secondary ml-2 mt-4'}
                    onClick={() => setIsHideModal(true)}
                  >
                    <span className="color-b">{hiddenData.length > 0 ? 'Enable' : 'Hide'} NFT</span>
                  </div>
                }

                {
                  myNFT?.lazyMint && isMine &&
                  <div
                    className={`btn bg-red ml-2 mt-4 ${createdOrder && 'btn-disabled'}`}
                    onClick={() => setIsRemoveModal(true)}
                  >
                    Remove NFT
                  </div>
                }

                <div className='mt-4 flex'>
                  <div className='p-3 bg-white'>
                    <QRCode value={qrLink} size={150} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {switchNetworkModal && <ModalSwitchNetwork
          isOpen={switchNetworkModal}
          network={priceChain}
          onClose={() => setSwitchNetworkModal(false)}
        />}

        {isRemoveModal && <ModalDeleteNFT
          isOpen={isRemoveModal}
          onClose={() => setIsRemoveModal(false)}
        />}

        {isHideModal && <ModalHideNFT
          isOpen={isHideModal}
          hidden={hiddenData.length > 0}
          onClose={() => setIsHideModal(false)}
          onSucces={() => setTrigger(trigger + 1)}
        />}

        {isTransferModal && <ModalTransferNFT
          isOpen={isTransferModal}
          onClose={() => setIsTransferModal(false)}
          isERC1155={isERC1155}
        />}

      </LayoutPage>
    </div>
  );
}

export const getServerSideProps = async ({ res, query }) => {

  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const { net, token_address, token_id } = query;

  const MAIN_MINT1155_ADDRESS = '0xa8abA6bB110745e079Ad90cbbAF62102c8bA80Fe'
  const GOERLI_MINT1155_ADDRESS = '0xeE3A7C32B0E104FFA8E6384D0dB1C9a21727Aa9B'
  const isERC1155 = [MAIN_MINT1155_ADDRESS.toLowerCase(), GOERLI_MINT1155_ADDRESS.toLowerCase()].includes(token_address?.toLowerCase())

  const lazyMint = await getLazyMintByTokenId({ token_id })

  const response1 = await getMintSupplyErc1155ByTokenId({ token_id })
  const totalSupply = response1?.supply || 1
  let creator = response1?.creator || null

  let name, description, image
    if (lazyMint) {

    const { thumbnail, metadata } = lazyMint
    const response = JSON.parse(metadata)

    name = response.name || ''
    description = response.description || ''
    image = thumbnail || response.image || ''
  } else {

    const options = {
      address: token_address,
      token_id: UtilService.DecimalToHex(token_id),
      chain: net,
    }

    const Moralis = require('moralis/node')
    await Moralis.start({
      apiKey: MORALIS_API_KEY,
      serverUrl: PROD ? PROD_MORALIS_SERVER_URL : GOERLI_MORALIS_SERVER_URL,
      appId: PROD ? PROD_MORALIS_APPID : GOERLI_MORALIS_APPID
    })

    const response = await Moralis.Web3API.token.getTokenIdMetadata(options);
    const metadata = JSON.parse(response.metadata)

    const response7 = await getUserByAccount({ account: response?.owner_of })
    if (response7) creator = response7

    name = metadata?.name ? metadata.name : null
    description = metadata?.description ? metadata.description : null
    image = metadata?.image ? metadata.image : null
  }

  const response2 = await getHideNFTByTokenIdAndTokenAddress({ net, token_id, token_address })
  const response3 = await getLazyMintsByTokenId({ token_id })
  const response4 = await getLazyMintTransfersByTokenId({ tokenId: token_id })
  const response5 = await getRequestOrdersByTokenId({ tokenId: token_id })
  const response6 = await getOrderDataByTokenId({ tokenId: token_id })

  return {
    props: {
      net,
      token_address,
      ercTokenId: token_id,
      isERC1155,
      totalSupply,
      creator,
      name,
      description,
      image,
      lazyMintByTokenId: lazyMint || null,
      hiddenData: response2 || [],
      lazyMintsByTokenId: response3 || [],
      lazyMintTransfers: response4 || [],
      requestOrdersByTokenId: response5 || [],
      orderDataByTokenId: response6 || [],
    }
  }
}

export default NftDetail;
