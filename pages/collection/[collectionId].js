import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { useMoralisQuery } from 'react-moralis';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';
const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));
const CollectionCard = dynamic(() => import('../../components/cards/CollectionCard'));

const Collection = () => {

  const router = useRouter();
  const art = router.query.collectionId;
  const { data: collections } = useMoralisQuery('Brands', query => query.equalTo('category', art), [art], { autoFetch: true });
  const artCol = CATEGORIES_COLLECTIONS.find((item) => item.value === art)
  const { banner, title, description, category } = artCol || '';

  return (
    <LayoutPage>

      <section
        className='jumbotron breadcumb no-bg '
        style={banner ? { backgroundImage: `url(${banner})`, backgroundPosition: 'center' } : { background: '#e5e8eb' }}
      >
        <div className='mainbreadcumb' />
      </section>

      <section>

        <div className='d-center'>
          <h1 className='color-b'>{title}</h1>
          <div className='text-center color-7' style={{ maxWidth: 700 }}>{description}</div>
        </div>

        <h3 className='text-center mt-90 color-b'>Trending collections in {category}</h3>

        <div className='flex flex-wrap center mt-10' style={{ alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>

          {
            collections
              .map((item, index) => (
                <CollectionCard
                  key={index}
                  index={index + 1}
                  avatar={item.attributes.avatar || DEMO_AVATAR}
                  banner={item.attributes.banner || DEMO_BACKGROUND}
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

export default Collection;