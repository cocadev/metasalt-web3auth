import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { memo } from 'react';
import styled from 'styled-components';
import renderHTML from 'react-render-html';
import useWindowSize from '../../hooks/useWindowSize';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';
const CustomPopover = dynamic(() => import('../custom/CustomPopover'));

const Avatar = styled.img`
  position: absolute; 
  left: 12px;
  top: 12px;
  width: 40px; 
  height: 40px; 
  border-radius: 20px; 
  margin-right: 7px;
  @media only screen and (max-width: 600px){
    width: 30px;
    height: 30px;
    left: 3px;
    top: 3px;
  }
`

const CardCommunity = ({ data, home }) => {

  const { gateImg, avatar, title, brand, collection, other, id, contents, description } = data;
  const router = useRouter();
  const { width } = useWindowSize();

  const fullWidth = width > 1200 ? (width - 420) / 5 : 300;
  const homeWidth = width > 1200 ? (width - 420) / 4 : 380;
  const atomGatedWidth = home ? homeWidth : fullWidth;
  const typeContents = contents?.map(item => item.type.label);

  return (
    <div
      style={{ width: width > 600 ? atomGatedWidth : width / 4, background: '#222', margin: 5, alignItems: 'center', boxShadow: 'rgb(0 0 0 / 10%) 0px 10px 15px -3px, rgb(0 0 0 / 10%) 0px 10px 15px -3px', borderRadius: 4 }}
    >
      <div
        className='w-full cursor'
        onClick={() => router.push(`/nftcommunities/${id}`, undefined, { shallow: true })}
        style={{ backgroundImage: `url(${UtilService.ConvetImg(gateImg)})`, height: width > 600 ? 200 : 100, width: 200, backgroundSize: 'cover', position: 'relative', backgroundPosition: 'center' }}
      >
        
        {width > 600 && <div style={{ position: 'absolute', right: 3, top: 3 }}>
          {
            typeContents.map((item, index) =>
              <div key={index} style={{ margin: 4, width: 50, height: 40, background: '#111', border: '2px solid #bbb', borderRadius: 7 }}>
                <CustomPopover content={(item === 'Discord' ? 'Discourse' : item) + ' hidden'} >
                  {UtilService.getContentLottie(item)}
                </CustomPopover>
              </div>)
          }
        </div>}

        <Avatar src={UtilService.ConvetImg(avatar) || DEMO_AVATAR} alt='' />

      </div>

      {width > 600 && <div className='color-b m-3 overflow-hidden relative'>

        <div className='text-center'>
          <div 
            className="garage-title" 
            style={{ fontSize: 18, fontWeight: '600' }}
          >
            {title}
          </div>
          <br />
          {description &&
            <div className="garage-title" style={{ fontSize: 13, color: '#777', fontWeight: '600', maxHeight: 22 }}>
              {renderHTML(description)}
            </div>
          }
        </div>

        <div className='mt-1 garage-title'>
          <span className='color-yellow'>Brand: </span>
          {brand}
        </div>
        <br />

        <div className="garage-title">
          <span className='color-green'>Collection: </span> {collection}
        </div>
        <br />

        <div className="garage-title" style={{ fontSize: 13, fontWeight: '300', color: '#777', fontStyle: 'italic' }}>
          {other}
        </div>

        {/* <Like
          style={{ color: isLike ? '#ff343f' : 'grey', marginTop: -16 }}
          onClick={() => id ? onLikeCommunity(id) : {}}
        >
          <span className={isLike ? 'icon_heart cursor' : 'icon_heart_alt cursor'} />
          <span className="f-12">&nbsp;{likes.length || 0}</span>
        </Like> */}

        {/* {!isFollow && <Follow onClick={() => id ? onFollowCommunity(id) : {}}>Follow {follows.length}</Follow>}
        {isFollow && <Follow style={{ background: '#777' }} onClick={() => id ? onFollowCommunity(id) : {}}>Followed {follows.length}</Follow>} */}

      </div>}
    </div>
  )
}

export default memo(CardCommunity);