import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";

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

const featurebox = () => (
  <div className='row'>
    <div className="col-lg-4 col-md-6 mb-3">
      <div className="feature-box f-boxed style-3">
        <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
          <i className="bg-color-2 i-boxed icon_wallet"></i>
        </Reveal>
        <div className="text">
          <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
            <h4 className="">CONNECT</h4>
          </Reveal>
          <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
            <p className="">Connect your digital wallet to METASALT, generate your avatar, and bling out your profile. Then, start promoting, buying and selling your NFTs.</p>
          </Reveal>
        </div>
        <i className="wm icon_wallet"></i>
      </div>
    </div>

    <div className="col-lg-4 col-md-6 mb-3">
      <div className="feature-box f-boxed style-3">
        <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
          <i className=" bg-color-2 i-boxed icon_cloud-upload_alt"></i>
        </Reveal>
        <div className="text">
          <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
            <h4 className="">CREATE-TO-EARN</h4>
          </Reveal>
          <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
            <p className="">Create NFTs of any real world object and get free METASALT tokens every time you do! Brand owners, take control in the Metaverse, by clicking here.</p>
          </Reveal>
        </div>
        <i className="wm icon_cloud-upload_alt"></i>
      </div>
    </div>

    <div className="col-lg-4 col-md-6 mb-3">
      <div className="feature-box f-boxed style-3">
        <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
          <i className=" bg-color-2 i-boxed icon_tags_alt"></i>
        </Reveal>
        <div className="text">
          <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
            <h4 className="">MAKE MONEY</h4>
          </Reveal>
          <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce>
            <p className="">Mint, buy, and sell NFTs using METASALT tokens. The more tokens you have, the more you control. Buy and sell tokens using US Dollars.</p>
          </Reveal>
        </div>
        <i className="wm icon_tags_alt"></i>
      </div>
    </div>


  </div>
);
export default featurebox;