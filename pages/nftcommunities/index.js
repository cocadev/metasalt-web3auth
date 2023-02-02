import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Offcanvas } from 'react-bootstrap';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useSelector } from 'react-redux';
import useWindowSize from '../../hooks/useWindowSize';
const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));
const CardCommunity = dynamic(() => import('../../components/cards/CardCommnuity'));
const GatedLeftSearch = dynamic(() => import('../../atoms/sales/gatedLeftSearch'));
const GatedFilterBar = dynamic(() => import('../../atoms/sales/GatedFilterBar'));
const CommunityTab = dynamic(() => import('../../atoms/sales/CommunityTab'));
import { Title, Description } from '../../constants/globalCss'
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import { DESCRIPTION } from '../../keys';
import { MetaTag } from '../../components/MetaTag';

const TitleSection = styled.div`
  padding: 80px 0 40px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    padding: 40px 20px;
  }
`

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

const AllNFTGates = () => {

  const { width } = useWindowSize();
  const router = useRouter();
  const search = router.query?.search;
  const [isActive, setIsActive] = useState(1);

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [gateSearch, setGateSearch] = useState({
    type: null,
    brand: null,
    collection: null
  })

  const [category, setCategory] = useState();
  const { type, brand, collection } = gateSearch;
  const [searchKey, setSearchKey] = useState();
  const { user } = useMoralis();
  const [trigger, setTrigger] = useState(0);

  const { data: brands } = useMoralisQuery('RealBrands');
  const { data: allCollections } = useMoralisQuery('Brands');
  const { data: collections } = useMoralisQuery('Brands', query => query.equalTo('brand', gateSearch.brand?.value || '-'), [gateSearch.brand]);
  const { data: nFTGates } = useMoralisQuery('NFTGates', query => query.descending('createdAt'));

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
    if (searchKey && (!item.attributes.title?.toLowerCase().includes(cKey) && !item.attributes.description?.toLowerCase().includes(cKey))) return filtered;
    const gateBrand = getBrand(item.attributes.brand);
    const gateCollection = getGateCollection(item.attributes.collection)
    const isTypeMatch = (type && type.label === item.attributes.type) || !type
    const isBrandMatch = (brand && brand.label === gateBrand?.attributes?.title) || !brand
    const isCollectionMatch = (collection && collection.value === gateCollection?.id) || !collection
    const isCategoryMatch = !category || category === gateBrand?.attributes?.category
    if (!isTypeMatch || !isBrandMatch || !isCollectionMatch || !isCategoryMatch) return filtered
    if (isActive === 2) {
      if (!allLikesData.includes(item.id)) {
        return filtered
      }
    }
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
    return filtered
  }, [])

  const FILTER_BRANDS = brands.map(item => ({
    value: item.id,
    label: item.attributes.title,
  }))

  const FILTER_COLLECTIONS = collections.map(item => ({
    value: item.id,
    label: item.attributes.title,
  }))

  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1)
    }, 1000)
  }, [])

  useEffect(() => {
    if (search) {
      setSearchKey(search.replace(/%20/g, ' '))
    }
    if (search && search.includes('?collection=')) {

      const collectionId = search.substring(12).replace(/%20/g, ' ');
      const collectOb = allCollections.find(item => item.id === collectionId)

      setGateSearch({
        ...gateSearch, collection: {
          label: collectOb?.attributes?.title,
          value: collectionId
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, allCollections])

  const onChangeSearchKey = e => setSearchKey(e.target.value)

  const handleClose = () => {
    setIsOpenMenu(false);
  }

  const onSelectCategory = (value) => {
    setCategory(category === value ? '' : value)
  }

  return (
    <div>
      <MetaTag {...{
        title: 'All NFT Communities',
        description: 'Search, Join, and Interact with your favorite communities',
        image: 'https://www.metasalt.io/img/preview.png',
      }} />
      <LayoutPage>

        <TitleSection>
          <Title>{'All NFT Communities'}</Title>
          <Description>Search, Join, and Interact with your favorite communities</Description>
        </TitleSection>

        <div>
          <CommunityTab {...{ filteredGates, isActive, setIsActive, allLikesData }} />

          <div className='d-row'>
            {width > 850 && <GatedLeftSearch
              collections={FILTER_COLLECTIONS}
              brands={FILTER_BRANDS}
              search={gateSearch}
              setGateSearch={setGateSearch}
            />}

            {width <= 850 &&
              <Offcanvas
                style={{ background: '#1a1a1a', width: 340 }}
                show={isOpenMenu}
                onHide={handleClose}
                placement='start'
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title className="color-b">Search</Offcanvas.Title>
                </Offcanvas.Header>
                <GatedLeftSearch
                  collections={FILTER_COLLECTIONS}
                  brands={FILTER_BRANDS}
                  search={gateSearch}
                  setGateSearch={setGateSearch}
                />
              </Offcanvas>}

            {width <= 850 && <img
              src="/img/menu.png"
              className="cursor"
              alt=""
              style={{ position: 'absolute', left: 12, width: 40, marginTop: 50 }}
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            />}

            <div className='w-full mx-4 mt-4'>

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

              <div className='w-full mt-2 mb-5'>
                <div className='d-row flex-wrap d-center'>
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
        </div>

      </LayoutPage>
    </div>
  )
};

export default AllNFTGates;