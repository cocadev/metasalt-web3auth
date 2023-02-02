import React, { memo } from "react";
import { useMoralis, useMoralisQuery } from 'react-moralis';
import CustomDisplayDiscord from "../../components/custom/CustomDisplayDiscord";

const TopDiscourse = ({ count, favFilter }) => {

  const { user } = useMoralis();
  const { data } = useMoralisQuery('DiscourseServers', query => query.descending('createdAt').limit(count || 4), []);
  const { data: likes } = useMoralisQuery("AllLikes", query => query.equalTo("userId", user?.id || '-'), [user], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })

  return (
    <div className='d-center d-row mt-3 flex-wrap'>
      {data
        .filter(x => favFilter ? allLikesData.includes(x.id) : x)
        .map((item, index) =>
          <CustomDisplayDiscord
            key={index}
            item={item}
          />)
      }
    </div>
  );
}

export default memo(TopDiscourse);
