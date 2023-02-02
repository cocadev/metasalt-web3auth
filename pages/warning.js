import React from 'react';
import styled from 'styled-components';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';


const Span = styled.a`
  color: #1e50b3;
  cursor: pointer;

  &:hover {
    color: #8364e2;
  }
`

const Warning = () => {

  return (
    <LayoutPage>
      <LayoutScreen title={'Warning'} description={'About scams for users to read and acknowledge'}>
        <div className='container mt-5'>
          <p className='f-20 color-b'>
            - NEVER share your seed phrase or private key. <br />
            - Do NOT interact with a wallet someone gave you that has money already in it.<br />
            - NEVER DM a Youtube comment, Telegram and Whatsapp.<br />
            - Always check your URLs.<br />
            - Install a reputable anti-phishing browser extension like <Span href='https://chrome.google.com/webstore/detail/internet-security-by-meta/keghdcpemohlojlglbiegihkljkgnige' target='_blank'>Metacert</Span>.<br />
          </p>
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default Warning;