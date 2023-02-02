import React from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';


const Finance = () => {
  return (
    <LayoutPage>
      <LayoutScreen
        title='Trade $Metasalt Tokens'
        description="If you don't have BTC or ETH purchase by clicking the FIAT button below"
      >
        <iframe
          src="https://app.uniswap.org/#/swap?outputCurrency=0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
          height="660px"
          width="100%"
          title='finance'
        />
      </LayoutScreen>
    </LayoutPage>
  )
}

export default Finance;
