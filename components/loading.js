import Lottie from 'lottie-react';
import styled from 'styled-components';

import small from '../constants/lottie/small.json';
import step1 from '../constants/lottie/step1.json';
import step4 from '../constants/lottie/step4.json';
import mobile from '../constants/lottie/mobile.json';
import home from '../constants/lottie/home.json';
import discord from '../constants/lottie/discord.json';
import zoom from '../constants/lottie/zoom.json';
import youtube from '../constants/lottie/youtube.json';
import concert from '../constants/lottie/concert.json';
import shopify from '../constants/lottie/shopify.json';
import dao from '../constants/lottie/dao.json';
import mint from '../constants/lottie/mint.json';
import help from '../constants/lottie/help.json';
import help1 from '../constants/lottie/help1.json';
import help2 from '../constants/lottie/help2.json';
import help3 from '../constants/lottie/help3.json';
import arrow from '../constants/lottie/arrow.json';
import qrcontent from '../constants/lottie/qrcontent.json';
import link from '../constants/lottie/link.json';
import video from '../constants/lottie/video.json';

const Box = styled.div`
  position: fixed;
  top: 0; 
  left: 0; 
  z-index: 9999;
  width: 100vw; 
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 0.2s;
  div {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%);
  }
`;
export function TinyLoading() {
  return (
    <div className="d-center" style={{ width: 140 }}>
      <div style={{ width: 90, height: 50 }}>
        <Lottie animationData={small} loop/>
      </div>
    </div>
  );
}

export function SmallLoading(props) {
  return (
    <div className="w-full d-center mt-30">
      <div style={{ width: props?.small ? 200 : 400 }}>
        <Lottie animationData={small} loop/>
      </div>
    </div>
  );
}
export function BlackLoading() {
  return (
    <Box style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
      <div style={{ width: 400 }}>
        <Lottie animationData={small} loop/>
      </div>
    </Box>
  );
}
export function Loading() {
  return (
    <Box>
      <div style={{ width: 400 }}>
        <Lottie animationData={small} loop/>
      </div>
    </Box>
  );
}
export function Step1() {
  return (
    <Lottie animationData={step1} loop style={{ width: 70 }}/>
  );
}
export function Step4() {
  return (
    <Lottie animationData={step4} loop style={{ width: 80 }}/>
  );
}

export function HomeLottie() {
  return (
    <Lottie animationData={home} loop />
  );
}

export function MobileLottie() {
  return (
    <Lottie animationData={mobile} loop />
  );
}

export function DiscordLottie({ small }) {
  return (
    <Lottie animationData={discord} loop style={{ height: small ? 40 : 150 }}/>
  );
}
export function ZoomLottie() {
  return (
    <Lottie animationData={zoom} loop />
  );
}
export function YoutubeLottie({ small }) {
  return (
    <Lottie animationData={youtube} loop style={{ height: small ? 40 : 150 }}/>
  );
}
export function ConcertLottie() {
  return (
    <Lottie animationData={concert} loop />
  );
}
export function ShopifyLottie() {
  return (
    <Lottie animationData={shopify} loop />
  );
}
export function DaoLottie() {
  return (
    <Lottie animationData={dao} loop style={{ height: 150 }}/>
  );
}
export function MintLottie() {
  return (
    <Lottie animationData={mint} loop style={{ height: 350 }}/>
  );
}

export function HelpLottie() {
  return (
    <Lottie animationData={help} loop style={{ height: 35 }}/>
  );
}

export function Help1Lottie() {
  return (
    <Lottie animationData={help1} loop style={{ height: 260, margin: 22 }} />
  );
}
export function Help2Lottie() {
  return (
    <Lottie animationData={help2} loop style={{ height: 260, margin: 22 }} />
  );
}
export function Help3Lottie() {
  return (
    <Lottie animationData={help3} loop style={{ height: 260, margin: 22 }} />
  );
}

export function ArrowLottie() {
  return (
    <Lottie animationData={arrow} loop style={{ height: 120, position: 'absolute', top: -70, right: 80 }} />
  );
}

export function QrcontentLottie() {
  return (
    <Lottie animationData={qrcontent} loop style={{ height: 32, marginTop: 4 }} />
  );
}

export function LinkcontentLottie() {
  return (
    <Lottie animationData={link} loop style={{ height: 30, marginTop: 4 }} />
  );
}

export function VideoLottie() {
  return (
    <Lottie animationData={video} loop style={{ height: 40 }} />
  );
}