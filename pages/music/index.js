import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import { getAllMusicChannels } from '../../common/api';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const CustomSlide = dynamic(() => import('../../components/custom/CustomSlide'));

const MusicHome = () => {

  const [musicChannels, setMusicChannels] = useState([])

  useEffect(() => {
    const loadMusicChannels = async () => {
      const response = await getAllMusicChannels()
      response && setMusicChannels(response)
    }

    loadMusicChannels().then()
  }, [])

  return (
    <LayoutPage>
      <LayoutScreen title='Music Community'>
        <div className='flex flex-wrap center mt-30 justify-center mb-5'>
          {musicChannels?.map((item, index) => (
            <div key={index} className='mt-10'>
              <CustomSlide
                index={index + 1}
                avatar={item.avatar || DEMO_AVATAR}
                banner={item.banner || DEMO_BACKGROUND}
                username={item.title}
                uniqueId={item.description}
                collectionId={item._id}
                music={true}
              />
            </div>
          ))}
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default MusicHome;
