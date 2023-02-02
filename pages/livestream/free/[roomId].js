import Image from 'next/image';
import React, { useEffect } from 'react';
import { useHMSStore, selectIsConnectedToRoom, useHMSActions } from '@100mslive/react-sdk';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import FreeRoom from '../../../components/livestream/FreeRoom';
import LayoutGated from '../../../components/layouts/layoutGated';
import { BlackLoading } from '../../../components/loading';
import { generateAppToken } from '../../../common/api';
import { DEMO_AVATAR } from '../../../keys';


const FreeRoomDetailPage = () => {

  const { user } = useMoralis()

  const { data } = useMoralisQuery('LiveStream', query => query.equalTo('roomId', '63982a5db3a13375ba6ee511').limit(1), ['63982a5db3a13375ba6ee511'], { autoFetch: true });
  const { name, addedNFT, userId } = data[0]?.attributes || '';

  const hmsActions = useHMSActions()
  const isConnected = useHMSStore(selectIsConnectedToRoom)


  useEffect(() => {
    const loadSession = async () => {
      const authToken = await generateAppToken('63982a5db3a13375ba6ee511', user?.attributes?.username, 'hls-viewer')
      await hmsActions.join({
        userName: user?.attributes?.username,
        authToken: authToken,
      })
    }

    loadSession().then()
  }, [])

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
          <FreeRoom />
          <div className='w-100 m-0 d-flex flex-row' style={{ padding: 10 }}>
            <Image src={DEMO_AVATAR} alt='' layout='fixed' width={60} height={60} className='br-50 p-0' />
            <div className='ms-2 p-0 pt-1 d-flex flex-column room-detail-content'>
              <h5 className='w-100 m-0 mt-1 p-0 text-ellipsis'>Admin</h5>
              <p className='m-0 mt-1 p-0 f-12'>Admin</p>
            </div>
          </div>
        </>
        }
      </div>
    </>
  )
}

export default FreeRoomDetailPage;
