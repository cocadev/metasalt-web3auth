import dynamic from 'next/dynamic';
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import TimeAgo from 'javascript-time-ago';
import { HMSRoomProvider } from '@100mslive/react-sdk';
import { MoralisProvider } from 'react-moralis';
import { Provider } from 'react-redux';
import store from '../store/store';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import RightBar from '../components/rightbar';
import Footer from '../components/footer';
import { Web3AuthProvider } from '../services/web3auth';
import {
  GOERLI_MORALIS_APPID,
  GOERLI_MORALIS_SERVER_URL,
  PROD,
  PROD_MORALIS_APPID,
  PROD_MORALIS_SERVER_URL,
} from '../keys';

import en from 'javascript-time-ago/locale/en.json';

import 'bootstrap/dist/css/bootstrap.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import 'react-tagsinput/react-tagsinput.css';
import 'react-phone-number-input/style.css';
import '@stream-io/stream-chat-css/dist/css/index.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/elegant-icons/style.css';
import '../public/assets/animated.css';
import '../public/assets/style.scss';
import '../public/assets/custom.scss';
import './admin/admin.scss';
import '../components/chat/chat.css';
import '../components/livestream/livestream.scss';

const HeaderNotification = dynamic(() => import('../components/header/HeaderNotification'));

TimeAgo.addDefaultLocale(en);

export default function App({ Component, pageProps }) {

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, [])

  return (
    <HMSRoomProvider>
      <Provider store={store}>
        <MoralisProvider
          appId={PROD ? PROD_MORALIS_APPID : GOERLI_MORALIS_APPID}
          serverUrl={PROD ? PROD_MORALIS_SERVER_URL : GOERLI_MORALIS_SERVER_URL}
        >
          <Web3AuthProvider web3AuthNetwork={'testnet'}>
            <SkeletonTheme baseColor='#202020' highlightColor='#444'>
              <NextNProgress height={5} color='#2080d0' />
              <div className='app-wrapper'>
                <h1 className='d-none'>Metasalt</h1>
                <Header />
                <HeaderNotification />
                <div className='d-flex flex-row'>
                  <Sidebar />
                  <div className='w-100'>
                    <Component {...pageProps} />
                  </div>
                  <RightBar />
                </div>
                <Footer />
              </div>
            </SkeletonTheme>
          </Web3AuthProvider>
        </MoralisProvider>
      </Provider>
    </HMSRoomProvider>
  )
}
