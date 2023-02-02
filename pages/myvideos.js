import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { useWeb3Auth } from '../services/web3auth';
import { getAllLikesByUserId, getVideosByOwner } from '../common/api';

const CustomDisplayVideo = dynamic(() => import('../components/custom/CustomDisplayVideo'));

const MyVideos = () => {

  const { user, isAuthenticated } = useWeb3Auth()
  const [videoData, setVideoDate] = useState([])
  const [allLikesData, setAllLikesData] = useState([])

  useEffect(() => {
    const loadVideoData = async () => {
      const response1 = await getVideosByOwner({ owner: user?._id })
      response1 && setVideoDate(response1)
      const response2 = await getAllLikesByUserId({ userId: user?._id })
      response2 && setAllLikesData(response2.map(item => item?.itemId))
    }

    if (user?._id) {
      loadVideoData().then()
    }
  }, [user])

  return (
    <LayoutPage>
      <LayoutScreen title='My Videos' description='Upload the video for community content'>
        <div className="d-center">
          {videoData?.length === 0 &&
            <div className="alert alert-danger text-center" style={{ marginTop: 20, width: 300 }}>
              Upload your first video
            </div>
          }
        </div>

        <div className="spacer-single" />

        <div className="container d-flex flex-row flex-wrap d-center">
          {isAuthenticated && videoData.map((item, index) =>
            <CustomDisplayVideo
              key={index}
              item={item}
              onTrigger={() => {}}
              isLike={allLikesData.includes(item.id)}
            />
          )}
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default MyVideos;
