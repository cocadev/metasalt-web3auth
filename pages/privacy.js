import React, { memo } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';

const Privacy = () => {
  return (
    <LayoutPage>
      <LayoutScreen title='Privacy' description='Metasalt'>
        <section className='container'>
          <div className="spacer-single" />
          <div className="color-b" style={{ fontSize: 18 }}>
            Comming Soon!
          </div>
        </section>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default memo(Privacy);