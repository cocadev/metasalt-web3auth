import { useRouter } from 'next/router';
import React, { memo, useMemo, useState } from 'react';
import Web3 from 'web3';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { Loading } from '../../components/loading';
import ModalEditPrice from '../../components/modals/modalEditPrice';
import ModalEditCounts from '../../components/modals/modalEditCounts';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { Asset, Enc, EncLazyMint1155Data, EncLazyMint721Data, ERC1155_LAZY, ERC721_LAZY, ERC721, ERC1155, ETH, Order, SignOrder, ZERO } from '../../sip/LazymintConfig';
import { createOrderData, createRealTimeHistory } from '../../common/api';

const mint721ABI = require('../../constants/abis/mint721ABI.json');
const mint1155ABI = require('../../constants/abis/mint1155ABI.json');

const ItemSell = ({
  myNFT,
  changedPrice,
  setChangedPrice,
  setSwitchNetworkModal,
  lazyMintsByTokenId: lazyMints,
  orderDataByTokenId,
}) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { token_id: ercTokenId, token_address, net } = router.query;
  const { Moralis } = useMoralis();
  const { user, web3Auth, chain } = useWeb3Auth();
  const account = user?.account;
  const { users } = useSelector(state => state.users);

  const [saleCounts, setSaleCounts] = useState('1');
  const [isEditableCountsModal, setIsEditableCountsModal] = useState(false);
  const [isFullLoading, setIsFullLoading] = useState(false);
  const [isEditablePriceModal, setIsEditablePriceModal] = useState(false);
  const createdOrder = useMemo(() => orderDataByTokenId.find(item => item?.completed === false), [orderDataByTokenId]);
  const moralisPrice = useMemo(() => orderDataByTokenId.length && orderDataByTokenId[0]?.price?.toString(),[orderDataByTokenId])
  const lazyMintDataSignature = lazyMints.length > 0 && lazyMints[0].signature;
  const isSold = lazyMints.length > 0 && lazyMints[0].sold;
  const mintCreator = lazyMints.length > 0 && lazyMints[0].creator;
  const lazyMintDataTokenURI = lazyMints.length > 0 && lazyMints[0].tokenURI;

  const { royalties: royal } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || '-'
  const priceChain = UtilService.getChain4(net);
  const royalties = royal || '0'; // default royaltee is 0

  const price = myNFT?.metadata && JSON.parse(myNFT?.metadata)?.price?.toString();
  let isLazyMint = myNFT?.lazyMint || lazyMints.length > 0;
  const finalPrice = createdOrder ? (createdOrder.price || price) : (changedPrice || moralisPrice || price);
  const type = myNFT?.contract_type || myNFT?.type || 'ERC721';
  const supply = myNFT?.supply || 1;
  const MINT_PRICE = Moralis.Units.ETH((finalPrice * Number(saleCounts)) || '0.001');

  console.log('myNFT', myNFT)


  const onMakeOrder = async () => {
    const chainId = UtilService.getChain4(chain);

    if (priceChain !== chainId) { 
      setSwitchNetworkModal(true);
      return false;
    }

    if (type === 'ERC1155') {
      setIsEditableCountsModal(true);
    }

    setIsFullLoading(true);

    const web3authProvider = await web3Auth.connect();
    const web3 = new Web3(web3authProvider);

    try {

      const contract = new web3.eth.Contract(type === 'ERC721' ? mint721ABI.abi : mint1155ABI.abi, token_address, account);

      await contract.methods.setApprovalForAll(UtilService.getMarketAddress(chainId), true)
        .send({ from: account })
        .on('transactionHash', (transactionHash) => {
          console.log('Hash', transactionHash);
        })
        .then((result) => {
          console.log('This transaction is approved!', result);
        });

      setIsFullLoading(false);
    } catch (e) {
      console.log('= e =', e)

      setIsFullLoading(false);
      return false;
    }
    let left;

    if (type === 'ERC721') {
      if (isLazyMint) {
        const creator = isSold === true ? mintCreator : (myNFT?.create_of?.account || myNFT?.create_of);
        const encodedMintData = await EncLazyMint721Data(web3, token_address, ercTokenId, lazyMintDataTokenURI, creator, royalties, lazyMintDataSignature);
        left = Order(account, Asset(ERC721_LAZY, encodedMintData, 1), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      } else {
        left = Order(account, Asset(ERC721, Enc(web3, token_address, ercTokenId), 1), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      }
    } else {
      if (isLazyMint) {
        const creator = isSold === true ? mintCreator : (myNFT?.create_of?.account || myNFT?.create_of);
        const encodedMintData = await EncLazyMint1155Data(web3, token_address, ercTokenId, lazyMintDataTokenURI, supply, creator, royalties, lazyMintDataSignature);
        left = Order(account, Asset(ERC1155_LAZY, encodedMintData, Number(saleCounts)), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      } else {
        left = Order(account, Asset(ERC1155, Enc(web3, token_address, ercTokenId), Number(saleCounts)), ZERO, Asset(ETH, '0x', MINT_PRICE), '0x');
      }
    }

    const signatureLeft = await SignOrder(web3, left, account, UtilService.getMarketAddress(chainId));

    const request = {
      signatureLeft,
      maker: left.maker,
      taker: left.taker,
      data: left.data,
      makeAsset_value: left.makeAsset.value,
      makeAsset_assetType_assetClass: left.makeAsset.assetType.assetClass,
      makeAsset_assetType_data: left.makeAsset.assetType.data,
      takeAsset_value: Number(left.takeAsset.value),
      takeAsset_assetType_assetClass: left.takeAsset.assetType.assetClass,
      takeAsset_assetType_data: left.takeAsset.assetType.data,
      tokenId: ercTokenId,
      price: changedPrice || moralisPrice || price,
      completed: false,
      saleCounts
    }

    console.log('request: ', request);

    setIsFullLoading(true);

    try {
      await createOrderData(request)
      await createRealTimeHistory({
        account,
        date: new Date(),
        tokenId: ercTokenId,
        tag: 'sale'
      })

      setIsFullLoading(false);
      router.push('/mynfts', undefined, { shallow: true }).then()
    } catch (e) {

      dispatch(addNotification('Transaction failed!', 'error'))
      setIsFullLoading(false);
    }
  }

  function getUserNameFromAddress(tAdd) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.account) === tAdd?.toLowerCase());
      return tt?.username;
    }
  }

  return (
    <div>
      {isFullLoading && <Loading />}

      {(!createdOrder || createdOrder?.maker === account) &&
      // ?
        <div className="offer-btn buy-btn" onClick={() => type === 'ERC721' ? setIsEditablePriceModal(true) : setIsEditableCountsModal(true)}>
          <span style={{ marginRight: 12, fontSize: 20 }} aria-hidden="true" className="icon_wallet" />
           Sell
        </div>
        // :
        // <div className='text-warning'>
        //   It is not allowed to create new sale, because there is already existed sale by
        //   <span className='text-primary cursor' onClick={() => router.push(`/sales/${createdOrder?.maker}`)}> &nbsp;
        //     {getUserNameFromAddress(createdOrder?.maker)}
        //   </span>
        // </div>
      }

      {isEditableCountsModal &&
        <ModalEditCounts
          onClose={() => setIsEditableCountsModal(false)}
          saleCounts={saleCounts}
          setSaleCounts={setSaleCounts}
          maxValue={myNFT?.amount}
          onSuccess={() => {
            setIsEditableCountsModal(false)
            setIsEditablePriceModal(true);
          }}
        />
      }

      {isEditablePriceModal &&
        <ModalEditPrice
          onClose={() => {
            setChangedPrice(moralisPrice || price)
            setIsEditablePriceModal(false)
          }}
          setChangedPrice={setChangedPrice}
          changedPrice={changedPrice || moralisPrice || price}
          // defaultPrice={moralisPrice || price}
          onSuccess={() => {
            setIsEditablePriceModal(false)
            onMakeOrder()
          }}
        />}
    </div>
  );
}

export default memo(ItemSell);
