import { useRouter } from 'next/router';
import React, { memo } from 'react';
import styled from 'styled-components';
import ReactTimeAgo from 'react-time-ago';
import { useSelector } from 'react-redux';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';
import { IcPencil } from '../../common/icons';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';

const Duration = styled.div`
  background: #22314e;
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 14px;
  color: #fff;
  position: absolute;
  bottom: 86px;
  right: 4px;
`

const Like = styled.div`
  cursor: pointer;
  position: absolute;
  right: 8px;
  bottom: 6px;
`

const Background = styled.div`
  width: 370px;
  height: 220px;

  @media only screen and (max-width: 600px) {
    width: 190px;
    height: 110px;
  }
`

const IMG = styled.img`
  width: 370px;
  height: 220px;
  border: 1px solid #bbb;
  opacity: 0.7;

  @media only screen and (max-width: 600px) {
    width: 190px;
    height: 110px;
  }
`

const CustomDisplayVideo = ({ item, hidden, visibleOnly }) => {

  const { videoId, thumbnail, duration, title, category, createdAt, owner } = item
  const vId = item._id

  const router = useRouter()
  const { user } = useWeb3Auth()

  const { users } = useSelector(state => state.users)
  const iconObject = CATEGORIES_COLLECTIONS.find(item => item.value === category)

  function getAvatarFromAddress(tAdd) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.id) === tAdd);
      return tt?.avatar;
    }
  }

  return (
    <div className='m-2 position-relative'>
      <Background>
        <IMG src={UtilService.ConvetImg(thumbnail)} alt='thumbnail' />
      </Background>

      <picture>
        <img
          src="/img/icons/play.png"
          className="cursor position-absolute mobile-hidden"
          style={{ width: 60, top: 80, left: 160 }}
          onClick={() => router.push(`/videos/${videoId}`, undefined, { shallow: true })}
          alt="video"
        />
      </picture>

      {owner === user?._id && !hidden && !visibleOnly &&
        <picture>
          <img
            className="cursor position-absolute"
            src={IcPencil.src}
            style={{ width: 22, height: 22, top: 2, right: 2 }}
            onClick={() => router.push(`/edit/video/${vId}`)}
            alt="video"
          />
        </picture>
      }

      {!visibleOnly && <Duration>{UtilService.GetTimeLabel(duration)}</Duration>}

      {!visibleOnly &&
        <div className='d-row p-2 mobile-hidden'>
          <div className="d-center mr-2 cursor"
               onClick={() => router.push(`/sales/${owner}`, undefined, { shallow: true })}>
            <picture>
              <img src={UtilService.ConvetImg(getAvatarFromAddress(owner)) || DEMO_AVATAR} alt="avatar"
                   style={{ width: 50, height: 50, borderRadius: 25, border: '1px solid #777' }}/>
            </picture>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: '600', fontSize: 20 }}>
              {title || 'No title'}
            </div>
            <div className="f-12 color-yellow">{iconObject?.label}</div>
            <div className="f-12 color-7">
              <ReactTimeAgo date={new Date(createdAt)} locale="en-US"/>
            </div>
          </div>

          {/* <Like
            style={{ color: isLike ? '#ff343f' : 'grey' }}
            onClick={() => vId ? onLikeVideo(vId) : {}}
          >
            <span className={isLike ? 'icon_heart cursor' : 'icon_heart_alt cursor'} />
            <span className="f-12">&nbsp;{likes.length || 0}</span>
          </Like> */}
        </div>
      }
    </div>
  )
}

export default memo(CustomDisplayVideo);
