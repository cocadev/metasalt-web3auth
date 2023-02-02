import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import UtilService from '../sip/utilService';
import {
  IcAndroid,
  IcChat,
  IcDiscord,
  IcFeed,
  IcInstagram,
  IcInvite,
  IcIos,
  IcMusic,
  IcNFT,
  IcPeople,
  IcStream,
  IcTiktok,
  IcTwitter,
  IcVideo,
  IcYoutube
} from '../common/icons';
import useWindowSize from '../hooks/useWindowSize';
import { useWeb3Auth } from '../services/web3auth';

const Container = styled.div`
  width: ${props => props.disabled ? 0 : (props.opened ? 200 : 70)}px;
  background: #1c1c26;
  height: 100vh;
  position: fixed;
  z-index: 10;
  margin-top: 75px;
  overflow: auto;
  max-height: calc(100% - 75px);
  transition: all 0.3s ease-in-out;
  box-shadow: 1px 0 4px 0 rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 600px) {
    margin-top: 40px;
    max-height: calc(100% - 40px);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${props => props.opened ? 13 : 0}px;
  margin-top: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  flex-direction: ${props => props.opened ? 'row' : 'column'};

  img {
    max-width: 21px;
    max-height: 21px;
  }
`;

const Title = styled.p`
  text-transform: uppercase;
  font-size: ${props => props.opened ? 12 : 12}px;
  color: #fff;
  margin-top: 20px;
  margin-bottom: 8px;
  margin-left: ${props => props.opened ? 12 : 0}px;
  text-align: ${props => props.opened ? 'left' : 'center'};
  font-family: 'Inter', sans-serif;
`;

const Note = styled.div`
  font-weight: 400;
  font-size: ${props => props.opened ? 16 : 0}px;
  color: #B5B5BE;
  margin-left: ${props => props.opened ? 12 : 0}px;
  text-align: center;
`;


const Version = styled.div`
  padding: 2px 8px;
  border-radius: 5px;
  background: #333;
  bottom: 8px;
  right: 6px;
  font-size: 13px;
  color: #fff;
  margin: 5px;
  text-align: center;
  cursor: pointer;
`

const Social = styled.div`
  border: 1px solid #555;
  border-radius: 4px;
  padding: 5px 3px;
  color: #999;
  font-size: ${props => props.opened ? 11 : 0}px;
  width: ${props => props.opened ? 92 : 30}px;
  margin: 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  div {
    margin-left: 5px;
  }

  img {
    max-width: 21px;
    max-height: 21px;
  }

  &:hover {
    background: #111;
  }
`
const UsersIcon = styled.div`
  background: #333;
  position: fixed;
  z-index: 2;
  margin-top: 55px;
  left: 5px;
  bottom: 6px;
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

const Sidebar = () => {

  const router = useRouter();
  const { isAuthenticated } = useWeb3Auth();
  const { pathname } = router;
  const [initialHover, setInitialHover] = useState(false);
  const isDisable = UtilService.disableHeader(pathname);
  const { width } = useWindowSize();
  const isMobile = width < 600;

  if (isDisable) {
    return false;
  }

  const uiOpened = isMobile ? true : initialHover;

  return (
    <div className='position-relative'>

      <UsersIcon onClick={() => setInitialHover(true)}>
        <span className='icon_menu f-24' />
      </UsersIcon>

      <Container
        opened={uiOpened}
        disabled={isMobile && !initialHover}
        onMouseOver={() => setInitialHover(true)}
        onMouseLeave={() => setInitialHover(false)}
      >

        {isMobile && <span className='icon_close f-20 color-white mr-2' style={{ position: 'absolute', right: 0, top: 18 }} onClick={() => setInitialHover(false)} />}

        {MENU.map((item, index) => {
          if (!isAuthenticated && item.auth) {
            return null
          }
          return (
            <div key={index}>
              <Title opened={uiOpened}>{item.title}</Title>
              {item.contents.map((x, key) => {
                if (!isAuthenticated && x.auth) return false;
                return (
                  <Row key={key} opened={uiOpened} onClick={() => x.href ? window.open(x.href, '_blank') : router.push(x.link, undefined, { shallow: true })}>
                    <picture>
                      <img src={x.icon.src} alt='icon' width={21} height={21} />
                    </picture>
                    <Note opened={uiOpened}>{!uiOpened ? (x.mTitle || x.title) : x.title}</Note>
                  </Row>
                )
              })}
            </div>
          )
        })}
        <div style={{ flex: 1, display: 'flex' }} />

        <div className='flex flex-row flew-wrap justify-center'>
          {socials.map((item, index) =>
            <Link href={item.link} key={index}>
              <a target='_blank' rel="noopener" className={!item.link ? 'btn-disabled' : ''}>
                <Social opened={uiOpened}>
                  <picture>
                    <img src={item.icon.src} alt='icon' width={20} height={20} />
                  </picture>
                  <div>{item.title}</div>
                </Social>
              </a>
            </Link>
          )}
        </div>
        <Version onClick={() => router.push('/', undefined, { shallow: true })}>Go to Landing</Version>
      </Container>
    </div>
  )
};

export default Sidebar;

const socials = [
  { icon: IcIos, title: 'iOS App', link: '', },
  { icon: IcAndroid, title: 'Android', link: '' },
  { icon: IcTiktok, title: 'TikTok', link: 'https://www.tiktok.com/@metasalt.io' },
  { icon: IcYoutube, title: 'Youtube', link: 'https://www.youtube.com/watch?v=qHTp3KuefiE&ab_channel=METASALT' },
  { icon: IcTwitter, title: 'Twitter', link: 'https://twitter.com/metasalt_io' },
  { icon: IcInstagram, title: 'Instagram', link: 'https://www.instagram.com/metasalt.io/' },
];

const MENU = [
  {
    title: 'Explore',
    contents: [
      { icon: IcPeople, title: 'Communities', mTitle: 'Gate', link: '/nftcommunities' },
      { icon: IcChat, title: 'Chat', link: '/chat', auth: true },
      { icon: IcStream, title: 'LiveStream', link: '/livestream', auth: true },
      { icon: IcVideo, title: 'Videos', link: '/videos' },
      { icon: IcMusic, title: 'Music', link: '/music' },
      { icon: IcDiscord, title: 'Discourse', mTitle: 'Dis', link: '/discourse' },
    ],
  },
  {
    title: 'Market',
    contents: [
      { icon: IcNFT, title: 'Popular NFTs', link: '/nftmarketplace' },
      { icon: IcFeed, title: 'Feed', link: '/feed' },
      { icon: IcInvite, title: 'Invite Friends', link: '/invite', auth: true },
      { icon: IcInvite, title: 'web3auth', link: '/web3auth' },
    ],
  },
];
