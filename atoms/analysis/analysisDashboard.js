import React, { useCallback, useMemo } from 'react';
import CardCommnuity from '../../components/cards/CardCommnuity';
import NftCard from '../../components/cards/NftCard';
import { useSelector } from 'react-redux';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import styled from 'styled-components';
import { Title } from '../../constants/globalCss';
import { useState } from 'react';
import UtilService from '../../sip/utilService';

const CTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`

const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  margin-top: 40px;
`

const AnalysisDashboard = ({ }) => {

  const { nfts } = useSelector(state => state.nfts)
  const { data: orderdata } = useMoralisQuery("OrderData", query => query.descending("createdAt"));
  const { data: nFTGates } = useMoralisQuery("NFTGates", query => query.descending("createdAt").limit(12), []);
  const { data: brands } = useMoralisQuery("RealBrands");
  const { data: allCollections } = useMoralisQuery("Brands");
  const { users } = useSelector(state => state.users)
  const { user } = useMoralis();
  const [trigger, setTrigger] = useState(0);

  const { data: likes } = useMoralisQuery("AllLikes", query => query.equalTo("userId", user?.id || '-'), [user, trigger], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })

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

    const gateBrand = getBrand(item.attributes.brand)
    const gateCollection = getGateCollection(item.attributes.collection)
    const owner = getOwner(item.attributes.owner)

    // if (owner?.account === account) {
      filtered.push({
        id: item.id,
        gateImg: item.attributes.img,
        avatar: owner?.avatar,
        title: item.attributes.title,
        description: item.attributes.description,
        brand: gateBrand?.attributes?.title || '-',
        collection: gateCollection?.attributes?.title || '-',
        other: item.attributes.type + ' • ' + item.attributes.status,
        contents: JSON.parse(item.attributes.contents),
        nfts: JSON.parse(item.attributes.nfts || "{}"),
        globalNFTs: JSON.parse(item.attributes.globalNFTs || "{}"),
      })
    // }

    return filtered
  }, []).filter((x, i) => i < 3)

  const NFTs = nfts.reduce(function (filtered, item) {
    if (item.metadata) {
      filtered.push(item)
    }
    return filtered
  }, []).filter((x, i) => i < 3)


  return (
    <div>
    <Title>Metasalt Dashboard</Title>
      <Box>
        <CTitle>Top NFTs</CTitle>
      </Box>
      <div style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', flexWrap: 'wrap' }}>
        {
          NFTs.map((item, index) => {

            const { image, price, category, isVideo, name } = JSON.parse(item.metadata);
            const moralisOrderData = orderdata.length > 0 && orderdata.find(x => x.attributes.tokenId === item.token_id);
            const token_address = item.token_address;
            const isMetasalt = UtilService.checkMetasalt(token_address)

            return (
              <div key={index}>
                <NftCard
                  nft={{
                    preview_image_url: UtilService.ConvetImg(image),
                    title: name,
                    price: moralisOrderData?.attributes?.price || price,
                    description: 'Metasalt Token ',
                    lazyMint: item?.lazyMint,
                    categoryId: category?.value,
                    isVideo,
                    isMetasalt,
                    token_address,
                    thumbnail: UtilService.ConvetImg(item?.thumbnail)
                  }}
                  big={true}
                  token_id={item.token_id}
                  favHidden={true}
                />
              </div>)
          })
        }
      </div>

      <Box>
        <CTitle>Top Communities</CTitle>
      </Box>

      <div style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', flexWrap: 'wrap' }}>
        {filteredGates.map((item, index) => {
          return (
            <CardCommnuity
              key={index}
              data={item}
              onTrigger={() => setTrigger(trigger + 1)}
              isLike={allLikesData.includes(item.id)}
            />
          )
        })}
      </div>

    </div>
  );
};

export default AnalysisDashboard;