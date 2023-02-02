import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { useWeb3Auth } from '../services/web3auth';
import { getCollectionsByCreator } from '../common/api';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../keys';

const ModalDeleteCollection = dynamic(() => import('../components/modals/modalDeleteCollection'));
const CustomSlide = dynamic(() => import('../components/custom/CustomSlide'));


const Collections = () => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [trigger, setTrigger] = useState(1);
  const [modalDelIndex, setModalDelIndex] = useState(-1);
  const [data, setData] = useState([])

  useEffect(() => {
    const loadCollectionsByCreator = async () => {
      const response = await getCollectionsByCreator({ creatorId: user?.account })
      response && setData(response)
    }

    if (user?.account) {
      loadCollectionsByCreator().then()
    }
  }, [user?.account])

  const onDelCollection = (e) => {
    setModalDelIndex(e);
  }

  return (
    <LayoutPage>
      <LayoutScreen
        title='My Collections'
        description='Create, curate, and manage collections of unique NFTs to share and sell.'
      >
        <div className='container'>
          <div className='row m-10-hor'>
            <div className='col-12 text-center'>
              <div className='flex align-items-center justify-content-center mt-30'>
                <div className="btn-main" onClick={() => router.push('/create/collection', undefined, { shallow: true })}>Create a collection</div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap align-items-center justify-content-center center mt-30' style={{ minHeight: 333 }}>
          {data?.map((item, index) => (
            <div key={index} className="mt-10">
              <CustomSlide
                index={index + 1}
                avatar={item.attributes.avatar || DEMO_AVATAR}
                banner={item.attributes.banner || DEMO_BACKGROUND}
                username={item.attributes.title}
                uniqueId={item.attributes.description}
                collectionId={item.id}
                deletable={true}
                onDeleteCollection={() => onDelCollection(item.id)}
                gated
              />
            </div>
          ))}
        </div>

        <div className="spacer-single" />

        {modalDelIndex !== -1 &&
          <ModalDeleteCollection
            onClose={() => setModalDelIndex(-1)}
            collectionId={modalDelIndex}
            onSuccess={() => setTrigger(trigger + 1)}
          />
        }
      </LayoutScreen>
    </LayoutPage>
  )
};

export default Collections;
