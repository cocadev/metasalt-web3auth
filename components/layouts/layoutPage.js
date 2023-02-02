import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import UtilService from '../../sip/utilService';

const Container = styled.div`
  width: 100vw;
  padding: ${props => props.isDisableHeader ? '0' : '80px 70px 0'};
  min-height: 465px;
  @media (max-width: 600px) {
    padding: ${props => props.isDisableHeader ? '0' : '50px 0 0'};
  }
`

const MainContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const Congrat = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
`

const BackArrowIcon = styled.img`
  width: 40px;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 9;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 25px;
    top: 10px;
    left: 10px;
  }
`

const LayoutPage = ({ children, container, congrat, backHidden }) => {

  const router = useRouter();
  const pathname = router.pathname;
  const isDisableHeader = UtilService.disableHeader(pathname);

  return (
    <Container isDisableHeader={isDisableHeader}>
      <MainContent>
      {!backHidden && <BackArrowIcon onClick={() => router.back()} src="/img/icons/ic_back.png" alt="back" />}
        {congrat && <Congrat>
          <Confetti opacity={congrat ? 1 : 0} />
        </Congrat>}
        <div className={container ? 'container m-auto' : 'container-fluid p-0'}>
          {children}
        </div>
      </MainContent>
    </Container>
  );
};

export default LayoutPage;
