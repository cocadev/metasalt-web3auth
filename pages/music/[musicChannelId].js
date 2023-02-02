import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LayoutPage from '../../components/layouts/layoutPage';
import CustomDisplayMusic from '../../components/custom/CustomDisplayMusic';
import { useWeb3Auth } from '../../services/web3auth';
import { getMusicChannelById, getMusicsByChannelId } from '../../common/api';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';

const Absolute = styled.div`
  margin-left: 30px;
  position: absolute;
  margin-top: -100px;
`

const IMG = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 12px;
  border: 5px solid #fff;
`

const MusicDetail = () => {

  const router = useRouter()
  const { user } = useWeb3Auth()
  const [musicChannel, setMusicChannel] = useState(null)
  const [musicsByChannelId, setMusicsByChannelId] = useState([])

  const musicChannelId = router.query.musicChannelId

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  useEffect(() => {
    const loadMusicChannel = async () => {
      const response1 = await getMusicChannelById({ id: musicChannelId })
      response1 && setMusicChannel(response1)
      const response2 = await getMusicsByChannelId({ musicChannelId })
      response2 && setMusicsByChannelId(response2)
    }

    loadMusicChannel().then()
  }, [musicChannelId])

  return (
    <LayoutPage>
      {musicChannel &&
        <>
          <div
            className='jumbotron breadcumb no-bg'
            style={{ background: `url(${musicChannel.banner || DEMO_BACKGROUND})` || '#141414', backgroundSize: 'cover' }}
          >
            <div className='mainbreadcumb' />

            <Absolute>
              <IMG src={musicChannel.avatar || DEMO_AVATAR} alt='avatar' />

              <div>
                <h2 className='color-b mt-3'>{musicChannel.title}</h2>
                <div className='color-b' style={{ marginTop: -10 }}>{musicChannel.description}</div>
                {user?.account === musicChannel.creatorId &&
                  <div
                    className='btn btn-primary mt-3'
                    onClick={() => handleRouters(`/edit/musicChannel/${musicChannel._id}`)}
                  >
                    Edit
                  </div>
                }
              </div>
            </Absolute>
          </div>
          <br />
          <section>
            <h3 className='text-center mt-90 color-b'>Trending music communities in {musicChannel.title}</h3>
            <div className='flex flex-wrap align-center justify-center mt-5'>
              {musicsByChannelId.map((item, index) => (
                <div key={index}>
                  <CustomDisplayMusic
                    item={item}
                    onTrigger={() => {}}
                    isLike={[].includes(item.id)}
                    onGoClick={() => handleRouters(`/musics/${item.id}`)}
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      }
    </LayoutPage>
  )
};

export default MusicDetail;
