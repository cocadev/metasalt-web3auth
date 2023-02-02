import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { memo, useMemo, useState } from 'react';
import Web3 from 'web3';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import ModalPurchaseProcessing from '../../components/modals/modalPurchaseProcessing';
import ModalUnreviewedCollection from '../../components/modals/modalUnreviewedCollection';
import { Loading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { Asset, Enc, EncLazyMint1155Data, EncLazyMint721Data, ERC1155_LAZY, ERC721_LAZY, ERC721, ERC1155, ETH, Order, SignOrder, ZERO } from '../../sip/LazymintConfig';
import { onSaveRewards } from '../../common/web3Api';
import { createRealTimeHistory, updateLazyMintById, updateOrderDataById } from '../../common/api';


const ModalPriceLacks = dynamic(() => import('../../components/modals/modalPriceLacks'));

const newMarketplaceABI = require('../../constants/abis/marketplaceABI.json');

const ItemBuy = ({
  myNFT,
  changedPrice,
  me,
  setSwitchNetworkModal,
  setIsCongrat,
  lazyMintsByTokenId: lazyMints,
  orderDataByTokenId,
}) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { token_id: ercTokenId, token_address, net } = router.query;
  const { users } = useSelector(state => state.users)
  const { user, isAuthenticated, chain, web3Auth } = useWeb3Auth()
  const { Moralis } = useMoralis();
  const chainId = UtilService.getChain4(chain);
  // const web3 = new Web3((typeof window !== 'undefined' && window).ethereum);
  const account = user?.account;

  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isModalPriceLacks, setIsModalPriceLacks] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(0);
  const [isReviewCollectionModal, setIsReviewCollectionModal] = useState(false);

  const createdOrder = useMemo(() => orderDataByTokenId.find(item => item?.completed === false), [orderDataByTokenId])
  const moralisPrice = useMemo(() => orderDataByTokenId.length && orderDataByTokenId[0]?.price?.toString(), [orderDataByTokenId])
  const lazyMintDataSignature = lazyMints.length > 0 && lazyMints[0].signature;
  const lazyMintDataTokenURI = lazyMints.length > 0 && lazyMints[0].tokenURI;
  const creator = lazyMints.length > 0 && lazyMints[0].creator;
  const SALECOUNTS = Number(createdOrder?.saleCounts || 1);

  const {
    image,
    name,
    rate,
    isVideo,
    category,
    royalties: royal,
  } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || '-'
  const royalties = royal || '0'; // default royaltee is 0

  const priceChain = UtilService.getChain4(net);
  const price = myNFT?.metadata && JSON.parse(myNFT?.metadata)?.price?.toString();

  let isLazyMint = myNFT?.lazyMint || lazyMints.length > 0;

  const creatorObject = creator ? users?.find(z => (z.account) === creator) : null;

  const finalPrice = createdOrder ? (createdOrder.price || price) : (changedPrice || moralisPrice || price);
  const type = myNFT?.contract_type || 'ERC721';
  const supply = myNFT?.supply || 1;
  const amount = myNFT?.amount || 1;
  const MINT_PRICE = Moralis.Units.ETH((finalPrice * SALECOUNTS) || '0.001');

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const onBuyOrderValidation = async () => {

    const web3authProvider = await web3Auth.connect();
    const web3 = new Web3(web3authProvider);

    if (!isAuthenticated) {
      handleRouters('/login')
      return false;
    }

    if (priceChain !== chainId) {
      setSwitchNetworkModal(true);
      return false;
    }

    const bal = await web3.eth.getBalance(user?.account);
    const balance = web3.utils.fromWei(bal, 'ether')

    if (Number(finalPrice) > balance) {
      setIsModalPriceLacks(true);
      return false;
    }

    setIsReviewCollectionModal(true);
  }

  const onBuyOrder = async () => {

    setPurchaseStatus(1);

    const web3authProvider = await web3Auth.connect();
    const web3 = new Web3(web3authProvider);

    let right;
    if (type === 'ERC721') {
      if (isLazyMint) {
        const encodedMintData = await EncLazyMint721Data(web3, token_address, ercTokenId, lazyMintDataTokenURI, creator, royalties, lazyMintDataSignature);
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC721_LAZY, encodedMintData, 1), '0x');
      } else {
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC721, Enc(web3, token_address, ercTokenId), 1), '0x');
      }
    } else {
      if (isLazyMint) {
        const encodedMintData = await EncLazyMint1155Data(web3, token_address, ercTokenId, lazyMintDataTokenURI, supply, creator, royalties, lazyMintDataSignature);
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC1155_LAZY, encodedMintData, SALECOUNTS), '0x');
      } else {
        right = Order(user?.account, Asset(ETH, '0x', MINT_PRICE), ZERO, Asset(ERC1155, Enc(web3, token_address, ercTokenId), SALECOUNTS), '0x');
      }
    }

    const signatureRight = await SignOrder(web3, right, user?.account, UtilService.getMarketAddress(chainId));

    const orderLeft = {
      maker: createdOrder.maker,
      taker: createdOrder.taker,
      data: createdOrder.data,
      makeAsset: {
        value: createdOrder.makeAsset_value,
        assetType: {
          assetClass: createdOrder.makeAsset_assetType_assetClass,
          data: createdOrder.makeAsset_assetType_data
        }
      },
      takeAsset: {
        value: MINT_PRICE,
        assetType: {
          assetClass: createdOrder.takeAsset_assetType_assetClass,
          data: createdOrder.takeAsset_assetType_data
        }
      }
    }

    const params = {
      orderLeft,
      signatureLeft: createdOrder.signatureLeft,
      orderRight: right,
      signatureRight,
    }

    console.log('params: ', params)


    // const marketplace_request = {
    //   chain: chainId,
    //   contractAddress: UtilService.getMarketAddress(chainId),
    //   functionName: 'matchOrders',
    //   abi: newMarketplaceABI.abi,
    //   params,
    //   msgValue: MINT_PRICE,
    //   from: user?.account
    // };

    try {
      const contract = new web3.eth.Contract(newMarketplaceABI.abi, UtilService.getMarketAddress(chainId), account);

      await contract.methods.matchOrders(orderLeft, createdOrder.signatureLeft, right, signatureRight)
        .send({ from: account, value: MINT_PRICE })
        .on('transactionHash', (transactionHash) => {
          console.log('Hash', transactionHash);
        })
        .then((result) => {
          console.log('This transaction is approved!', result);
          onBuySuccess().then()
        });

      // await Moralis.executeFunction(marketplace_request);
    } catch (e) {
      console.log('e: ', e)
      dispatch(addNotification('Transaction failed!', 'error'))
      setIsFullLoading(false);
      setPurchaseStatus(0);
    }
  }

  const onBuySuccess = async () => {
    dispatch(addNotification('Transaction confirmed!', 'success'))
    setIsCongrat(true);
    // await testBuy();

    orderDataByTokenId.length && await updateOrderDataById({ id: orderDataByTokenId[0]._id, completed: true, buyer: user?.account })

    await createRealTimeHistory({
      account: user?.account,
      date: new Date(),
      tokenId: ercTokenId,
      opposite: me?.account,
      tag: 'buy'
    })

    if (isLazyMint) {
      if (lazyMints.length && lazyMints[0]?.supply > 1) {
        // await object2.save().then((object) => {
        //   object2.set('supply', object2.supply - 1);
        //   return object2.save();
        // });
      } else {
        lazyMints.length && await updateLazyMintById({ id: lazyMints[0]._id, sold: true })
      }
    }
    setPurchaseStatus(2);
    const request = { Moralis, account: user?.account, chainId, counts: 1 } // (Rodel's work)
    dispatch(onSaveRewards(request, () => {}))
    setIsFullLoading(false);
  }

  /*
  const testBuy = async () => {
    const owner = users.filter(item => item.account === myNFT?.owner_of)
    const link = `https://www.metasalt.io/nftmarketplace/eth/${token_address}/${ercTokenId}`
    await sendNotification({
      userId: owner[0].id,
      account: user.accounts ? user.accounts[0] : '',
      username: user.username,
      avatar: user.avatar,
      type: 'seller',
      tag: null,
      link,
    })
    await sendNotification({
      userId: user.id,
      account: user.accounts ? user.accounts[0] : '',
      username: user.username,
      avatar: user.avatar,
      type: 'buyer',
      tag: null,
      link,
    })
  }
  */

  return (
    <div>
      {isFullLoading && <Loading />}

      <div className='offer-btn' onClick={onBuyOrderValidation}>
        <span style={{ marginRight: 12, fontSize: 20 }} aria-hidden='true' className='icon_tag_alt' />
        Buy {createdOrder?.saleCounts}
      </div>

      {isModalPriceLacks &&
        <ModalPriceLacks
          price={finalPrice}
          onClose={() => setIsModalPriceLacks(false)}
        />
      }

      <ModalPurchaseProcessing
        {...{ rate, image, isVideo, status: purchaseStatus, name }}
        onList={() => {
          setPurchaseStatus(0);
          setIsCongrat(false);
          handleRouters('/mynfts')
        }}
        onClose={() => {
          setPurchaseStatus(0)
          setIsCongrat(false)
        }}
      />

      <ModalUnreviewedCollection
        {...{ amount }}
        isShow={isReviewCollectionModal}
        collection={category?.label}
        creator={creatorObject?.username || me?.username}
        createdAt={myNFT?.synced_at || myNFT?.last_token_uri_sync}
        onAccept={() => {
          setIsReviewCollectionModal(false);
          onBuyOrder().then()
        }}
        onClose={() => setIsReviewCollectionModal(false)}
      />
    </div>
  );
}

export default memo(ItemBuy);
