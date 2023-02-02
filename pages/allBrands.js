import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import UtilService from '../sip/utilService';
import { getAllBrands } from '../common/api';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../keys';

const ModalDeleteCollection = dynamic(() => import('../components/modals/modalDeleteCollection'));
const CustomSlide = dynamic(() => import('../components/custom/CustomSlide'));

const MyBrands = ({ allBrands }) => {

  const [searchKey, setSearchKey] = useState()
  const [modalDelIndex, setModalDelIndex] = useState(-1)

  const onChangeSearchKey = e => setSearchKey(e.target.value)

  return (
    <LayoutPage>
      <LayoutScreen
        title='All Brands'
        description='Create, curate, and manage brands or projects of unique NFTs to share and sell.'
      >

        <div className='search-input'>
          <input
            type="text"
            className="serchBar"
            name="search"
            placeholder="Search"
            value={searchKey}
            onChange={onChangeSearchKey}
          />
        </div>

        <div className='flex flex-wrap align-items-center justify-content-center mt-30' style={{ minHeight: 335 }}>
          {allBrands?.map((item, index) => {
            const cKey = searchKey?.toLowerCase();
            if (searchKey && (!item.title?.toLowerCase().includes(cKey) && !item.description?.toLowerCase().includes(cKey))) return false;
            return (
              <div key={index} className="mt-10">
                <CustomSlide
                  index={index + 1}
                  avatar={UtilService.ConvetImg(item.avatar) || DEMO_AVATAR}
                  banner={UtilService.ConvetImg(item.banner) || DEMO_BACKGROUND}
                  username={item.title}
                  uniqueId={item.description}
                  collectionId={item.id}
                  brand={true}
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
  
  const response = await getAllBrands()
  
  return {
    props: {
      allBrands: response || []
    }
  }
}

export default MyBrands;
