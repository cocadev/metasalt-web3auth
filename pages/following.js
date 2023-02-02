import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import LayoutPage from '../components/layouts/layoutPage';
import { Title } from '../constants/globalCss';
const TopDiscourse = dynamic(() => import('../atoms/home/TopDiscourse'));
const TopMusics = dynamic(() => import('../atoms/home/TopMusics'));
const TopVideos = dynamic(() => import('../atoms/home/TopVideos'));
const Communities = dynamic(() => import('../atoms/home/Communities'));

const Box = styled.div`
  margin-left: 65px;

  h2 {
    color: #bbb;
    cursor: pointer;
    font-family: 'Ramabhadra', sans-serif;
    font-size: 40px;
  }

  p {
    margin-top: -8px;
    font-size: 20px;
  }

  @media only screen and (max-width: 600px) {
    margin: 0 3px 0 0;
    text-align: center;
    h2 {
      font-size: 22px;
      margin-bottom: 15px;
    }

    p {
      font-size: 14px;
      margin-top: -15px;
    }
  }
`

const Following = () => {

  const router = useRouter();
  const [tab, setTab] = useState(0);

  return (
    <LayoutPage>

      <div className='text-center p-5'>
        <Title>Following</Title>
      </div>

      <div className='m-5 color-b mt-4 mobile-hidden'>
        <div>
          <span className={`f-24 cursor ${tab === 0 && 'color-sky fw-600'}`}
                onClick={() => setTab(0)}>Overview</span>&nbsp;&nbsp;
          <span className={`f-24 cursor ${tab === 1 && 'color-sky fw-600'}`}
                onClick={() => setTab(1)}>Communities</span>&nbsp;&nbsp;
          {/* <span className={`f-24 cursor ${tab === 2 && 'color-sky fw-600'}`} onClick={() => setTab(2)}>Streams</span>&nbsp;&nbsp; */}
          <span className={`f-24 cursor ${tab === 3 && 'color-sky fw-600'}`}
                onClick={() => setTab(3)}>Videos</span>&nbsp;&nbsp;
          <span className={`f-24 cursor ${tab === 4 && 'color-sky fw-600'}`}
                onClick={() => setTab(4)}>Music</span>&nbsp;&nbsp;
          <span className={`f-24 cursor ${tab === 5 && 'color-sky fw-600'}`}
                onClick={() => setTab(5)}>Discourse</span>&nbsp;&nbsp;
        </div>
      </div>

      {(tab === 0 || tab === 1) && <div className='mt-5'>
        <div className='row'>
          <div className='col-lg-12'>
            <Box>
              <h2 onClick={() => router.push('/nftcommunities', undefined, { shallow: true })}>Communities</h2>
            </Box>
          </div>
          <div className='col-lg-12'>
            <Communities count={50} favFilter />
          </div>
        </div>
      </div>}


      {(tab === 0 || tab === 3) && <div className='row mt-5'>
        <div className='col-lg-12'>
          <Box>
            <h2 onClick={() => router.push('/videos', undefined, { shallow: true })}>Videos</h2>
          </Box>
        </div>
        <div className='col-lg-12'>
          <TopVideos count={50} favFilter />
        </div>
      </div>}


      {(tab === 0 || tab === 4) && <div className='row mt-5'>
        <div className='col-lg-12'>
          <Box>
            <h2 onClick={() => router.push('/music', undefined, { shallow: true })}>Music</h2>
          </Box>
        </div>
        <div className='col-lg-12'>
          <TopMusics count={50} favFilter />
        </div>
      </div>}


      {(tab === 0 || tab === 5) && <div className='row mt-5'>
        <div className='col-lg-12'>
          <Box>
            <h2 onClick={() => router.push('/discourse', undefined, { shallow: true })}>Channels</h2>
          </Box>
        </div>
        <div className='col-lg-12'>
          <TopDiscourse count={50} favFilter />
        </div>
      </div>}

    </LayoutPage>
  );
}

export default Following;
