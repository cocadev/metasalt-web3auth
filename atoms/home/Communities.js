import React, { memo, useCallback, useMemo } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useSelector } from "react-redux";
import CardCommnuity from "../../components/cards/CardCommnuity";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center
`;

const Communities = ({count, favFilter}) => {

  const { user } = useMoralis();
  const { data: nFTGates } = useMoralisQuery("NFTGates", query => query.descending("createdAt").limit(count || 5), []);
  const { data: brands } = useMoralisQuery("RealBrands");
  const { data: allCollections } = useMoralisQuery("Brands");
  const { users } = useSelector(state => state.users);

  const { data: likes } = useMoralisQuery("AllLikes", query => query.equalTo("userId", user?.id || '-' ).equalTo('follow', false), [user], { autoFetch: true });
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

  const filteredGates = useMemo(()=> nFTGates.map(item => {

    const gateBrand = getBrand(item.attributes.brand)
    const gateCollection = getGateCollection(item.attributes.collection)
    const owner = getOwner(item.attributes.owner)

    return {
      id: item.id,
      gateImg: item.attributes.img,
      avatar: owner?.avatar,
      title: item.attributes.title,
      description: item.attributes.description,
      brand: gateBrand?.attributes?.title || '-',
      collection: gateCollection?.attributes?.title || '-',
      other: item.attributes.type + ' • ' + item.attributes.status,
      contents: JSON.parse(item.attributes.contents),
      nfts:JSON.parse(item.attributes.nfts || "{}"),
      globalNFTs:JSON.parse(item.attributes.globalNFTs || "{}"),
    }
  }), [getBrand, getGateCollection, getOwner, nFTGates, brands, users, allCollections])

  return (
    <StyledContainer>
      {filteredGates
      .filter(x => favFilter ? allLikesData.includes(x.id) : x)
      .map((item, index) => {
        return (
          <CardCommnuity 
            key={index}
            data={item}
          />
        )
      })}
    </StyledContainer>
  );
}

export default memo(Communities);
