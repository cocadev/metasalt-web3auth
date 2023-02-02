import { useRouter } from 'next/router';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';

const CustomThumbnailSmallVideo = ({ videoId, owner, checkable, onChange, thumbnail, contentLink, editable }) => {

  const router = useRouter();
  const { users } = useSelector(state => state.users)
  const accountOwner = users?.find(z => (z.account) === owner);

  return (
    <div
      className='m-2 d-center cursor relative'
      onClick={() => checkable ? onChange(videoId) : router.push(`/videos/${videoId}`, undefined, { shallow: true })}
      style={{
        border: `3px solid ${contentLink === videoId ? '#0075ff' : '#777'}`,
        borderRadius: 5,
        height: checkable ? 65 : 220,
        width: checkable ? 110 : 380,
        background: '#333',
        overflow: 'hidden'
      }}
    >
      {owner && <div style={{ position: 'absolute', right: 4, bottom: 4 }}>
        <img src={accountOwner?.avatar} alt="user" style={{ width: 50, height: 50, borderRadius: 25, border: '2px solid #bbb' }} />
      </div>}

      <img src={thumbnail} style={{ width: checkable ? 105 : 370, height: checkable ? 60 : 250 }} alt='thumbnail' />

      {editable && <div className="d-center" style={{ width: 36, height: 36, borderRadius: 18, background: '#333', position: 'absolute', right: 10, top: 5 }}>
        <span aria-hidden="true" className="icon_menu" />
      </div>}

    </div>
  )
}

export default memo(CustomThumbnailSmallVideo);