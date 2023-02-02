import dynamic from 'next/dynamic';
import React, { memo } from 'react';
import { Help1Lottie, Help2Lottie, Help3Lottie } from '../components/loading';
const LayoutPage = dynamic(() => import('../components/layouts/layoutPage'));
const LayoutScreen = dynamic(() => import('../components/layouts/layoutScreen'));

const HelpPage = () => {
  return (
    <LayoutPage>
      <LayoutScreen title={'Help'}>
        <div className="flex flex-row justify-center">
          <Help1Lottie />
          <Help2Lottie />
          <Help3Lottie />
        </div>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default memo(HelpPage);