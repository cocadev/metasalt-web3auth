import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useSelector } from 'react-redux';
import LayoutPage from '../components/layouts/layoutPage';
const GatedLeftSearch = dynamic(() => import('../atoms/sales/gatedLeftSearch'));
const GatedFilterBar = dynamic(() => import('../atoms/sales/GatedFilterBar'));
const CardCommunity = dynamic(() => import('../components/cards/CardCommnuity'));
import { CATEGORIES_COLLECTIONS } from '../constants/hotCollections';
import { Title } from '../constants/globalCss'

const AtomBtn = styled.div`
  cursor: pointer;
  margin: 5px;
  border: 1px solid #555;
  color: #555;
  padding: 5px 11px;
  border-radius: 16px;
  @media only screen and (max-width: 600px) {
    padding: 2px 7px;
    font-size: 14px
  }
  ${props => props.selected &&
    css`
      color: #ddd;
      background: #444
   `
  }
`
const TitleSection = styled.div`
  padding: 80px 0 40px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    padding: 40px 20px;
  }
`

const MyNFTGates = () => {

  const { user } = useMoralis();
  const [gateSearch, setGateSearch] = useState({
    type: null,
    brand: null,
    collection: null
  })
  const [trigger, setTrigger] = useState(0);

  const { type, brand, collection } = gateSearch;
  const [searchKey, setSearchKey] = useState();
  const [category, setCategory] = useState();
  const { data: brands } = useMoralisQuery('RealBrands');
  const { data: allCollections } = useMoralisQuery('Brands');
  const { data: collections } = useMoralisQuery('Brands', query => query.equalTo('brand', gateSearch.brand?.value || '-'), [gateSearch.brand]);
  const { data: nFTGates } = useMoralisQuery('NFTGates', query => query.equalTo('owner', user?.id).descending('createdAt'), [user]);

  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('userId', user?.id || '-').equalTo('follow', false), [trigger, user], { autoFetch: true });
  const { data: follows } = useMoralisQuery('AllLikes', query => query.equalTo('userId', user?.id || '-').equalTo('follow', true), [trigger, user], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })
  const allFollowsData = follows.map(item => { return item.attributes.itemId })


  const { users } = useSelector(state => state.users)
  const cKey = searchKey?.toLowerCase();

  const collectionMap = useMemo(() => [], []);
  const brandMap = useMemo(() => [], []);
  const ownerMap = useMemo(() => [], []);

  allCollections.forEach(x => collectionMap[x.id] = x);
  brands.forEach(x => brandMap[x.id] = x);
  users.forEach(x => ownerMap[x.id] = x);

  const getGateCollection = useCallback((collection) => collectionMap[collection], [collectionMap])
  const getBrand = useCallback((brand) => brandMap[brand], [brandMap])
  const getOwner = useCallback((user) => ownerMap[user], [ownerMap])

  const filteredGates = nFTGates.reduce(function (filtered, item) {
    const isSearchFailed = searchKey && (!item.attributes.title?.toLowerCase().includes(cKey) && !item.attributes.description?.toLowerCase().includes(cKey));
    if (isSearchFailed) {
      return null
    }
    const gateBrand = getBrand(item.attributes.brand);
    const gateCollection = getGateCollection(item.attributes.collection)
    const isTypeMatch = (type && type.label === item.attributes.type) || !type
    const isBrandMatch = (brand && brand.label === gateBrand?.attributes?.title) || !brand
    const isCollectionMatch = (collection && collection.value === gateCollection?.id) || !collection
    const isCategoryMatch = !category || category === gateBrand?.attributes?.category;
    const isFailed = !isTypeMatch || !isBrandMatch || !isCollectionMatch || !isCategoryMatch
    if (!isFailed) {
      const owner = getOwner(item.attributes.owner)
      filtered.push({
        id: item.id,
        gateImg: item.attributes.img,
        avatar: owner?.avatar,
        title: item.attributes.title,
        brand: gateBrand?.attributes?.title || '-',
        collection: gateCollection?.attributes?.title || '-',
        other: item.attributes.type + ' • ' + item.attributes.status,
        contents: JSON.parse(item.attributes.contents),
        nfts: JSON.parse(item.attributes.nfts || '{}'),
        globalNFTs: JSON.parse(item.attributes.globalNFTs || '{}'),
      })
    }
    return filtered
  }, [])

  const FILTER_BRANDS = brands.map((item) => {
    return {
      value: item.id,
      label: item.attributes.title,
    }
  })

  const FILTER_COLLECTIONS = collections.map((item) => {
    return {
      value: item.id,
      label: item.attributes.title,
    }
  })

  const onChangeSearchKey = e => setSearchKey(e.target.value)

  const onSelectCategory = (value) => {
    setCategory(category === value ? '' : value)
  }

  return (
    <LayoutPage>
      <TitleSection>
        <Title>{'My NFT Communities'}</Title>
      </TitleSection>

      <div className='d-row'>
        <GatedLeftSearch collections={FILTER_COLLECTIONS} brands={FILTER_BRANDS} search={gateSearch} setGateSearch={setGateSearch} />
        <div className='w-full mx-4'>

          <input
            type="text"
            className="serchBar"
            name="search"
            placeholder="Search Title"
            value={searchKey}
            onChange={onChangeSearchKey}
          />

          <div className='d-row mt-4 d-center flex-wrap'>
            {CATEGORIES_COLLECTIONS.map((item, index) =>
              <AtomBtn
                selected={category === item.value}
                key={index}
                onClick={() => onSelectCategory(item.value)}
              >
                {item.label}
              </AtomBtn>)}
          </div>

          <GatedFilterBar
            search={gateSearch}
            setGateSearch={setGateSearch}
          />

          <div className='w-full mt-2'>
            <div className='d-row flex-wrap d-center'>
              {filteredGates?.length === 0 && !category && <div className="alert alert-danger text-center" style={{ marginTop: 20 }}>
                Create your first <Link href='/createNFTcommunities' style={{ textDecoration: 'underline' }} prefetch={false}> community</Link>
              </div>}
              {
                filteredGates.map((item, index) =>
                  <CardCommunity
                    key={index}
                    data={item}
                    onTrigger={() => setTrigger(trigger + 1)}
                    isLike={allLikesData.includes(item.id)}
                    isFollow={allFollowsData.includes(item.id)}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>

    </LayoutPage>
  )
};

export default MyNFTGates;