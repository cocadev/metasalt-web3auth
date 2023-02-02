import React, { useState, useEffect } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../../keys';
import { ConcertLottie, DaoLottie, DiscordLottie, ShopifyLottie, YoutubeLottie, ZoomLottie } from '../../components/loading';
import { useRouter } from 'next/router';

const SubCard = () => {

  const router = useRouter();
  const params = router.query;
  const { account } = useMoralis();
  const [isCollection, setIsCollection] = useState(null); // collectionId
  const [trigger, setTrigger] = useState(1);

  const { data: collections } = useMoralisQuery("Brands", query => query.equalTo("objectId", isCollection).limit(1), [trigger]);

  const myaddress = collections[0]?.attributes?.description;
  const username = collections[0]?.attributes?.title;
  const avatar = collections[0]?.attributes?.avatar;
  const banner = collections[0]?.attributes?.banner || DEMO_BACKGROUND;

  useEffect(() => {
    if (params?.collectionId) {
      setIsCollection(params?.collectionId);
    }
  }, [params, account])

  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1);
    }, 1000)
  }, [])

  return (
    <div>

      <div>
        <section
          className='jumbotron breadcumb no-bg'
          style={banner ? { backgroundImage: `url(${banner})`, backgroundPosition: 'center' } : { background: '#e5e8eb' }}
        >
          <div className='mainbreadcumb' />
        </section>

      </div>

      <section>

        <div className='d-center'>
          <div className='profile-avatar'>
            <img src={avatar || DEMO_AVATAR} alt='avatar' /><br />
          </div>
          <h2 className='color-b'>{username}</h2>
          <div style={{ marginTop: -7, maxWidth: 500 }} className='text-center'>{myaddress}</div>
        </div>

        <div className='mt-50 d-center'>

          <h3 className='color-7 mt-50'>The Gated Cards</h3>

          <div className='d-row '>
            <div className='flex flex-wrap' style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              {
                CARDS.map((item, index) => <div style={styles.card} key={index}>
                  <div className='d-center' style={{height: 120}}>
                    {item.img}
                  </div>
                  <div className='flex-1 f-1'></div>
                  <div className='mt-3'>{item.name}</div>
                </div>)
              }
            </div>
          </div>
        </div>

      </section>
    </div>
  )
};

export default SubCard;

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#222',
    width: 242,
    height: 320,
    border: '1px solid #111',
    borderRadius: 8,
    margin: '12px 8px',
    padding: 26,
    color: '#ccc',
    textAlign: 'center'
  }
}

const CARDS = [
  { id: 1, name: 'Online meeting like Zoom or Skype', description: '', img: <ZoomLottie /> },
  { id: 2, name: 'Content on 3rd party, e.g., youtube', description: '', img: <YoutubeLottie /> },
  { id: 3, name: 'Website - Gucci, Shopify', description: '', img: <ShopifyLottie /> },
  { id: 4, name: 'Groups - Slack, Discord', description: '', img: <DiscordLottie /> },
  { id: 5, name: 'In-Person even, party, concert', description: '', img: <ConcertLottie /> },
  { id: 6, name: 'Invitation to DAO', description: '', img: <DaoLottie /> },
]