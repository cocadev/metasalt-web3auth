import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import bigInt from 'big-integer';
import _ from 'underscore';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { getLazyCollectionData } from '../../store/actions/nfts/nfts';
import { TinyLoading } from '../../components/loading';
import UtilService from '../../sip/utilService';
import { INIT_BIG_SEARCH, INIT_CURRENCY, } from '../../constants/filters';
import { DropdownStyles } from '../../constants/dropdownlist';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';
const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));
const ProfileNFTList = dynamic(() => import('../../atoms/sales/ProfileNFTList'));

const H2 = styled.h2`
  font-size: 34px;
  @media only screen and (max-width: 800px) {
    font-size: 25px;
    line-height: 27px;
  }
`

const SubMarket = () => {

  const router = useRouter();
  const params = router.query;
  const dispatch = useDispatch();
  const { collectionId } = router.query;
  const { nfts } = useSelector(state => state.nfts);
  const { account, Moralis, chainId } = useMoralis();
  const [isCollection, setIsCollection] = useState(null); // collectionId
  const [searchKey, setSearchKey] = useState('');
  const [accounting, setAccounting] = useState();
  const [traitType, setTraitType] = useState();
  const [traitValue, setTraitValue] = useState();
  const [trigger, setTrigger] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lazyCollectionData, setLazyCollectionData] = useState([]);
  const { data: collections } = useMoralisQuery('Brands', query => query.equalTo('objectId', isCollection).limit(1), [trigger]);
  const { description: myaddress, title: username, avatar, creatorId, banner = DEMO_BACKGROUND } = (collections[0]?.attributes) || '';

  const ddd = lazyCollectionData.reduce(function (filtered, item) {
    const meta = JSON.parse(item.metadata);
    filtered.push(...meta.attributes)
    return filtered
  }, [])

  const dedup = [...ddd.reduce((map, { trait_type, value }) => {
    return (map.set(`${trait_type}-${value}`, { trait_type, value }));
  }, new Map()).values()];

  const types = dedup.map(x => x.trait_type);
  const values = dedup.filter(i => i.trait_type === traitType?.value).map(x => x.value);

  useEffect(() => {
    if (params?.id) {
      setAccounting(params?.id)
    } else if (params?.collectionId) {
      setIsCollection(params?.collectionId);
    } else {
      setAccounting(account)
    }
  }, [params, account])

  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1);
      onGetLazyData();
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, traitValue]);

  const handleTraitType = async (e) => {
    setTraitType(e);
    setTraitValue(null);
  }

  const handleTraitValue = async (e) => {
    setTraitValue(e);
  }

  const onChangeSearchKey = (e) => {
    setSearchKey(e.target.value)
  }

  const onGetLazyData = async () => {
    setLoading(true);
    setLazyCollectionData([])
    const LazyCollection = Moralis.Object.extend('LazyCollections');
    const lazyCollection = new Moralis.Query(LazyCollection).limit(70);
    lazyCollection.equalTo('collection', params?.collectionId);
    if (searchKey) {
      lazyCollection.matches('metadata', searchKey + '');
    }
    if (traitValue) {
      lazyCollection.matches('metadata', '"' + traitValue?.value + '"');
    }
    const allLazyCollections = await lazyCollection.find();

    const cols = allLazyCollections.map((item) => {
      const { name, amount, contract_type, metadata, token_uri, createdAt, creator, token_id } = item.attributes;
      let customMetadata = JSON.parse(metadata);
      customMetadata = JSON.stringify({ ...customMetadata, price: '0.01' })

      const newTokenId = creator + 'b' + '5' + UtilService.FormatNumberLength('0x1'.substring(2), 5) + (contract_type === 'ERC1155' ? '1155' : '0721') + UtilService.FormatNumberLength(token_id, 13);

      return {
        amount: amount || '1',
        contract_type: contract_type || 'ERC721',
        is_valid: 0,
        metadata: customMetadata,
        name,
        owner_of: creator,
        token_address: contract_type === 'ERC1155' ? UtilService.getMint1155Address(chainId) : UtilService.getMintAddress(chainId),
        token_id: newTokenId,
        token_uri,
        lazyMint: true,
        last_metadata_sync: createdAt,
        last_token_uri_sync: createdAt,
        synced_at: createdAt,
        type: contract_type || 'ERC721',
        supply: amount || 1,
        royaltyFee: 0,
        privateSale: false
      }
    })

    const filtering = await cols.reduce(function (filterd, item) {
      const { image, name } = JSON.parse(item.metadata);
      if (item.metadata && name) {
        const convertedImg = UtilService.ConvetImg(image);
        const hextokenId = UtilService.checkHexa(item.token_id) ? item.token_id : '0x' + bigInt(item.token_id).toString(16);
        filterd.push({ ...item, image: convertedImg, token_id: hextokenId, name: name || '-' })
      }
      return filterd
    }, [])
    setLazyCollectionData([...filtering])
    setLoading(false);
    // console.log('filtering....', filtering)
    filtering.length > 0 && dispatch(getLazyCollectionData(filtering))
  }

  // eslint-disable-next-line array-callback-return
  const realData = nfts.filter(item => {
    if (isCollection) {
      const metaData = JSON.parse(item.metadata);
      const category = metaData?.category?.value;
      if (category === isCollection && isCollection) { return true }
    }
    else if (item.owner_of?.toLowerCase() === accounting) { return true }
    else { return false }
  })

  return (
    <LayoutPage>

      <div>
        <section
          className='jumbotron breadcumb no-bg'
          style={banner ? { backgroundImage: `url(${banner})`, backgroundPosition: 'center' } : { background: '#e5e8eb' }}
        >
          <div className='mainbreadcumb' style={{ height: 60, marginTop: -54 }} />
        </section>

        {account === creatorId && <div className='btn btn-primary ml-2' style={{ position: 'absolute', left: 30, marginTop: 30 }} onClick={() => router.push('/edit/collection/' + collectionId)}>Edit</div>}

      </div>

      <section>

        <div className='d-center'>
          <div className='profile-avatar'>
            <img src={avatar || DEMO_AVATAR} alt='avatar' /><br />
          </div>
          <H2 className='color-b text-center mt-5'>{username}</H2>
          <div style={{ marginTop: -7, maxWidth: 500 }} className='text-center'>{myaddress}</div>
        </div>

        <div className='flex flex-row align-items-start m-2 mt-4' style={{ minHeight: 70 }}>
          <input
            type="text"
            className="serchBar mr-2"
            name="search"
            placeholder="Search"
            value={searchKey}
            onChange={onChangeSearchKey}
          />
          <div className='dropdownSelect one mr-2' style={{ width: 300 }}>
            <Select
              styles={DropdownStyles}
              menuContainerStyle={{ 'zIndex': 999 }}
              options={_.uniq(types).map(ii => ({ label: ii, value: ii }))}
              value={traitType}
              onChange={handleTraitType}
              placeholder='Enter Trait Type'
            />
          </div>
          <div className='dropdownSelect one mr-2' style={{ width: 300 }}>
            <Select
              styles={DropdownStyles}
              menuContainerStyle={{ 'zIndex': 999 }}
              value={traitValue}
              options={_.uniq(values).map(ii => ({ label: ii, value: ii }))}
              onChange={handleTraitValue}
              placeholder='Enter Trait Value'
            />
          </div>
        </div>

        <div>
          {loading && <div className='w-full d-center'><TinyLoading /></div>}
          <div className='d-row'>

            <div className='w-full'>
              <ProfileNFTList {...{
                isLoading: false,
                isActive: 1,
                realData: [
                  ...realData,
                  ...lazyCollectionData
                ],
                searchKey,
                isBig: true,
                bigSearch: INIT_BIG_SEARCH,
                currency: INIT_CURRENCY,
                isCollection: true,
                disableCount: true
              }} />
            </div>
          </div>
        </div>

      </section>
    </LayoutPage>
  )
};

export default SubMarket;