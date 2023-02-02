import { useRouter } from 'next/router';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useWindowSize from '../../hooks/useWindowSize';
import UtilService from '../../sip/utilService';
import { removeNotification } from '../../store/actions/notifications/notifications';
import { ArrowLottie } from '../loading';

const Content = styled.div`
  font-size: 18px;
  @media only screen and (max-width: 600px){
    font-size: 14px;
  }
`

const HeaderNotification = () => {

  const { notification, type, additional } = useSelector(state => state.notifications)
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const router = useRouter();
  const pathname = router.pathname;
  const isTop = UtilService.disableHeader(pathname);
  const isMobile = width < 600;

  useEffect(() => {
    if(type === 'success'){
      setTimeout(() => onClose(), 5000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification, ])

  const onClose = () => {
    dispatch(removeNotification())
  }

  if (!notification) {
    return null
  }

  return (
    <div
      className='notification'
      style={{
        background: UtilService.getColorNotification(type),
        top: isTop ? 0 : isMobile ? 50: 72
      }}
    >
      <Content className='d-center mt-1 d-flex flex-row' style={{ color: type === 'info' ? '#333' : 'white' }}>
        {notification}
        {
          additional === 'metamask' && <div>&nbsp; Install 
          <a className='color-yellow' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en' target='_blank' rel="noreferrer"> metamask </a>in your browser. </div>
        }
        <span aria-hidden="true" className="icon_close cursor" style={{ fontSize: 29 }} onClick={onClose} />
        {/* {width > 850 && <Link href='/help' style={{ position: 'absolute', height: 35, right: 6, cursor: 'pointer' }}>
          <HelpLottie />
        </Link>} */}
      </Content>

      {
        notification === '🦊 Please connect your wallet to this website manually, and refresh the page!' &&
        <div>
          <div style={styles.box}>
            <ArrowLottie />
            <div className='flex d-center'>
              <img src='img/gif/01.gif' alt='' style={{ width: 300, marginTop: 12, borderRadius: 12 }}/>
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default memo(HeaderNotification);

const styles = {
  box: {
    width: 320,
    height: 530,
    borderRadius: 12,
    background: '#333',
    position: 'absolute',
    top: 70,
    right: 10,
    zIndex: 9999
  }
}