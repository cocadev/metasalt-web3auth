import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import { getActiveSessions, getAllLiveStreams, getUserLiveStreams } from '../../common/api';
import { LiveStreamImages, LiveStreamTypes, YoutubeLiveIds } from '../../common/constant';
import { GetRandomInt } from '../../common/function';
import { IcPencil } from '../../common/icons';
import { DEMO_AVATAR } from '../../keys';
import UtilService from '../../sip/utilService';
const LiveStreamCarousel = dynamic(() => import('../../components/livestream/Carousal'), { ssr: false });

const LiveStreamPage = () => {

  const router = useRouter()
  // const { userId, managementToken } = useContext(AppContext)
  const userId = null;
  const managementToken = null;
  const [allRooms, setAllRooms] = useState([])
  const [myRooms, setMyRooms] = useState([])
  const [activeSessions, setActiveSessions] = useState([])
  const [selectedType, setSelectedType] = useState('')

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then();
  }

  const getSessionRoom = (roomId) => {
    const filtered = allRooms.filter(item => item.roomId === roomId)
    return filtered[0]
  }

  const onRoomClicked = (item) => {
    handleRouters(`/livestream/${item.roomId}`)
  }

  const onEditClicked = (item) => {
    handleRouters(`/livestream/edit/${item.roomId}`)
  }

  const onTypeSelected = (item) => {
    setSelectedType(item.value)
  }

  const filterRooms = () => {
    if (selectedType === '') {
      return myRooms
    } else {
      return myRooms.filter(item => item.type === selectedType)
    }
  }

  const loadSessions = async () => {
    const activeSessions = await getActiveSessions(managementToken)
    if (activeSessions) {
      setActiveSessions(activeSessions);
    }
  }

  const getMyRooms = async () => {
    const response1 = await getAllLiveStreams()
    setAllRooms(response1.data)
    const response2 = await getUserLiveStreams({ userId })
    setMyRooms(response2.data)
  }

  useEffect(() => {
    if (managementToken?.length > 0) {
      loadSessions().then()
    }
  }, [managementToken])

  useEffect(() => {
    getMyRooms().then()
  }, [])

  return (
    <LayoutPage>
      <div className='livestream-carousel'>
        <LiveStreamCarousel />
      </div>
      <div className='p-3'>
        <div className='p-3'>
          <h2>{(activeSessions.length + YoutubeLiveIds.length) > 0 ? 'Active sessions' : 'No active sessions'}</h2>
        </div>
        <div className='row m-0 ps-3 pe-3'>

          {activeSessions.map((item, index) => (
            <div key={index} className='col-lg-3 col-md-4 col-sm-6 p-1'>
              <div className='bg-1 p-2 card liveStream-room-card' onClick={() => handleRouters(`/livestream/${item.room_id}`)}>
                <picture>
                  <img src={getSessionRoom(item.room_id)?.image || LiveStreamImages[GetRandomInt(6)]} alt='' className='room-card-image' />
                </picture>
                <div className='w-100 m-0 mt-2 d-flex flex-row'>
                  <Image src={UtilService.ConvetImg(getSessionRoom(item.room_id)?.userAvatar) || DEMO_AVATAR} alt='' width={40} height={40} className='br-50 p-0' />
                  <div className='ms-2 p-0 pt-1 d-flex flex-column room-card-content'>
                    <h6 className='w-100 m-0 p-0 text-ellipsis'>{getSessionRoom(item.room_id)?.name}</h6>
                    <p className='m-0 p-0 f-12'>{getSessionRoom(item.room_id)?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {YoutubeLiveIds.map((item, index) => (
            <div key={index} className='col-lg-3 col-md-4 col-sm-6 p-1'>
              <div className='bg-1 p-2 card liveStream-room-card' onClick={() => handleRouters(`/livestream/free/${item.videoId}`)}>
                <picture>
                  <img src={item.image} alt='' className='room-card-image' />
                </picture>
                <div className='w-100 m-0 mt-2 d-flex flex-row'>
                  <Image src={DEMO_AVATAR} alt='' width={40} height={40} className='br-50 p-0' />
                  <div className='ms-2 p-0 pt-1 d-flex flex-column room-card-content'>
                    <h6 className='w-100 m-0 p-0 text-ellipsis'>Admin</h6>
                    <p className='m-0 p-0 f-12'>Admin</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        <div className='p-3'>
          <h2>Rooms</h2>
        </div>

        <div className='ps-3 pe-3 pb-3 livestream-types-container'>
          {LiveStreamTypes.map((item, index) => (
            <div key={index} className='btn livestream-type-card' onClick={() => onTypeSelected(item)}>
              {item.label}
            </div>
          ))}
        </div>

        <div className='row m-0 ps-3 pe-3'>
          {filterRooms().map((item, index) => (
            <div key={index} className='col-lg-3 col-md-4 col-sm-6 p-1'>
              <div className='bg-1 p-2 card liveStream-room-card'>
                <picture>
                  <img
                    className="cursor"
                    src={IcPencil.src}
                    style={{ width: 22, height: 22, position: 'absolute', top: 2, right: 2 }}
                    onClick={() => onEditClicked(item)}
                    alt=""
                  />
                </picture>
                <picture onClick={() => onRoomClicked(item)}>
                  <img src={item.image || LiveStreamImages[GetRandomInt(6)]} alt='' className='room-card-image' />
                </picture>
                <div className='w-100 m-0 mt-2 d-flex flex-row' onClick={() => onRoomClicked(item)}>
                  <Image src={UtilService.ConvetImg(item.userAvatar) || DEMO_AVATAR} alt='' width={40} height={40} className='br-50 p-0' />
                  <div className='ms-2 p-0 pt-1 room-card-content'>
                    <h6 className='w-100 m-0 p-0 text-ellipsis'>{item.name}</h6>
                    <p className='m-0 p-0 f-12'>{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutPage>
  )
};

export default LiveStreamPage;