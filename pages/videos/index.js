import dynamic from 'next/dynamic';
import React, { memo, useEffect, useState } from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import { getAllLikes, getAllVideos } from '../../common/api';

const CustomDisplayVideo = dynamic(() => import('../../components/custom/CustomDisplayVideo'));


const MyVideos = () => {
  
  const [allVideos, setAllVideos] = useState([])
  const [allLikes, setAllLikes] = useState([])

  useEffect(() => {
    const loadAllVideos = async () => {
      const response = await getAllVideos()
      console.log('loadAllVideos =====>', response)
      setAllVideos(response.data)
    }
    const loadAllLikes = async () => {
      const response = await getAllLikes()
      response && setAllLikes(response)
    }

    loadAllVideos().then()
    loadAllLikes().then()
  }, [])

  return (
    <LayoutPage>
      <LayoutScreen title='All Videos' description='Upload the video for community content'>

        <div className="spacer-single" />

        <div className=" d-flex flex-row flex-wrap d-center">
          {
            allVideos.map((item, index) =>
              <CustomDisplayVideo
                key={index}
                item={item}
                hidden
                isLike={false}
              />)
          }
        </div>

      </LayoutScreen>
    </LayoutPage>
  )
};

export default memo(MyVideos);
