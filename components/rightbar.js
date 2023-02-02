import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import useWindowSize from '../hooks/useWindowSize';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { VERSION } from '../keys';


const Container = styled.div`
  width: ${props => props.disabled ? 0 : (props.opened ? 250 : 70)}px;
  background: #1c1c26;
  height: 100vh;
  position: fixed;
  z-index: 2;
  margin-top: 75px;
  overflow: auto;
  max-height: calc(100% - 75px);
  right: 0;
  transition: all 0.3s ease-in-out;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, 0.75);

  @media only screen and (max-width: 600px) {
    margin-top: 40px;
    max-height: calc(100% - 40px);
  }
`;

const Title = styled.div`
  font-size: ${props => props.opened ? 14 : 10}px;
  color: ${props => props.selected ? '#fff' : '#bbb'};
  margin-left: 3px;
  margin-right: 3px;
  font-weight: 400;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  background: ${props => props.selected ? '#8264e2' : '#1c1c26'};
  padding: 2px 7px;
  border-radius: 5px;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: #bbb;
`

const Icon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  position: absolute;
  left: 36px;
  bottom: 0;
  padding: 2px;
  background: #111;
`

const Text = styled.div`
  display: ${props => props.opened ? 'block' : 'none'}
`

const Bottom = styled.div`
  font-size: ${props => props.opened ? 18 : 12}px;
  height: 60px;
  color: #fff;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
`

const Border = styled.div`
  height: 2px;
  width: 80%;
  background: brown;
  margin: 2px 0;
`

const UsersIcon = styled.div`
  background: #333;
  position: fixed;
  bottom: 6px;
  z-index: 2;
  margin-top: 55px;
  right: 5px;
  transition: all 0.3s ease-in-out;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: -2px 3px 4px 0 rgba(0, 0, 0, 0.75);
  color: #fff;
`

const RightBar = () => {

  const router = useRouter();
  const pathname = router.pathname;
  const { isAuthenticated, rightBarUsers } = useWeb3Auth();
  const [tab, setTab] = useState(0) // 0-online, 1-following, 2-followed
  const [initialHover, setInitialHover] = useState(false);
  const [searchKey, setSearchKey] = useState();

  const { width } = useWindowSize();
  const isMobile = width < 600;
  const uiOpened = isMobile ? true : initialHover;

  const isDisable = UtilService.disableHeader(pathname)
  if (isDisable) {
    return false
  }

  return (
    <div style={{ position: 'relative', zIndex: 99 }}>

      <UsersIcon onClick={() => setInitialHover(true)}>
        <span className='social_myspace'/>
      </UsersIcon>

      <Container
        opened={uiOpened}
        disabled={isMobile && !initialHover}
        onMouseOver={() => setInitialHover(true)}
        onMouseLeave={() => setInitialHover(false)}
      >

        <div>

          <div className='d-row align-center justify-betwen mt-3'>
            <Title opened={uiOpened} selected={tab === 0} onClick={() => setTab(0)}>Online</Title>
            {isAuthenticated && <Title opened={uiOpened} selected={tab === 1} onClick={() => setTab(1)}>Following</Title>}
            {isAuthenticated && <Title opened={uiOpened} selected={tab === 2} onClick={() => setTab(2)}>Followers</Title>}
            {isMobile && <span className='icon_close f-20 color-white mr-2' onClick={() => setInitialHover(false)} />}
          </div>

          <div className='ml-2 mr-2 mt-2'>
            <input
              style={{ marginBottom: 2 }}
              className="form-control"
              placeholder="Search Username"
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
            />
          </div>

          <div className='d-center'>
            <Border />
          </div>

          <div className='hidden-scrollbar' style={{ overflow: 'auto', flex: 1, height: 'calc(100vh - 250px)' }}>
            {
              tab === 0 &&
              rightBarUsers.length && rightBarUsers
                .filter(item => item.username.includes(searchKey) || !searchKey)
                .map((item, index) => <ContactAtom key={index} item={item} opened={uiOpened} />)
            }
            {
              tab === 1 &&
              rightBarUsers.length && rightBarUsers
                .filter(item => (item.username.includes(searchKey) || !searchKey) && item.following)
                .map((item, index) => <ContactAtom key={index} item={item} opened={uiOpened} />)
            }
            {
              tab === 2 &&
              rightBarUsers.length && rightBarUsers
                .filter(item => (item.username.includes(searchKey) || !searchKey) && item.followed)
                .map((item, index) => <ContactAtom key={index} item={item} opened={uiOpened} />)
            }
          </div>

          <div className='d-center'>
            <Border />
          </div>

          <Bottom opened={uiOpened}>
            {VERSION}
          </Bottom>

        </div>

      </Container>
    </div>
  )
};

export default RightBar;

function ContactAtom({ item, opened }) {

  const { avatar, username, userAccount, lastOnline } = item;
  const isDifferenceDay = lastOnline ? moment(new Date()).diff(moment(lastOnline), 'days') : 100

  return (
    <Link href={`/sales/${userAccount}`} prefetch={false}>
      <div className="flex d-row mt-10 cursor relative" style={{ alignItems: 'center' }}>
        <div style={{ margin: '0 12px' }}>
          <Image src={UtilService.ConvetImg(avatar)} alt='me' width={36} height={36} style={{ borderRadius: 18 }} />
        </div>
        <Icon src={isDifferenceDay > 7 ? '/img/icons/ic_offline.png' : isDifferenceDay > 1 ? '/img/icons/ic_moon.png' : '/img/icons/ic_online.png'} alt='moon' />
        <Text opened={opened}>
          <Name>{username}</Name>
        </Text>
      </div>
    </Link>
  )
}
