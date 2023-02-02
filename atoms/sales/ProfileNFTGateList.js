import React, { memo } from 'react';
import { SmallLoading } from '../../components/loading';
import { ConcertLottie, DaoLottie, DiscordLottie, ShopifyLottie, YoutubeLottie, ZoomLottie } from '../../components/loading';

const ProfileNFTGateList = ({ isLoading,  }) => {

  return (
    <div className='flex flex-wrap' style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
      {isLoading && <SmallLoading />}
      {
        CARDS.map((item, index) => <div style={styles.card} key={index}>
          <div className='d-center' style={{ height: 120 }}>
            {item.img}
          </div>
          <div className='flex-1 f-1'></div>
          <div className='mt-3'>{item.name}</div>
        </div>)
      }
    </div>
  );
}

export default memo(ProfileNFTGateList);

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