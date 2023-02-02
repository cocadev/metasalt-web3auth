import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  .col-card {
    width: 440px;
    height: 260px;
  }
  .nft_wrap {
    width: 418px;
    height: 140px;
    background-repeat: no-repeat, repeat;
    background-size: 100% 100%;
    background-position: center;
  }
  .nft_coll{
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px; 
    }
  }
  @media only screen and (max-width: 850px) {
    .col-card {
      width: 362px;
      height: 260px;
    }
    .nft_wrap {
      width: 340px;
      height: 140px;
    }
  }

`;
const CustomLazyCollection = ({ index, avatar, banner, username, description, collectionId, count }) => {
  let router = useRouter();

  return (
    <div
      className="col-card"
      index={index}
      style={{ 
        position: 'relative', 
        cursor: 'hover' 
      }}
    >
      <GlobalStyles />

      <div className="nft_coll" style={{ position: 'relative' }} >
        <div 
          className="nft_wrap cursor" 
          style={{ backgroundImage: `url(${banner})`, backgroundSize: 'cover' }} 
          onClick={() => router.push(`/allMarketplace/${collectionId}`, undefined, { shallow: true })}
        >
        </div>
        <div className="nft_coll_pp">
          <img className="lazy" src={avatar} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }} />
        </div>
        <div className="nft_coll_info" style={{ margin: '0 12px' }}>
          <div className='color-yellow'>items: {count}</div>
          <div><h4 className="color-b mt-2">{username}</h4></div>
          <div style={{ height: 42, fontSize: 14, overflow: 'hidden', marginTop: 5 }}>{description}</div>
        </div>
      </div>

    </div>
  )
}

export default memo(CustomLazyCollection);