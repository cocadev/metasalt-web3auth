import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { onLikes } from '../../common/web3Api';
import LayoutGated from '../../components/layouts/layoutGated';
import { BACKEND_API } from '../../keys';
const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  video {
    // max-height: 96vh;
    width: 100%;
    // margin-top: 5px;
  }
`

const VideoDetailPage = () => {

  const { Moralis, user } = useMoralis();
  const router = useRouter();
  const [videoURL, setVideoURL] = useState('');
  const videoId = router.query.videoId;
  const dispatch = useDispatch();
  const [trigger, setTrigger] = useState(0);
  const { data: videoData } = useMoralisQuery('Videos', query => query.equalTo('videoId', videoId).limit(1), [videoId], { autoFetch: true });
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('itemId', videoId), [trigger, user], { autoFetch: true });

  const isLike = likes.find(item => item.attributes.userId === user?.id);
  const gatedData = videoData[0]?.attributes.addedNFT;
  const title = videoData[0]?.attributes.title;

  useEffect(() => {
    videoId && (async () => {
      const response = await fetch(`${BACKEND_API}url/assets%2F${videoId}`)
      const res = await response.json();
      setVideoURL(res.preSignedUrl);
    })();
  }, [videoId])

  const onLikeVideo = async () => {
    const request = { Moralis, isLike, itemId: videoId, user, type: 'video', router, follow: false }
    dispatch(onLikes(request, () => {
      setTrigger(trigger + 1)
    }))
  }

  return (
    <LayoutPage>
      {gatedData && <LayoutGated data={gatedData} title={title} />}
      <Container>
        <video controls src={videoURL} preload="auto" />
      </Container>
      <div onClick={onLikeVideo} className='m-3 cursor'>
        <span style={{ marginRight: 12, color: isLike ? '#ff343f' : '#666' }} aria-hidden="true" className="icon_heart"></span>
        {likes?.length || 0} favorites
      </div>
    </LayoutPage>
  )
};

export default VideoDetailPage;