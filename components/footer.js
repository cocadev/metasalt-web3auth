import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';
import UtilService from '../sip/utilService';

const MyFooter = styled.div`
  background: #1c1c26;
  padding: 30px;
  color: #ddd;
  @media only screen and (max-width: 600px) {
    padding: 0 5px 12px 5px;
  }
`

const Title = styled.div`
  font-family: 'Ramabhadra', sans-serif;
  color: #eee;
  font-size: 21px;
  margin-bottom: 12px;
  margin-top: 30px;
  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin-bottom: 4px;
    margin-top: 20px;
  }
`

const Text = styled.div`
  font-size: 15px;
  cursor: pointer;
  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const Footer = () => {

  const { width } = useWindowSize();
  const router = useRouter();
  const pathname = router.pathname;
  const isDisableFooter = UtilService.disableHeader(pathname);

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  return (
    <MyFooter className="row d-center" style={{ display: isDisableFooter && 'none' }}>
      <div className={`row col-md-${width > 700 ? 10 : 12}`}>
        <div className='col-md-4'>
          <img src='/img/logo.png' style={{ width: 120, marginTop: 42 }} />
          <Text style={{ cursor: 'auto', marginTop: 32 }}>The world’s digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items.</Text>
        </div>
        <div className='col-md-8'>
          <div className='row'>
            <div className='offset-lg-2 offset-md-1 col-xs-6 col-md-4 col-lg-2 '>
              <Title>Explore</Title>
              <Text onClick={() => handleRouters('/nftcommunities')}>Communities</Text>
              <Text onClick={() => handleRouters('/videos')}>Videos</Text>
              <Text onClick={() => handleRouters('/music')}>Music</Text>
              <Text onClick={() => handleRouters('/discourse')}>Discourse</Text>
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2 '>
              <Title>Marketplace</Title>
              <Text onClick={() => handleRouters('/nftmarketplace')}>Popular NFTs</Text>
              <Text onClick={() => handleRouters('/feed')}>Feeds</Text>
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2 '>
              <Title>Category</Title>
              <Text onClick={() => handleRouters('/collection/art')}>Art</Text>
              <Text onClick={() => handleRouters('/collection/boats')}>Boats</Text>
              <Text onClick={() => handleRouters('/collection/cars')}>Cars</Text>
              <Text onClick={() => handleRouters('/collection/fashion')}>Fashion</Text>
              <Text onClick={() => handleRouters('/collection/jewelry')}>Jewelry</Text>
              <Text onClick={() => handleRouters('/collection/planes')}>Planes</Text>
              <Text onClick={() => handleRouters('/collection/realEstate')}>Real Estate</Text>
              <Text onClick={() => handleRouters('/collection/watches')}>Watches</Text>
              <Text onClick={() => handleRouters('/collection/wine')}>Wine</Text>
              <Text onClick={() => handleRouters('/collection/event')}>Event</Text>
              <Text onClick={() => handleRouters('/collection/certifications')}>Certifications</Text>
              <Text onClick={() => handleRouters('/collection/electronics')}>Electronics</Text>
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2 '>
              <Title>Social</Title>
              {
                socials.map((item, index) => <Link href={item.link} key={index}>
                  <a target='_blank' rel="noopener" className={!item.link ? 'btn-disabled' : 'hover-white'}>
                    <Text>{item.title}</Text>
                  </a>
                </Link>)
              }
            </div>
            <div className='col-xs-6 col-md-4 col-lg-2 '>
              <Title>ToS</Title>
              <Text onClick={() => handleRouters('/termsOfService')}>Terms of Service</Text>
              <Text onClick={() => handleRouters('/privacy')}>Privacy</Text>
            </div>
          </div>
        </div>
      </div>

      <div className='row col-md-10 mt-5' style={{ borderTop: '1px solid #fff' }}>
        <div className='mt-4 f-14'>© 2023 Metasalt, Inc</div>
      </div>

    </MyFooter>
  )
};

export default Footer;

const socials = [
  { title: 'iOS App', link: '', },
  { title: 'Android App', link: '' },
  { title: 'TikTok', link: 'https://www.tiktok.com/@metasalt.io' },
  { title: 'Youtube', link: 'https://www.youtube.com/watch?v=qHTp3KuefiE&ab_channel=METASALT' },
  { title: 'Twitter', link: 'https://twitter.com/metasalt_io' },
  { title: 'Instagram', link: 'https://www.instagram.com/metasalt.io/' },
];