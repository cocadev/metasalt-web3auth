import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
const LayoutPage = dynamic(() => import('../components/layouts/layoutPage'));
const LayoutScreen = dynamic(() => import('../components/layouts/layoutScreen'));
const CustomDisplayDiscord = dynamic(() => import('../components/custom/CustomDisplayDiscord'));

const MyDiscoursePage = () => {

  const { user, account } = useMoralis();
  const [trigger, setTrigger] = useState(0);
  const { data } = useMoralisQuery('DiscourseServers', query => query.equalTo('owner', account).descending('createdAt'), [trigger]);
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('userId', user?.id || '-' ), [trigger, user], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })

  return (
    <LayoutPage>

      <LayoutScreen title='Discourse'>

        <div className='d-center d-row mt-3 flex-wrap'>
          {data.map((item, index) =>
            <CustomDisplayDiscord 
              key={index} 
              item={item} 
              onTrigger={() => setTrigger(trigger + 1)}
              isLike={allLikesData.includes(item.id)}    
            />)
          }
        </div>

      </LayoutScreen>

    </LayoutPage>
  )
}

export default MyDiscoursePage