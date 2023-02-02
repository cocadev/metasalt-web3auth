import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onEmptySearch } from '../../store/actions/nfts/nfts';
import { MetaTag } from '../../components/MetaTag';
import {
  getAllCollections,
  getAllLazyMints,
  getAllLikes,
  getAllOrderData,
  getAllVerifications,
} from '../../common/api';
import { DESCRIPTION, PROD } from '../../keys';
import { onGetSearchData } from '../../common/web3Api';
import { useWeb3Auth } from '../../services/web3auth';

const Sales = dynamic(() => import('../../atoms/sales'));

const NftMarketplace = ({ allCollections, allLikes, allOrderData, allVerifications }) => {

  const dispatch = useDispatch();
  const { user } = useWeb3Auth();
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [realData, setRealData] = useState([])

  const { search } = useSelector(state => state.nfts)
  const { erc721, erc1155, lazyMint, normalMint, searchKey, buynow, cols, brands, eth, matic } = search
  const request = {
    page,
    step: 20,
    prod: PROD,
    hidden: '',
    search: {
      lazyMint: lazyMint ? true : normalMint ? undefined : 'All',
      type: (erc721 && erc1155) ? 'ERC' : erc721 ? 'ERC721' : erc1155 ? 'ERC1155' : 'ERC',
      searchKey: searchKey || '',
      buynow,
      cols,
      brands,
      net: (eth && matic) ? 'All' : eth ? 'eth' : matic ? 'matic' : 'All'
    }
  }

  const onGetNFTs = useCallback(async () => {
    setIsLoading(true);

    // const response = await getAllLazyMints()
    // const { data, count = 1 } = response

    // const nft721_goerli = await Moralis.Web3API.token.getNFTOwners({ address: GOERLI_MINT721_ADDRESS, chain: 'goerli' })
    // const nft1155_goerli = await Moralis.Web3API.token.getNFTOwners({ address: GOERLI_MINT1155_ADDRESS, chain: 'goerli' })

    // const allData = [...data, ...nft721_goerli?.result, ...nft1155_goerli?.result];
    // const uniqTokenIdData = [...new Map(allData.map(item => [item['token_id'], item])).values()];
    // const sortData = uniqTokenIdData.sort(function (a, b) {
    //   return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
    // })

    // setRealData(sortData)
    // setCount(count)

    // setIsLoading(false)
    
    dispatch(onGetSearchData((res) => {
      const { data, count } = res;
      setRealData(data);
      setCount(count);
      setIsLoading(false);
    }))
    
  }, [])

  useEffect(() => {
    onGetNFTs().then()
    dispatch(onEmptySearch())
  }, [dispatch, onGetNFTs])

  const onGetLoadMoreNFTs = useCallback(async (x) => {
    setIsLoading(true)

    const response = await getAllLazyMints()
    const { data, count = 1 } = response
    setRealData(x === 0 ? data : [...realData, ...data]);
    setCount(count);
    setPage(x);

    setIsLoading(false)
    /*
    dispatch(onGetSearchData(Moralis, { ...request, page: x }, null, (res) => {
      const { data, count } = res;
      setRealData(x === 0 ? data : [...realData, ...data]);
      setCount(count);
      setPage(x);
      setIsLoading(false);
    }))
    */
  }, [])

  useEffect(() => {
    setRealData([]);
    onGetLoadMoreNFTs(0).then()
  }, [onGetLoadMoreNFTs, search])

  return (
    <div>
      <MetaTag
        {...{
          title: 'Metasalt Buy/Sell',
          description: DESCRIPTION,
          image: 'https://www.metasalt.io/img/preview.png',
        }}
      />
      <Sales
        realData={realData}
        isAll
        enableLoadMore={count / 20 > page + 1}
        onLoadMore={() => onGetLoadMoreNFTs(page + 1)}
        loading={isLoading}
        allCollections={allCollections}
        allLikes={allLikes}
        allOrderData={allOrderData}
        allVerifications={allVerifications}
      />
    </div>
  );
}

export const getServerSideProps = async () => {

  const response1 = await getAllCollections()
  const response2 = await getAllLikes()
  const response3 = await getAllOrderData()
  const response4 = await getAllVerifications()

  return {
    props: {
      allCollections: response1 || [],
      allLikes: response2 || [],
      allOrderData: response3 || [],
      allVerifications: response4 || [],
    }
  }
}

export default NftMarketplace;
