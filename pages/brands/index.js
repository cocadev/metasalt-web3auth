import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const CustomSlide = dynamic(() => import('../../components/custom/CustomSlide'));
const ModalDeleteCollection = dynamic(() => import('../../components/modals/modalDeleteCollection'));

const MyBrands = () => {

  const router = useRouter()
  const [trigger, setTrigger] = useState(1)
  const [modalDelIndex, setModalDelIndex] = useState(-1)
  const { account } = useMoralis()
  const { data } = useMoralisQuery('RealBrands', query => query.equalTo('creatorId', account), [trigger])


  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1)
    }, 1000)
  }, [account])

  const onDelCollection = (e) => {
    setModalDelIndex(e);
  }

  return (
    <LayoutPage>
      <LayoutScreen
        title='My Brands'
        description='Create, curate, and manage brands or projects of unique NFTs to share and sell.'
      >

        <div className='container'>
          <div className='row m-10-hor'>
            <div className='col-12 text-center'>

              <div className='flex mt-30' style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div className="btn-main" onClick={() => router.push('/create/brand', undefined, { shallow: true })}>Create a Brand or Project</div>
              </div>

            </div>
          </div>
        </div>

        <div className='flex flex-wrap center mt-30' style={{ alignItems: 'center', justifyContent: 'center', minHeight: 335 }}>
          {data?.map((item, index) => (
            <div key={index} className="mt-10">
              <CustomSlide
                index={index + 1}
                avatar={item.attributes.avatar || DEMO_AVATAR}
                banner={item.attributes.banner || DEMO_BACKGROUND}
                username={item.attributes.title}
                uniqueId={item.attributes.description}
                collectionId={item.id}
                // deletable={true}
                onDeleteCollection={() => onDelCollection(item.id)}
                brand={true}
              />
            </div>
          ))}
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

export default memo(MyBrands);