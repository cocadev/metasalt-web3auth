import React, { memo } from 'react';
import { CATEGORIES_COLLECTIONS } from '../../constants/hotCollections';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Container = styled.div`
  margin: 0 55px;
  @media only screen and (max-width: 600px) {
    margin: 0;
  }
`

const Category = styled.div`
  height: 300px;
  box-shadow: rgb(0 0 0 / 8%) 0px 4px 8px;
  cursor: pointer;
  padding: 10px;
  @media only screen and (max-width: 600px) {
    height: 200px;
    padding: 20px;
  }
`

const Background = styled.div`
  height: 185px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0.8;
  &:hover {
    opacity: 1
  }
  @media only screen and (max-width: 600px) {
    height: 145px;
  }
`

const Title = styled.div`
  height: 55px;
  text-align: center;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-weight: 600;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 18px;
`

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1324,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        dots: true
      }
    },
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

const RealWorldNFTs = () => {

  const router = useRouter();

  return (
    <Container className='row'>
      <Slider {...settings}>
      {
        CATEGORIES_COLLECTIONS.map((item, index) =>
          <Category
            className="col-sm-12 col-md-6 col-lg-4 mb-3"
            key={index}
            onClick={() => router.push(`/collection/${item.value}`, undefined, { shallow: true })}
          >
            <Background
              style={{
                backgroundImage: `url(${item.banner})`,
              }}>
            </Background>
            <Title>{item.label}</Title>
          </Category>)
      }
      </Slider>
    </Container>
  )
};

export default memo(RealWorldNFTs);