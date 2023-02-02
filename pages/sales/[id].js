import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'underscore';
import { useMoralis } from 'react-moralis';
import { PROD } from '../../keys';
import { onGetSearchData } from '../../common/web3Api';
import { useDispatch } from 'react-redux';
const Sales = dynamic(() => import('../../atoms/sales'));

const IndividualProfilePage = () => {

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const [realData, setRealData] = useState([]);
  const { isInitialized, Moralis, account } = useMoralis();

  const fetchNFTs = useCallback(async () => {
    if (!id || !isInitialized) return false;
    setRealData([]);
    const request = {
      page: 0,
      step: 100,
      prod: PROD,
      owner_of: id,
      hidden: account
    }
    dispatch(onGetSearchData(Moralis, request, id, (res) => {
      setRealData([...res.data])
    }))
  }, [id, isInitialized]);

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  return (
    <Sales realData={realData.filter(u => u.metadata !== null)} hiddenMenu />
  );
}

export default IndividualProfilePage;