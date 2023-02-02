import React, { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import CustomDisplayMusic from '../components/custom/CustomDisplayMusic';
const LayoutPage = dynamic(() => import('../components/layouts/layoutPage'));
const LayoutScreen = dynamic(() => import('../components/layouts/layoutScreen'));

const MyMusicPage = () => {

  const { user } = useMoralis();
  const router = useRouter();
  const [trigger, setTrigger] = useState(0);
  const { data: musics } = useMoralisQuery('Musics', query => query.equalTo('owner', user?.id).descending('createdAt'), [user], { autoFetch: true });
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('userId', user?.id || '-'), [trigger, user], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })

  return (
    <LayoutPage>
      <LayoutScreen title='My Music'>
        <div className='d-center d-row mt-5 mb-5 flex-wrap'>
          {
            musics
              .map((item, index) => (
                <div key={index}  >
                  <CustomDisplayMusic
                    item={item}
                    onTrigger={() => setTrigger(trigger + 1)}
                    isLike={allLikesData.includes(item.id)}
                    onGoClick={() => router.push('/musics/' + item.id, undefined, { shallow: true })}
                  />
                </div>
              ))
          }
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default MyMusicPage;
