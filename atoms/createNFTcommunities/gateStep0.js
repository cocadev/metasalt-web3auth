import Link from 'next/link';
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateGated } from '../../store/actions/nfts/nfts';
import { useMoralis, useMoralisQuery } from "react-moralis";
import CardCommnuity from "../../components/cards/CardCommnuity";
import ModalBrandCollectionError from '../../components/modals/warnings/modalBrandCollectionError';

function GateStep0({ brands, collections }) {

  const dispatch = useDispatch();
  const { user } = useMoralis();
  const { gated } = useSelector(state => state.nfts);
  const { users } = useSelector(state => state.users)

  const { brand, collection } = gated;
  const { data: nFTGates } = useMoralisQuery("NFTGates", query => query.equalTo('owner', user?.id).descending('createdAt'), [user]);
  const { data: allCollections } = useMoralisQuery("Brands");
  const { data: allBrands } = useMoralisQuery("RealBrands");

  const [trigger, setTrigger] = useState(0);
  const [isModal, setIsModal] = useState(false);

  const { data: likes } = useMoralisQuery("AllLikes", query => query.equalTo("userId", user?.id || '-').equalTo('follow', false), [trigger, user], { autoFetch: true });
  const { data: follows } = useMoralisQuery("AllLikes", query => query.equalTo("userId", user?.id || '-').equalTo('follow', true), [trigger, user], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })
  const allFollowsData = follows.map(item => { return item.attributes.itemId })

  const collectionMap = useMemo(() => [], []);
  const brandMap = useMemo(() => [], []);
  const ownerMap = useMemo(() => [], []);

  allCollections.forEach(x => collectionMap[x.id] = x);
  allBrands.forEach(x => brandMap[x.id] = x);
  users.forEach(x => ownerMap[x.id] = x);

  const getGateCollection = useCallback((collection) => collectionMap[collection], [collectionMap])
  const getBrand = useCallback((brand) => brandMap[brand], [brandMap])
  const getOwner = useCallback((user) => ownerMap[user], [ownerMap])

  const filteredGates = nFTGates.reduce(function (filtered, item) {
    const gateBrand = getBrand(item.attributes.brand);
    const gateCollection = getGateCollection(item.attributes.collection)

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
      nfts: JSON.parse(item.attributes.nfts || "{}"),
      globalNFTs: JSON.parse(item.attributes.globalNFTs || "{}"),
    })
    return filtered
  }, [])

  const onStart = () => {

    if(!(collection && brand)){
      setIsModal(true);
      return false;
    }
    dispatch(onUpdateGated({ step: 1 }))
  }

  return (
    <div className='d-center'>

      {brands?.length === 0 && <div className="alert alert-danger text-center" style={{ marginTop: 10 }}>
        You must <Link href='/create/brand' style={{ textDecoration: 'underline' }} prefetch={false}> create </Link> at least one brand before minting.
      </div>}

      {collections?.length === 0 && <div className="alert alert-danger text-center" style={{ marginTop: 10 }}>
        You have to <Link href='/create/collection' style={{ textDecoration: 'underline' }} prefetch={false}> create </Link> at least one collection before minting.
      </div>}

      <button className={`btn btn-primary`} onClick={onStart}>Create</button>

      <br/>
      <div className="color-b text24">My Communities</div>
      <div className='w-full mt-2'>
        <div className='d-row flex-wrap d-center'>
          {
            filteredGates.map((item, index) =>
              <CardCommnuity
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

      {
        isModal &&
        <ModalBrandCollectionError
          onClose={() => setIsModal(false)}
        />
      }
    </div>
  )
}

export default GateStep0;