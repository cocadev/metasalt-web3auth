import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { DEMO_AVATAR, DEMO_DEFAULT_AVATAR, GOERLI_MINT721_ADDRESS, MAIN_MINT721_ADDRESS, PROD } from '../keys';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { NetData_TEST, NetData_PROD } from '../constants/filters';
import UtilService from '../sip/utilService';
import useWindowSize from '../hooks/useWindowSize';
import usePrice from '../hooks/usePrice';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import _ from 'underscore';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { onGetSearchData } from '../common/web3Api';

const Amount = styled.div`
  width: 40px;
  height: 20px;
  border: 1px solid grey;
  position: absolute;
  right: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px; 
`
const token_net = PROD ? 'eth' : 'goerli';
const token_address = PROD ? MAIN_MINT721_ADDRESS : GOERLI_MINT721_ADDRESS;

const RightWalletSection = ({ handleClose }) => {

  const { Moralis, user, isInitialized, account: wallet, chainId } = useMoralis();
  const router = useRouter();
  const web3 = new Web3(window.ethereum);
  const dispatch = useDispatch();
  const [rewards, setRewards] = useState(0);
  const [selected, setSelected] = useState([]);
  const { data: brands } = useMoralisQuery('Brands');
  const { height } = useWindowSize();
  const [balance, setBalance] = useState(0);
  const [nfts, setNfts] = useState([]);

  const { eth, matic } = usePrice();
  const priceUSD = Number((chainId === '0x89' ? matic : eth) * balance)?.toFixed(2);
  const maxHeight = height > 50 ? (height - 50) : 600;
  const username = user?.attributes?.username;
  const photoUrl = user?.attributes?.avatar || DEMO_AVATAR;
  const account = user?.attributes.ethAddress;

  useEffect(() => {
    isInitialized && wallet && fetchNFTs()
  }, [isInitialized, wallet])

  useEffect(() => {
    setTimeout(() => {
      onGetRewards();
    }, 1000)
  }, [account])

  const fetchNFTs = async () => {

    web3.eth.getBalance(wallet).then(res => setBalance(web3.utils.fromWei(res, 'ether')));

    setNfts([]);

    const request = {
      page: 0,
      step: 100,
      prod: PROD,
      owner_of: wallet,
    }

    dispatch(onGetSearchData(Moralis, request, wallet, (res) => {
      setNfts([...res.data])
    }))
  };

  const onChangeSelected = (e) => {
    const dataArray = [...selected];
    const index = dataArray.indexOf(e);
    if (index > -1) { dataArray.splice(index, 1) }
    else { dataArray.push(e) }
    setSelected([...dataArray])
  }

  const realData = nfts.reduce(function (filtered, item) {
    if (item.owner_of?.toLowerCase() === wallet) {
      const metadata = JSON.parse(item.metadata);
      filtered.push({
        contract_type: item.contract_type,
        image: item.thumbnail || metadata?.thumbnail || metadata?.image || DEMO_DEFAULT_AVATAR,
        price: metadata?.price,
        title: metadata?.name,
        amount: item.amount,
        token_id: item.token_id,
        token_address: item.token_address,
        metasalt: item.metasalt
      })
    }
    return filtered;
  }, []);

  const onGetRewards = async () => {
    const RewardsQuery = new Moralis.Query('Rewards');
    RewardsQuery.equalTo('owner', account || user?.id);
    const reward = await RewardsQuery.first();
    const totalRewards = PROD ? (reward?.attributes?.ETH || 0) + (reward?.attributes?.POLYGON || 0) : (reward?.attributes?.GOERLI || 0) + (reward?.attributes?.MUMBAI || 0);
    setRewards(totalRewards)
  }

  const myData = nfts?.reduce(function (filtered, item) {
    const { name } = JSON.parse(item.metadata) || '';
    if (!!account && item.owner_of === account && !!name) {
      const { name, category, chain } = JSON.parse(item.metadata);
      filtered.push({
        item,
        lazyMint: item.lazyMint || false,
        name,
        id: item.token_id,
        categoryId: (name ? category?.value : null) || 'non',
        chain
      })
    }
    return filtered
  }, [])

  const myDataCategoryList1 = myData.filter(item => !item.lazyMint).map(item => { return item?.categoryId })
  const myDataCategoryList2 = myData.map(item => { return item?.categoryId })
  const myLazyData = myData.filter(item => item?.lazyMint);
  const wrongWallet = wallet && user?.attributes?.ethAddress && wallet !== user?.attributes?.ethAddress;

  return (
    <div style={{ overflowY: 'auto', maxHeight }}>

      {wrongWallet && <div style={{ border: '1px solid red', padding: 8, background: '#682115', color: '#fff', margin: 10 }}>
        <div className="text-center mt-1" style={{ fontSize: 24 }}>Wrong Address Selected!</div>
        <div className="mt-2"><span className="color-yellow">Connected metamask address:</span> {UtilService.truncate(wallet)}</div>
        <div><span className="color-yellow">User logged address:</span> {UtilService.truncate(account)}</div>
        <div className="text-center mt-3" style={{ fontSize: 14 }}>Please select {UtilService.truncate(account)} address in metamask</div>
      </div>}

      {!account && <div style={{ border: '1px solid red', padding: 8, background: '#682115', color: '#fff', margin: 10 }}>
        <div className="text-center mt-1" style={{ fontSize: 24 }}>Wallet Not Connected!</div>
        <div className="mt-2"><span className="color-yellow">Connected wallet to the website:</span> {UtilService.truncate(wallet)}</div>
        <div><span className="color-yellow">Connected wallet to your account:</span> Null</div>
      </div>}

      <div className="flex justify-betwen align-center color-b" style={{ padding: 20 }}>
        <div className="flex align-center" >
          <div className="profile-avatar-s">
            <img src={UtilService.ConvetImg(photoUrl)} alt="me" />
          </div>
          <div style={{ maxWidth: 180, overflow: 'hidden' }}>&nbsp;{username}</div>
        </div>
        <div>
          {account ? UtilService.truncate(account) :
            <Link href='/wallet' onClick={handleClose} prefetch={false}>
              <input type="button" className="btn-main tiny-btn" value="Link Wallet" style={{ width: 125 }} />
            </Link>}
        </div>
      </div>

      <div className="border-small" />

      <div className="round-box color-b">
        <div className="color-7">Total balance</div>
        <div style={{ fontSize: 36, fontWeight: '600', color: '#fff' }}>{(Number(balance)?.toFixed(4) + ' ' || '0 ') + UtilService.getPriceUnit(chainId)}</div>
        <div>{priceUSD} USD</div>
      </div>
      <div className="round-box d-row justify-betwen color-b">
        <div className="f-24">Metasalt Tokens</div>
        <div className="count-text f-24">{rewards > 0 ? rewards : 0}</div>
      </div>

      <div className="round-box color-b">
        <div className="flex d-row justify-betwen w-full">
          <div className="flex items-center">
            <span
              aria-hidden="true"
              className={`arrow_carrot-${selected.includes('nft-owned') ? 'up' : 'down'} text-green`}
              style={{ fontSize: 34, cursor: 'pointer' }}
              onClick={() => onChangeSelected('nft-owned')}
            />
            <span className="f-24">NFT Owned</span>
          </div>
          <div className="count-text f-24">{myData?.length}</div>
        </div>


        {selected.includes('nft-owned') && <>
          <LazyMintAtom
            {...{
              selected,
              myLazyData,
              brands: [...brands, { id: 'non', attributes: { title: 'No Category' } }],
              onChangeSelected,
              myDataCategoryList2
            }}
            full={true}
          />
          {(PROD ? NetData_PROD : NetData_TEST).map((item, index) =>
            <CustomAtom
              key={index}
              {...item}
              {...{
                selected,
                myData,
                brands: [...brands, { id: 'non', attributes: { title: 'No Category' } }],
                onChangeSelected,
                myDataCategoryList1
              }}
              full={true} />)}
        </>}
      </div>

      <div className="round-box d-row justify-betwen color-b">
        <div className="f-24">Global NFTs</div>
        <div className="count-text f-24">{realData.filter(c => !c.metasalt)?.length || 0}</div>
      </div>
      <div className="m-4 mt-0">
        {realData.filter(c => !c.metasalt)?.map((item, index) =>
          <NftObject
            key={index}
            {...{ item, token_net, router }}
          />)}
      </div>

      <div className="round-box d-row justify-betwen color-b">
        <div className="f-24">Metasalt NFTs</div>
        <div className="count-text f-24">{realData.filter(c => c.metasalt)?.length || 0}</div>
      </div>

      <div className="m-4 mt-0">
        {realData.filter(c => c.metasalt)?.map((item, index) =>
          <NftObject
            key={index}
            {...{ item, token_net, router }}
          />)}
      </div>
      <div className="pointer" />
    </div>
  );
};

export default RightWalletSection;

function NftObject({ item, token_net, router, key: index }) {

  const [isValidImg, setIsValidImg] = useState([]);

  const onErrorVideo = (e, pp) => {
    if (e.type === 'error') {
      setIsValidImg(isValidImg.concat(pp));
    } else {
      return null
    }
  }

  return (
    <div className='d-row align-center color-b relative'>
      <div
        className='d-center mt-3 cursor'
        style={{ width: 80, height: 80, background: '#222', borderRadius: 8 }}
        onClick={() => router.push(`/nftmarketplace/${token_net}/${item.token_address}/${item.token_id}`, undefined, { shallow: true })}
      >
        {/* <img src={UtilService.ConvetImg(item.image)} alt='nft' style={{ maxWidth: 80, maxHeight: 80 }} /> */}
        {isValidImg.includes('g' + index) && <img src={UtilService.ConvetImg(item.image)} alt='nft' style={{ maxWidth: 80, maxHeight: 80 }} />}
        {!isValidImg.includes('g' + index) && <video src={UtilService.ConvetImg(item.image)} preload="auto" autoPlay={true} onError={e => onErrorVideo(e, 'g' + index)} style={{ width: 80, maxHeight: 80 }} />}
        </div>
      {item.contract_type === 'ERC1155' && <Amount>{item.amount}</Amount>}

      <div className="ml-4 align-center">
        <div>Name: {item.title}</div>
        <div><span className="text14 color-7">({item.contract_type})</span></div>
        {/* <div className="color-7 text14">Price: {item.price} ETH ({(item.price * ethPrice)?.toFixed(2)}$)</div> */}
        {/* {item.contract_type === 'ERC1155' && <div className="color-7 text14">Total Price: {(item.price * item.amount)?.toFixed(2)} ETH ({(item.price * item.amount * ethPrice)?.toFixed(2)}$)</div>} */}
      </div>
    </div>
  )
}

function CustomAtom({ selected, myData, saleCheckdataIds, brands, onChangeSelected, myDataCategoryList1, title, chain, idx, full }) {
  const total = myData.filter(x => (full ? true : saleCheckdataIds.includes(x.id)) && (x.chain === chain) && !x.lazyMint).length || 0;
  let router = useRouter();

  return (
    <>
      <div className="text14 pl-15 d-row w-full justify-betwen">
        <div className="d-row f-20">
          {total > 0 && <div
            aria-hidden="true"
            className={`arrow_carrot-${selected.includes(idx) ? 'up' : 'down'}`}
            style={{ fontSize: 26, cursor: 'pointer' }}
            onClick={() => onChangeSelected(idx)}
          />}
          <img className='filter-chain-icon2' src={UtilService.CurrencyIcon()} alt='icon' />
          {title}
        </div>
        <div className="count-text f-20">{total}</div>
      </div>

      {selected.includes(idx) &&
        brands.map((item, index) => {
          if (!myDataCategoryList1.includes(item.id)) return null;
          const subTotal = myData.filter(x => x.categoryId === item.id && !x.lazyMint && x.chain === chain).length;
          return (
            <div className="ml-60 w-full" key={index}>
              {subTotal > 0 && <div className="d-row">
                <span
                  aria-hidden="true"
                  className={`arrow_carrot-${selected.includes(idx + index) ? 'up' : 'down'}`}
                  style={{ fontSize: 24, marginTop: 2, cursor: 'pointer' }}
                  onClick={() => onChangeSelected(idx + index)}
                />
                <span className="f-18">{item.attributes.title}</span>&nbsp; ({subTotal})
              </div>}

              {selected.includes(idx + index) &&
                <div className="ml-20">
                  {myData.map((x, k) => {
                    if (x.categoryId !== item.id || x.lazyMint || x.chain !== chain) return null
                    return (
                      <div key={k} className='text-blue text14 cursor' onClick={() => router.push(`/nftmarketplace/${token_net}/${token_address}/${x.id}`, undefined, { shallow: true })}>
                        {x.name}
                      </div>)
                  })}
                </div>}
            </div>
          )
        }
        )
      }

    </>
  )
}

function LazyMintAtom({ selected, myLazyData, saleCheckdataIds, brands, onChangeSelected, myDataCategoryList2, full }) {
  const total = myLazyData.filter(x => (full ? true : saleCheckdataIds.includes(x.id))).length || 0;
  let router = useRouter();
  const idx = 'nft-onsale-lazy';

  return (
    <>
      <div className="text14 pl-15 d-row w-full justify-betwen">
        <div className="d-row f-20">
          {total > 0 && <div
            aria-hidden="true"
            className={`arrow_carrot-${selected.includes(idx) ? 'up' : 'down'}`}
            style={{ fontSize: 26, cursor: 'pointer' }}
            onClick={() => onChangeSelected(idx)}
          />}
          <i className="wm icon_lightbulb_alt" style={{ marginTop: 3, marginRight: 6, marginLeft: 3 }} />
          {'Lazy Mint'}
        </div>
        <div className="count-text f-20">{total}</div>
      </div>

      {selected.includes(idx) &&
        brands.map((item, index) => {
          if (!myDataCategoryList2?.includes(item.id)) return null;
          const myLazyFilterData = myLazyData.filter(x => x.categoryId === item.id);
          const subTotal = myLazyFilterData.length;

          return (
            <div className="ml-60 w-full" key={index}>
              {subTotal > 0 && <div className="d-row">
                <span
                  aria-hidden="true"
                  className={`arrow_carrot-${selected.includes(idx + index) ? 'up' : 'down'}`}
                  style={{ fontSize: 24, marginTop: 2, cursor: 'pointer' }}
                  onClick={() => onChangeSelected(idx + index)}
                />
                <span className="f-18">{item.attributes.title} </span> &nbsp;({subTotal})
              </div>}

              {selected.includes(idx + index) &&
                <div className="ml-20">
                  {myLazyFilterData.map((x, k) => {
                    return (
                      <div key={k} className='text-blue text14 cursor' onClick={() => router.push(`/nftmarketplace/${token_net}/${token_address}/${x.id}`, undefined, { shallow: true })}>
                        {x.name}
                      </div>)
                  })}
                </div>}
            </div>
          )
        }
        )}
    </>
  )
}