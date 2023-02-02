import React, { memo } from "react";
import { useMoralis, useMoralisQuery } from 'react-moralis';
import CustomDisplayVideo from "../../components/custom/CustomDisplayVideo";

const TopVideos = ({count, favFilter}) => {

  const { user } = useMoralis();
  const { data: videoData } = useMoralisQuery('Videos', query => query.equalTo().descending('createdAt').limit(count || 4), []);
  const { data: likes } = useMoralisQuery("AllLikes", query => query.equalTo("userId", user?.id || '-' ), [user], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })

  return (
    <div className='nft flex flex-row flex-wrap d-center'>
      <div className=" d-flex flex-row flex-wrap d-center">
        {
          videoData.filter(x => favFilter ? allLikesData.includes(x.id) : x).map((item, index) =>
            <CustomDisplayVideo
              key={index}
              item={item}
              hidden
            />)
        }
      </div>
    </div>
  );
}

export default memo(TopVideos);
