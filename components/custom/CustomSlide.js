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

  .nft_coll {
    &:hover {
      box-shadow: rgba(0, 0, 0, 0.19) 0 10px 20px, rgba(0, 0, 0, 0.23) 0 6px 6px;
    }
  }

  @media only screen and (max-width: 850px) {
    .col-card {
      width: 242px;
      height: 250px;
      margin-left: -10px;
    }

    .nft_wrap {
      width: 220px;
      height: 140px;
    }
  }
`;

const CollectionCard = ({ index, avatar, banner, username, uniqueId, collectionId, deletable, onDeleteCollection, disableNavigate, brand, community, music }) => {

  const router = useRouter()

  return (
    <div className="position-relative col-card">
      <GlobalStyles />

      <div className="position-relative nft_coll">
        <div
          className="nft_wrap cursor"
          style={{ backgroundImage: `url(${banner})`, backgroundSize: 'cover' }}
          onClick={() => disableNavigate ? {} : router.push((brand ? '/brands/' : (community ? '/nftcommunities?collection=' : music ? '/music/' : '/subCollection/')) + collectionId, undefined, { shallow: true })}
        >
        </div>
        <div className="nft_coll_pp">
          <img className="lazy" src={avatar} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }} />
        </div>
        <div className="nft_coll_info" style={{ margin: '0 12px' }}>
          <div><h4 className="color-b">{username}</h4></div>
          <div style={{ height: 42, fontSize: 14, overflow: 'hidden', marginTop: 5 }}>{uniqueId}</div>
        </div>
      </div>

      {!brand &&
        <div
          onClick={() => disableNavigate ? {} : router.push(`/subCard/${collectionId}`, undefined, { shallow: true })}
          style={{ position: 'absolute', bottom: 10, left: 20, fontSize: 30 }}
          aria-hidden="true"
          className="cursor"
        />
      }

      {deletable &&
        <div className="avatar-icon" onClick={onDeleteCollection}>
          <span aria-hidden="true" className="icon_trash" />
        </div>
      }

    </div>
  )
}

export default memo(CollectionCard);
