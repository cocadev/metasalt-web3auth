import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { getAllCollections } from '../common/api';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../keys';

const ModalDeleteCollection = dynamic(() => import('../components/modals/modalDeleteCollection'));
const CustomSlide = dynamic(() => import('../components/custom/CustomSlide'));


const AllCollections = ({ allCollections }) => {

  const [searchKey, setSearchKey] = useState()
  const [modalDelIndex, setModalDelIndex] = useState(-1)

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

        <div className='flex flex-wrap align-items-center justify-content-center mt-30' style={{ minHeight: 333 }}>
          {allCollections?.map((item, index) => {
            const cKey = searchKey?.toLowerCase();
            if (searchKey && (!item.title?.toLowerCase().includes(cKey) && !item.description?.toLowerCase().includes(cKey))) return false;
            return (
              <div key={index} className="mt-10">
                <CustomSlide
                  index={index + 1}
                  avatar={item.avatar || DEMO_AVATAR}
                  banner={item.banner || DEMO_BACKGROUND}
                  username={item.title}
                  uniqueId={item.description}
                  collectionId={item.id}
                />
              </div>
            )
          })}
        </div>

        <div className="spacer-single" />

        {modalDelIndex !== -1 &&
          <ModalDeleteCollection
            collectionId={modalDelIndex}
            onSuccess={() => {}}
            onClose={() => setModalDelIndex(-1)}
          />
        }

      </LayoutScreen>
    </LayoutPage>
  )
};

export const getServerSideProps = async () => {

  const response = await getAllCollections()

  return {
    props: {
      allCollections: response || []
    }
  }
}

export default AllCollections;
