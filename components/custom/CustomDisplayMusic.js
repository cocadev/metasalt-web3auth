import React, { memo } from 'react';
import styled from 'styled-components';
import UtilService from '../../sip/utilService';

const Box = styled.div`
  position: relative;
  width: 290px;
  border-radius: 12px;
  box-shadow: 2px 2px 20px 0px rgba(131, 100, 226, 0);
  display: flex;
  justify-content: center;
  background: #222;
  margin: 5px;
  flex-direction: column;
  @media only screen and (max-width: 600px){
    width: 190px;
    margin-top: 20px;
  }
`

const Cateogry = styled.div`
  color: #bbb;
  margin-right: 3px;
  font-size: 12px;
  position: absolute;
  right: -6px;
  top: -6px;
  background: #eb0400;
  border-radius: 5px;
  padding: 0px 5px;
  color: #fff;
`

const Like = styled.div`
  cursor: pointer;
  position: absolute;
  right: 8px;
  bottom: 6px;
`

const IMG = styled.div`
  width: 290px;
  height: 170px;
  border-top-right-radius: 12px; 
  border-top-left-radius: 12px;
  background-size: cover;
  background-position: center;
  @media only screen and (max-width: 600px){
    width: 190px;
    height: 90px;
  }
`

const CustomDisplayMusic = ({ item, onGoClick }) => {

  const { title, description, category, thumbnail } = item.attributes;

  return (
    <Box>
      <IMG 
        onClick={onGoClick} 
        className='cursor' 
        style={{ backgroundImage: `url(${UtilService.ConvetImg(thumbnail) || '/img/music.jpg'})` }} 
      />

      <div className="align-center f-1" >
        <img src={'https://static.twitchcdn.net/assets/music-5fb4595a30d04d991e24.svg'} alt='icon' className="mobile-hidden" style={{ width: 70, padding: 5, margin: '0 7px' }} />
        <div className='flex flex-col p-2' >
          <div className='color-yellow' style={{ maxHeight: 24, overflow: 'hidden' }}>{title}</div>
          <div className='color-b' style={{ maxHeight: 22, overflow: 'hidden', fontSize: 12 }}>{description}</div>
        </div>

        {/* <Like
          style={{ color: isLike ? '#ff343f' : 'grey' }}
          onClick={() => musicId ? onLikeMusic(musicId) : {}}
        >
          <span className={isLike ? 'icon_heart cursor' : 'icon_heart_alt cursor'}></span>
          <span className="f-12">&nbsp;{likes.length || 0}</span>
        </Like> */}

        <Cateogry>
          {category}
          {/* {UtilService.GetTimeLabel(item.attributes.duration)} */}
        </Cateogry>
      </div>

    </Box>
  )
}

export default memo(CustomDisplayMusic);