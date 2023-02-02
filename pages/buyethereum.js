import { useRouter } from 'next/router';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';


const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background: #000;
    border-bottom: solid 1px #403f83;
  }

  header#myHeader.navbar .search #quick_search {
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }

  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a {
    color: #fff;
  }

  header#myHeader .dropdown-toggle::after {
    color: rgba(255, 255, 255, .5);
  }

  header#myHeader .logo .d-block {
    display: none !important;
  }

  header#myHeader .logo .d-none {
    display: block !important;
  }

  .demo-icon-wrap-s2 span {
    color: #fff;
  }

  #onramper-widget {
    height: 100%;
    width: 100%;
    margin: 0;
    min-height: 800px;
  }

  @media only screen and (max-width: 1199px) {
    .navbar {
      background: #403f83;
    }

    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2 {
      background: #fff;
    }

    .item-dropdown .dropdown a {
      color: #fff !important;
    }
  }
`;


const Fiat = () => {

  const router = useRouter()

  return (
    <LayoutPage>
      <LayoutScreen
        title='Buy Bitcoin and Ethereum using a Credit Card'
        description='Exchange for $METASALT Tokens'
        content={
          <div className='d-center mt-30 text-center'>
            <div className='btn-custom' onClick={() => router.push('/$metasalttokens', undefined, { shallow: true })}>BUY</div>
          </div>
        }
      >
        <GlobalStyles />

        <iframe
          id='onramper-widget'
          title='Onramper widget'
          frameborder='no'
          allow='accelerometer; autoplay; camera; gyroscope; payment;'
          src='https://widget.onramper.com?color=266678&apiKey=pk_prod_IFugerJcYmGpjr0PxF3zWOumJ0Qx7YjeQJUo_eZUTic0'>
        </iframe>
      </LayoutScreen>
    </LayoutPage>
  )
}

export default Fiat;
