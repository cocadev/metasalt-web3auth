import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { PROD } from '../keys';
import _ from 'underscore';
import { useDispatch } from 'react-redux';
import { onGetSearchData } from '../common/web3Api';
const Sales = dynamic(() => import('../atoms/sales'));

const MyNFTsPage = () => {

  const [realData, setRealData] = useState([]);
  const dispatch = useDispatch();
  const { isInitialized, user, Moralis } = useMoralis();
  const account = user?.attributes?.ethAddress

  useEffect(() => {
    isInitialized && account && fetchNFTs()
  }, [isInitialized, account])

  const fetchNFTs = async () => {

    setRealData([]);
    const request = {
      page: 0,
      step: 100,
      prod: PROD,
      owner_of: account,
      hidden: account
    }

    dispatch(onGetSearchData(Moralis, request, account, (res) => {
      setRealData([...res.data])
    }))

  };

  return (
    <Sales realData={realData.filter(u => u.metadata !== null)} hiddenMenu />
  );

}

export default MyNFTsPage;