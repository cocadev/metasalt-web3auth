import React, { memo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useMoralis } from 'react-moralis';
import UtilService from '../../sip/utilService';

const GreenBall = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #3ba55d;
  margin-right: 5px;
`

const Like = styled.div`
  cursor: pointer;
  position: absolute;
  right: 8px;
  bottom: 6px;
`

const Title = styled.div`
  font-size: 19px;
  height: 40px;
  @media only screen and (max-width: 600px){
    font-size: 15px;
    height: 30px;
  }
`

const Description = styled.div`
  font-size: 13px;
  @media only screen and (max-width: 600px){
    font-size: 11px
  }
`

const Box = styled.div`
  width: 343px;
  height: 320px;
  border-radius: 6px;
  background: #121212;
  overflow: hidden;
  @media only screen and (max-width: 600px){
    width: 300px;
    height: 220px;
  }
`

const IMG = styled.img`
  height: 160px;
  @media only screen and (max-width: 600px){
    height: 90px;
  }
`

const CustomDisplayDiscord = ({ item }) => {

  const { isAuthenticated } = useMoralis();
  const router = useRouter();

  const onGoLink = () => {
    if(isAuthenticated){
      router.push(`/discourse/${item.id}`, undefined, { shallow: true })
    }else{
      router.push('login', undefined, { shallow: true })
    }
  }

  return (
    <Box className='m-3 d-center relative'>
      <IMG
        onClick={onGoLink}
        src={UtilService.ConvetImg(item.attributes.thumbnail)}
        alt='thumb'
        className='cursor'
      />

      <div className="d-flex flex-column p-2 f-1" style={{ height: 160, overflow: 'hidden' }}>
        <Title className='d-center color-w' >✅{item.attributes.title}</Title>
        <Description className='d-center color-b m-2'>{item.attributes.description}</Description>
      </div>

        <div className="d-row color-b f-12 justify-around w-full mobile-hidden" style={{ height: 30 }}>
          <div className="d-row align-center"><GreenBall />2 Online</div>
          <div className="d-row align-center"><GreenBall style={{ background: '#aaa' }} />999 Members</div>
        </div>

    </Box>
  )
}

export default memo(CustomDisplayDiscord);