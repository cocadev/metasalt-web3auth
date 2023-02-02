import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { HomeLottie } from '../../components/loading';
import { useRouter } from 'next/router';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Slidermain = () => {

  let router = useRouter();

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6">
          <div className="spacer-single" />
          <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
            <h3 className="color-7"><span className="text-uppercase ">Generate loyalty and build communities</span></h3>
          </Reveal>
          <div className="spacer-1" />
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
            <h1 className="color-yellow">NFTs are the KEYS</h1>
          </Reveal>
          <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={600} triggerOnce>
            <p className="lead ">
              You control access to special events
              and exclusive content using your NFTs as keys.
              Add content such as QR codes,
              videos, and hyperlinks to your NFT communities, and link your NFTs to those communities.
              Your NFTs can then be used as digital keys to unlock VIP tickets, community memberships, digital media, and online products.
              Because they are NFTs, they can be bought and sold on any marketplace, appreciating in value, and generating royalties for you on every transaction.
            </p>
          </Reveal>
          <div className="spacer-10" />
          <Reveal className='onStep' keyframes={fadeInUp} delay={800} duration={900} triggerOnce>
            <div className='flex row'>
              <span onClick={() => router.push('/makeNFTs', undefined, { shallow: true })} className="btn-main lead">+CREATE NFT</span>
              <span onClick={() => router.push('/createNFTcommunities', undefined, { shallow: true })} className="btn-main ml-10">+CREATE NFT COMMUNITY</span>
            </div>
            <div className="mb-sm-30" />
          </Reveal>
        </div>
        <div className="col-md-6 xs-hide">
          <Reveal className='onStep' keyframes={fadeIn} delay={900} duration={1500} triggerOnce>
            <HomeLottie />
          </Reveal>
        </div>
      </div>

    </div>
  )
};

export default Slidermain;