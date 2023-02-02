import { useRouter } from 'next/router';
import React from 'react';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';

const Academy = () => {

  const router = useRouter();

  return (
    <LayoutPage>
      <LayoutScreen title='Admin'>
        <div className='d-center mt-5 color-b flex flex-row'>
          <div className='btn btn-primary m-2' onClick={() => router.push('/admin/reward')}>Reward Token</div>
          <div className='btn btn-primary m-2' onClick={() => router.push('/admin/message')}>Message</div>
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default Academy;
