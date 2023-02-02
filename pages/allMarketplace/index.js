import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';
const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));
const LayoutScreen = dynamic(() => import('../../components/layouts/layoutScreen'));
const ModalDeleteCollection = dynamic(() => import('../../components/modals/modalDeleteCollection'));
const CustomLazyCollection = dynamic(() => import('../../components/custom/CustomLazyCollection'));

const AllMarketplace = () => {
  const [trigger, setTrigger] = useState(1);
  const [modalDelIndex, setModalDelIndex] = useState(-1);
  const [searchKey, setSearchKey] = useState();
  const [counts, setCounts] = useState([]);
  const [collections, setCollections] = useState([]);
  const router = useRouter();
  const { account, Moralis } = useMoralis();
  const { data: LazyCollectionTable } = useMoralisQuery('LazyCollectionTable');

  const tables = LazyCollectionTable.map(item => {
    return {
      address: item.attributes.collectionAddress,
      category: item.attributes.collection
    }
  })

  useEffect(() => {
    setTimeout(() => {
      onGetCounts();
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    if (tables.length > 0) {
      onGetCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tables])

  const onGetCollections = async () => {
    const query2 = new Moralis.Query('Brands');
    query2.containedIn('objectId', tables.map(item => item.category));
    const result = await query2.find();
    setCollections(result)
  }

  const onGetCounts = async () => {
    const query = new Moralis.Query('LazyCollections');
    let rows = [];
    for (let i = 0; i < tables.length; i++) {
      query.equalTo('token_address', tables[i].address);
      const count = await query.count();
      rows.push({ count, address: tables[i].address, category: tables[i].category });
    }
    setCounts(rows)
  }

  const customData = collections.reduce(function (filtered, item) {

    const cKey = searchKey?.toLowerCase();
    const available = searchKey && (!item.attributes.title?.toLowerCase().includes(cKey) && !item.attributes.description?.toLowerCase().includes(cKey))
    const hhh = counts.length > 0 ? counts.find(x => x.category === item.id) : null

    if (!available) {
      filtered.push({
        avatar: item.attributes.avatar,
        banner: item.attributes.banner,
        title: item.attributes.title,
        description: item.attributes.description,
        id: item.id,
        count: (hhh?.count || 0)
      })
    }
    return filtered
  }, [])

  const onChangeSearchKey = e => setSearchKey(e.target.value)

  return (
    <LayoutPage>
      <LayoutScreen
        title='All Collections'
        description='Create, update, and manage collections of unique NFTs to share and sell.'
      >

        <div className='search-input mt-5'>
          <input
            type="text"
            className="serchBar"
            name="search"
            placeholder="Search"
            value={searchKey}
            onChange={onChangeSearchKey}
          />
        </div>

        <div className="w-full d-center mt-30">
          <div className="btn-main" onClick={() => router.push('/uploadcollection', undefined, { shallow: true })}>Upload Collection</div>
        </div>

        <div
          className='flex flex-wrap center '
          style={{ alignItems: 'center', justifyContent: 'center', minHeight: 333 }}
        >
          {customData?.map((item, index) => {
            return (
              <div key={index} className="mt-50">
                <CustomLazyCollection
                  index={index + 1}
                  avatar={item.avatar || DEMO_AVATAR}
                  banner={item.banner || DEMO_BACKGROUND}
                  username={item.title}
                  description={item.description}
                  collectionId={item.id}
                  count={item.count}
                />
              </div>
            )
          })}
        </div>

        <div className="spacer-single" />

        {modalDelIndex !== -1 && <ModalDeleteCollection
          onClose={() => setModalDelIndex(-1)}
          collectionId={modalDelIndex}
          onSuccess={() => setTrigger(trigger + 1)}
        />}

      </LayoutScreen>
    </LayoutPage>
  )
};

export default memo(AllMarketplace);