import { useRouter } from 'next/router';
import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalAddCommunity from '../modals/modalAddCommunity';

const CustomThumbnailVideo = ({ videoId, owner, checkable, onChange, thumbnail, contentLink, editable }) => {

  let router = useRouter();
  const [isModalCommunity, setIsModalCommunity] = useState();
  const { users } = useSelector(state => state.users);
  const accountOwner = users?.find(z => (z.account) === owner);

  return (
    <div
      className='m-2 d-center relative'
      style={{
        border: `2px solid ${contentLink === videoId ? 'red' : '#777'}`,
        borderRadius: 8,
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

      <div
        className="d-center cursor"
        style={{ width: 36, height: 36, borderRadius: 18, background: '#333', position: 'absolute', bottom: 10, right: 45 }}
        onClick={() => router.push(`/videos/${videoId}`, undefined, { shallow: true })}
      >
        <span aria-hidden="true" className="arrow_triangle-right f-24 color-b" />
      </div>

      {editable && <div
        className="d-center cursor"
        style={{ width: 36, height: 36, borderRadius: 18, background: '#333', position: 'absolute', bottom: 10, right: 5 }}
        onClick={() => setIsModalCommunity(true)}
      >
        <span aria-hidden="true" className="icon_menu f-24 color-b" />
      </div>}

      {isModalCommunity &&
        <ModalAddCommunity
          onClose={() => setIsModalCommunity(false)}
          videoId={videoId}
        />}

    </div>
  )
}

export default memo(CustomThumbnailVideo);