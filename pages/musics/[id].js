import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { onLikes } from '../../common/web3Api';
import LayoutGated from '../../components/layouts/layoutGated';
import { BACKEND_API } from '../../keys';
const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));
const LayoutScreen = dynamic(() => import('../../components/layouts/layoutScreen'));

const MusicDetailPage = () => {

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { Moralis, user } = useMoralis();
  const [trigger, setTrigger] = useState(0);
  const [videoURL, setVideoURL] = useState();
  const { data: musics } = useMoralisQuery('Musics', query => query.equalTo('objectId', id).limit(1), [id], { autoFetch: true });
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('itemId', id), [trigger, id], { autoFetch: true });

  const isLike = likes.find(item => item.attributes.userId === user?.id);
  const { title, description, musicId } = musics[0]?.attributes || '';
  const gatedData = musics[0]?.attributes.addedNFT;

  const onGetVideoURL = useCallback(async () => {
    if(!musicId) return false;
    const response = await fetch(`${BACKEND_API}url/assets%2F${musicId}`)
    const res = await response.json();
    setVideoURL(res.preSignedUrl);
  }, [musicId])

  useEffect(() => {
    onGetVideoURL();
  }, [onGetVideoURL])

  const onLikeMusic = async () => {
    const request = { Moralis, itemId: id, user, type: 'music', router, follow: false }
    dispatch(onLikes(request, () => {
      setTrigger(trigger + 1);
    }))
  }

  return (
    <LayoutPage>
      {gatedData && <LayoutGated data={gatedData} title={title} />}
      <LayoutScreen
        title={title || 'Music'}
        description={description || 'Play the music'}
      >
        <div className='container mt-5'>

          <div onClick={onLikeMusic} className='mt-3 mb-3 cursor'>
            <span style={{ marginRight: 12, color: isLike ? '#ff343f' : '#666' }} aria-hidden="true" className="icon_heart"></span>
            {likes?.length || 0} favorites
          </div>

          {videoURL && <audio controls src={videoURL} preload="auto" className='w-full'></audio>}

        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default MusicDetailPage;