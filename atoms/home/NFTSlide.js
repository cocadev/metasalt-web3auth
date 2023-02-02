import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import UtilService from '../../sip/utilService';
import { getAllLazyMints } from '../../common/api';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const Box = styled.div`
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
`

const Container = styled.div`
  padding: 0 40px;
`

const Background = styled.div`
  width: 100%;
  height: 350px;
  background: #444 no-repeat center;
  background-size: cover;
  border-radius: 12px;

  @media only screen and (max-width: 1300px) {
    height: 250px;
  }
  @media only screen and (max-width: 900px) {
    height: 200px;
  }
  @media only screen and (max-width: 600px) {
    height: 250px;
  }
`

const NFTSlide = () => {

  const router = useRouter()
  const [NFTs, setNFTs] = useState([])

  const settings = {
    dots: true,
    infinite: NFTs.length > 3,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  useEffect(() => {
    const loadNFTs = async () => {
      const response = await getAllLazyMints()
      response && setNFTs(response.data)
    }

    loadNFTs().then()
  }, [])

  return (
    <div>
      <Container>
        <Slider {...settings}>
          {NFTs.slice(0, 12).map((item, index) => {
            const { image, thumbnail = 'https://ipfs.moralis.io:2053/ipfs/QmRamfc2stckiMtXonnBVHEgovy9qH8J1EiiNXRT6EBnVK' } = JSON.parse(item.metadata)
            return (
              <Box 
                key={index} 
                onClick={()=>router.push(`/nftmarketplace/${UtilService.checkNet(item.token_address)}/${item.token_address}/${UtilService.tokenIDHexConvert(item.tokenId)}`)}
              >
                <Background style={{
                  backgroundImage: `url(${item?.thumbnail || thumbnail || image})`,
                }}>
                </Background>
              </Box>)
          })
          }
        </Slider>
      </Container>
    </div>
  );
}

export default NFTSlide;
