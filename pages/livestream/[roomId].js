import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useHMSStore, selectIsConnectedToRoom, useHMSActions } from '@100mslive/react-sdk';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import Room from '../../components/livestream/Room';
import LayoutGated from '../../components/layouts/layoutGated';
import { BlackLoading } from '../../components/loading';
import { getActiveRoom, generateAppToken } from '../../common/api';
import { DEMO_AVATAR } from '../../keys';
import UtilService from '../../sip/utilService';


const RoomDetailPage = () => {

  const router = useRouter()
  // const { managementToken } = useContext(AppContext)
  const managementToken = '';
  const [allRooms, setAllRooms] = useState([])

  const { Moralis, user } = useMoralis()
  
  const roomId = router.query.roomId;
  const { data } = useMoralisQuery('LiveStream', query => query.equalTo('roomId', roomId).limit(1), [roomId], { autoFetch: true });
  const { name, addedNFT, userId } = data[0]?.attributes || '';

  const hmsActions = useHMSActions()
  const isConnected = useHMSStore(selectIsConnectedToRoom)


  const getLiveStreamRoom = () => {
    const filtered = allRooms.filter(item => item.roomId === roomId)
    return filtered[0]
  }
  
  useEffect(() => {
    const loadSession = async () => {
      const allRooms = await Moralis.Cloud.run('getAllLiveStreamRooms')
      setAllRooms(allRooms)
      const activeRoom = await getActiveRoom(managementToken, roomId)
      if (activeRoom) {
        const authToken = await generateAppToken(roomId, user?.attributes?.username, 'hls-viewer')
        await hmsActions.join({
          userName: user?.attributes?.username,
          authToken: authToken,
        })
      } else {
        const authToken = await generateAppToken(roomId, user?.attributes?.username, 'broadcaster')
        await hmsActions.join({
          userName: user?.attributes?.username,
          authToken: authToken,
        })
      }
    }

    if (roomId && managementToken !== '') {
      loadSession()
    }
  }, [roomId, managementToken])

  useEffect(() => {

    return () => {
      hmsActions.leave()
    }
  }, [])

  return (
    <>
      {userId !== user?.id && <LayoutGated data={addedNFT} title={name} />}
      <div className='livestream-container'>
        {!isConnected && <BlackLoading />}
        {isConnected &&
        <>
          <Room />
          <div className='w-100 m-0 d-flex flex-row' style={{ padding: 10 }}>
            <Image src={UtilService.ConvetImg(getLiveStreamRoom()?.userAvatar) || DEMO_AVATAR} alt='' layout='fixed' width={60} height={60} className='br-50 p-0' />
            <div className='ms-2 p-0 pt-1 d-flex flex-column room-detail-content'>
              <h5 className='w-100 m-0 mt-1 p-0 text-ellipsis'>{getLiveStreamRoom()?.name}</h5>
              <p className='m-0 mt-1 p-0 f-12'>{getLiveStreamRoom()?.description}</p>
            </div>
          </div>
        </>
        }
      </div>
    </>
  )
}

export default RoomDetailPage;
