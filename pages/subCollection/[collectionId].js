import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import bigInt from 'big-integer';
import _ from 'underscore';
import { useMoralis } from 'react-moralis';
import { PROD } from '../../keys';
const Sales = dynamic(() => import('../../atoms/sales'));

const IndividualCollectionPage = () => {

  const router = useRouter();
  const { collectionId } = router.query;
  const [realData, setRealData] = useState([]);
  const { isInitialized, Moralis, account } = useMoralis();

  useEffect(() => {
    isInitialized && collectionId && fetchNFTs()
  }, [collectionId, isInitialized])

  const fetchNFTs = async () => {
    setRealData([]);

    const resMetasalt = await Moralis.Cloud.run('GetAllNFTs', {
      page: 0,
      step: 20,
      prod: PROD,
      collection: collectionId,
      hidden: account
    })
  
    const metasaltNFTs = resMetasalt.data.map(x => {
      const hextokenId = '0x' + bigInt(x.token_id).toString(16);
      return { ...x, token_id: hextokenId }
    })

    const allFiltered =  _.uniq(metasaltNFTs, c => c.token_id)
    const filtered = allFiltered?.sort(function (a, b) {
      return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
    })
    setRealData([...filtered])
  };

  return (
    <Sales realData={realData} hiddenMenu/>
  );
}

export default IndividualCollectionPage;