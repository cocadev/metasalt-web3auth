import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import Lottie from "lottie-react";
import nft2 from "../../constants/lottie/nft1.json";

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

const Reserve = () => {

  return (
    <div className="container"><br/><br/>
      <div className="row align-items-center">
      
        <div className="col-md-7">
          
          <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={600} triggerOnce>
            <h2 className='color-7'>On-ramp to <span className='color-sky'>WEB3</span></h2>
          </Reveal>

          <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={600} triggerOnce>
            <p className=" lead">
            Metasalt provides a Web2 experience that helps ease your customers
            into Web3. Familiar email login technology lets you become their first 
             experience using wallets. Our Point-of-Sale minting technology
             even lets you create NFTs linked to your physical products inside your store or online
             shopping cart. Our mobile app is designed to be used like another IOS or Android app 
             except you and your customers now have the power of Web3.
           </p>
          </Reveal>

          <div className="spacer-10"></div>
          <h4 className='text-center color-sky d-center d-row'>
            <div className='cursor' style={{ marginTop: -5, marginRight: 5 }}>Learn more</div>
            <i className="arrow_right bg-color-secondary cursor" style={{ fontSize: 27 }}></i>
          </h4>
        </div>

        <div className="col-md-5 d-center">
          {/* <img src="" style={{ maxWidth: 500 }} alt="" /> */}
          <Lottie animationData={nft2} loop style={{ maxWidth: 400 }}/>

        </div>

      </div>

      <br />

      <div className='d-center'>
        <div className='sky-border'></div>
      </div>

      <br />

      <div className='flex flex-row justify-between w-full'>
        {
          ICONS.map((item, index) => <ATOM key={index} item={item} />)
        }
      </div>
    </div>
  )
};

export default Reserve;

function ATOM({ item }) {
  const { icon, title, description } = item;
  return (
    <div className='f-1 flex-col d-center' style={{ justifyContent: 'flex-start', padding: '0 18px' }}>
      <img src={icon} alt='icon'/>
      <div className='color-sky text-center mt-20 fw-6' style={{ fontSize: 20 }}>{title}</div>
      <div className='text-center fw-6'>{description}</div>
    </div>
  )
}

const ICONS = [
  {
    icon: 'img/icons/bonds.png',
    title: 'Point-of-Sale Minting',
    description: 'Mobile application lets you mints NFTs of your physical products on the fly'
  },
  {
    icon: 'img/icons/treasury.png',
    title: 'Shopify app',
    description: 'Create NFT products in your dashboard and sell them alongside your products'
  },
  {
    icon: 'img/icons/bug.png',
    title: 'Android and IOS',
    description: 'Mobile app serves as a custodial wallet for those not ready to take the leap'
  },
]