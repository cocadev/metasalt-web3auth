import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { useMoralis, useMoralisQuery } from 'react-moralis';
import CustomDisplayMusic from "../../components/custom/CustomDisplayMusic";

const TopMusics = ({count, favFilter}) => {

  const { user } = useMoralis();
  const router = useRouter();
  const [trigger, setTrigger] = useState(0);
  const { data: musics } = useMoralisQuery("Musics", query => query.equalTo().descending('createdAt').limit(count || 5), [], { autoFetch: true });
  const { data: likes } = useMoralisQuery("AllLikes", query => query.equalTo("userId", user?.id || '-' ), [trigger, user], { autoFetch: true });
  const allLikesData = likes.map(item => { return item.attributes.itemId })
  
  return (
    <div className='nft flex flex-row flex-wrap d-center'>
      <div className=" d-flex flex-row flex-wrap d-center">
        {
          musics
            .filter(x => favFilter ? allLikesData.includes(x.id): x)
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

    </div>
  );
}

export default memo(TopMusics);
