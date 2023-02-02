import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';
import UtilService from '../../sip/utilService';
const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));
const CollectionCard = dynamic(() => import('../../components/cards/CollectionCard'));

const Absolute = styled.div`
  margin-left: 30px;
  position: absolute;
  margin-top: -100px;
`
const IMG = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  border: 5px solid #fff;
`
const BrandDetail = () => {

  const router = useRouter();
  const { account } = useMoralis();
  const brandId = router.query.brandId;
  const { data: brands } = useMoralisQuery('RealBrands', query => query.equalTo('objectId', brandId).limit(1), [brandId], { autoFetch: true });
  const { data: collections } = useMoralisQuery('Brands', query => query.equalTo('brand', brandId).limit(1), [brandId], { autoFetch: true });
  const { banner, title, description, avatar, creatorId } = (brands && brands[0]?.attributes) || '';
  const id = brands && brands[0]?.id;

  return (
    <LayoutPage>

      <section
        className='jumbotron breadcumb no-bg'
        style={{ background: `url(${UtilService.ConvetImg(banner) || DEMO_BACKGROUND})` || '#141414', backgroundSize: 'cover' }}
      >
        <div className='mainbreadcumb' />

        <Absolute>
          <IMG src={UtilService.ConvetImg(avatar) || DEMO_AVATAR} alt='avatar' />

          <div>
            <h2 className='color-b mt-3'>{title}</h2>
            <div className='color-b' style={{ marginTop: -8 }}>{description}</div>
            {account === creatorId && <div className='btn btn-primary mt-3' onClick={() => router.push(`/edit/brand/${id}`, undefined, { shallow: true })}>Edit</div>}
          </div>
        </Absolute>

      </section>

      <section>

        <h3 className='text-center mt-90 color-b'>Trending collections in {title}</h3>

        <div className='flex flex-wrap center mt-10' style={{ alignItems: 'center', justifyContent: 'center', minHeight: 335 }}>

          {
            collections
              .map((item, index) => (
                <CollectionCard
                  key={index}
                  index={index + 1}
                  avatar={UtilService.ConvetImg(item.attributes.avatar) || DEMO_AVATAR}
                  banner={UtilService.ConvetImg(item.attributes.banner) || DEMO_BACKGROUND}
                  username={item.attributes.title}
                  description={item.attributes.description}
                  collectionId={item.id}
                />
              ))}
        </div>
      </section>
    </LayoutPage>
  )
};

export default BrandDetail;