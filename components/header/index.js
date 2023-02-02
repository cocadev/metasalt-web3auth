import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OutsideClickHandler from 'react-outside-click-handler';
import { toast, ToastContainer } from 'react-toastify';
import { useMoralisCloudFunction } from 'react-moralis';
import { getMessaging, onMessage } from 'firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../store/actions/users/users';
import { updateLeftSidebar, updateRightSidebar } from '../../store/actions/settings/settings';
import { addNotification, updateBadgeCount } from '../../store/actions/notifications/notifications';
import { firebaseCloudMessaging } from '../../firebase/firebase';
import useWindowSize from '../../hooks/useWindowSize';
import HeaderSearch from './HeaderSearch';
import CustomPopover from '../custom/CustomPopover';
import { Loading } from '../loading';
import UtilService from '../../sip/utilService';
import { getUnReadBadgeCount, loginToBackend, saveUser } from '../../common/api';
import { IcFav, IcLogin, IcStream } from '../../common/icons';
import { DEMO_AVATAR } from '../../keys';
import { useWeb3Auth } from '../../services/web3auth';

const RightWalletSection = dynamic(() => import('../rightWalletSection'));
const ModalChangeWallet = dynamic(() => import('../modals/modalChangeWallet'));

const Container = styled.div`
  position: fixed;
  width: 100%;
  z-index: 100;
  
  @media only screen and (max-width: 600px) {
    box-shadow: -2px 3px 4px 0 rgba(0,0,0,0.75);
  }
`

const HeaderBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background: #1c1c26;
  padding: 0 22px 0 0;
  
  @media only screen and (max-width: 600px) {
    height: 50px
  }
`;

const Headering = styled.div`
  display: flex;
  flex: 1;
  margin-left: 170px;
  @media only screen and (max-width: 1200px) {
    margin-left: 12px;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const UnReadBadge = styled.div`
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 4px;

  position: absolute;
  top: 0;
  left: 10px;
`

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 8px;
`

const IconBook = styled.img`
  width: 44px;
  height: 44px;
  cursor: pointer;
`

const PopBox = styled.div`
  background: #222;
  position: absolute;
  right: 40px;
  top: 60px;
  padding: 16px;
  border: 2px solid #222;
  box-shadow: 1px 1px 3px #333;
  min-width: 200px;
  color: #999;
`

const IMG = styled.img`
  width: 50px;
  @media only screen and (max-width: 600px) {
    width: 30px;
  }
`

const HeaderDefaultIcons = [
  { content: 'Following', icon: '/img/icons/ic_crown.png', alt: 'Following', router: '/following' },
  { content: 'Authentication', icon: '/img/icons/ic_verify.png', alt: 'Authentication', router: '/authentication' },
  { content: 'Ethereum/BTC', icon: '/img/icons/ic_swap.png', alt: 'Ethereum', router: '/buyethereum' },
  { content: '$Metasalt', icon: '/img/icons/ic_meta.png', alt: 'Metasalt', router: '/$metasalttokens' },
  { content: 'History', icon: '/img/icons/ic_notification.png', alt: 'History', router: '/history' },
];

const userAvatar = DEMO_AVATAR;

const Header = function () {

  const router = useRouter()
  const dispatch = useDispatch();
  const { nfts } = useSelector(state => state.nfts);
  const { users } = useSelector(state => state.users);
  const { badgeCount } = useSelector(state => state.notifications);
  const { width } = useWindowSize();

  const [show, setShow] = useState(false);
  const [rewards1, setRewards1] = useState(0);
  const [rewards2, setRewards2] = useState(0);
  const [showChangeWalletModal, setShowChangeWalletModal] = useState(null);
  const [isLoading,] = useState(false);
  const [isPopUpProfile, setIsPopUpProfile] = useState(false);
  const [isPopUpCreator, setIsPopUpCreator] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [payloadData, setPayloadData] = useState(null);
  const { user, isAuthenticated, setUser, login, logout } = useWeb3Auth();

  const { data: userData } = useMoralisCloudFunction('loadUsers');
  const pathname = router.pathname;
  const isDisableHeader = UtilService.disableHeader(pathname);

  const isMobile = useMemo(() => width < 600, [width]);
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  if (mounted) {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      setPayloadData(payload.data);
      toast(payload.notification.body.split('<a')[0], {
        icon: () => <picture><img src={payload.data.image} alt={payload.notification.title} width={40} height={40} style={{ borderRadius: 20 }} /></picture>,
      });
      dispatch(updateBadgeCount(badgeCount + 1));
    });
  }

  const onToastClicked = () => {
    if (payloadData && payloadData.type === 'chat') {
      handleRouters(`/chat?new=${payloadData.sendUserId}`)
    }
  }

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const handleLogin = async () => {
    const loginUser = await login()

    if (loginUser?.idToken) {
      const response = await loginToBackend(loginUser)
      response?.success && setUser(response?.data)
    }
  }

  const handleLogOut = async () => {
    logout().then()
    setUser(null)
    handleRouters('/')
    dispatch(addNotification('Log out successful', 'success'))
  }

  const handleFCMToken = async () => {
    const fcmToken = await firebaseCloudMessaging.tokenInLocalforage()
    await saveUser({
      userId: user?.id,
      userName: user?.username,
      userAvatar: user?.avatar || userAvatar,
      fcmToken,
    })
  }

  const loadUnReadBadgeCount = async () => {
    const badgeCount = await getUnReadBadgeCount({ userId: user?.id })
    dispatch(updateBadgeCount(badgeCount))
  }

  /*
  const onGetVirtualRewards = async () => {
    const RewardsQuery = new Moralis.Query('Rewards');
    RewardsQuery.equalTo('owner', account||user?.id);
    const reward = await RewardsQuery.first();
    const totalRewards = PROD ? (reward?.attributes?.ETH || 0) + (reward?.attributes?.POLYGON || 0) : (reward?.attributes?.GOERLI || 0) + (reward?.attributes?.MUMBAI || 0);
    setRewards1(totalRewards)
  }

  const onGetBalanceOf = async () => {
    const web3 = new Web3(window.ethereum);
    const erc = new web3.eth.Contract(erc20ABI.abi, UtilService.getERC20Address(chainId));
    const res = await erc.methods.balanceOf(account).call();
    setRewards2(res / 1000000000000000000);
  }
  */

  useEffect(() => {
    firebaseCloudMessaging.init().then()
    const setToken = async () => {
      const token = await firebaseCloudMessaging.tokenInLocalforage()
      token && setMounted(true)
    };

    setToken().then();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      handleFCMToken().then()
      loadUnReadBadgeCount().then()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (users?.length === 0 && userData?.length > 0) {
      dispatch(getUserData(userData?.map(item => {
        return {
          id: item.id,
          createdAt: item.attributes.createdAt,
          account: item.attributes.ethAddress,
          avatar: item.attributes.avatar,
          banner: item.attributes.banner,
          GUID: item.attributes.GUID,
          email: item.attributes.email,
          phone: item.attributes.phone,
          username: item.attributes.username,
          twitter: item.attributes.twitter,
          instagram: item.attributes.instagram,
          site: item.attributes.site,
          bio: item.attributes.bio,
        }
      })))
    }
  }, [userData])

  useEffect(() => {
    if (!isMobile) {
      dispatch(updateLeftSidebar(true))
      dispatch(updateRightSidebar(true))
    } else {
      dispatch(updateLeftSidebar(false))
      dispatch(updateRightSidebar(false))
    }
  }, [isMobile])

  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <Container style={{ display: isDisableHeader && 'none' }}>
      {isLoading && <Loading />}
      <ToastContainer autoClose={5000} onClick={onToastClicked} />
      <HeaderBox>

        <Link href='/home' prefetch={false}>
          <div className='cursor d-center' style={{ height: 80, width: isMobile ? 50 : 80 }}>
            <IMG src={IcFav.src} alt='logo' />
          </div>
        </Link>

        <Headering>
          {width > 600 && <HeaderSearch />}
        </Headering>

        <Row>

          <CustomPopover content={'Create'} placement='bottom'>
            <picture>
              <img className='cursor' style={{ width: 22, marginRight: 12 }} src='/img/icons/ic_creator.png' onClick={() => setIsPopUpCreator(true)} alt='following' />
            </picture>
          </CustomPopover>

          {isAuthenticated && HeaderDefaultIcons.map((item, index) => (
            <CustomPopover key={index} content={item.content} placement='bottom'>
              <div className='position-relative'>
                <picture>
                  <img src={item.icon} alt={item.alt} className='cursor' style={{ width: 22, marginRight: 12 }} onClick={() => handleRouters(item.router)} />
                </picture>
                {item.content === 'History' && badgeCount > 0 && <UnReadBadge />}
              </div>
            </CustomPopover>
          ))}

          {isAuthenticated &&
            <Avatar className='cursor' src={UtilService.ConvetImg(user?.avatar || userAvatar || DEMO_AVATAR)} onClick={() => setIsPopUpProfile(true)} alt='profile' />
          }

          {!isAuthenticated &&
            <CustomPopover content={'Login'} placement='bottom'>
              <picture>
                <img className='cursor' style={{ width: 22 }} src={IcLogin.src} alt='login' onClick={handleLogin} />
              </picture>
            </CustomPopover>
          }
        </Row>

        {isAuthenticated &&
          <div style={{ maxWidth: 90 }} className='d-center'>
            <CustomPopover content={'MyNFT'} placement='bottom'>
              <IconBook src='/img/icons/ic_books.png' onClick={login} />
            </CustomPopover>
          </div>}

        {nfts.length > 0 && <Offcanvas style={{ background: '#011011' }} show={show} onHide={handleClose} placement='end'>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className='color-b'>My NFTs</Offcanvas.Title>
          </Offcanvas.Header>
          <RightWalletSection handleClose={handleClose} />
        </Offcanvas>}

        {
          showChangeWalletModal &&
          <ModalChangeWallet
            onClose={() => setShowChangeWalletModal(null)}
            newAddress={showChangeWalletModal}
          />
        }

        {
          isPopUpProfile && isAuthenticated &&
          <OutsideClickHandler
            onOutsideClick={() => {
              setIsPopUpProfile(false);
            }}>
            <PopBox style={{ marginTop: isMobile ? -10 : 0 }}>

              <div className='d-row align-center'>
                <picture>
                  <img src={UtilService.ConvetImg(user?.avatar) || userAvatar || DEMO_AVATAR } alt='' style={{ width: 42, height: 42, borderRadius: 21, marginRight: 6 }} />
                </picture>
                <div>{user?.username}</div>
              </div>

              <div className='mt-2'>Earned $0</div>
              <div>Account Tokens: {rewards1}</div>
              <div>Wallet Tokens: {rewards2}</div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/reward'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_reward.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Reward</span>
              </div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/analysis'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/history.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Analysis</span>
              </div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/mycommunities'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_people.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Communities</span>
              </div>

              {/* <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/chat'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_stream.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Chats</span>
              </div> */}

              {/* <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/createMusic'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_music.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Music</span>
              </div> */}

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/myvideos'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_video.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Videos</span>
              </div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/mymusic'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_music.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Music</span>
              </div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/mydiscourse'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_discord.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Discourse</span>
              </div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/mynfts'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/nft.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>NFTs</span>
              </div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { handleRouters('/settings'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_settings.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Settings</span>
              </div>

              <div className='d-row align-center mt-1 cursor' onClick={() => { window.open('https://academy.metasalt.io/', '_blank'); setIsPopUpProfile(false); }}>
                <Image src='/img/icons/ic_academy.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Academy</span>
              </div>

              <div className='d-row align-center mt-4 cursor' onClick={handleLogOut}>
                <Image src='/img/icons/ic_logout.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Log Out</span>
              </div>

            </PopBox>
          </OutsideClickHandler>}

        {
          isPopUpCreator &&
          <OutsideClickHandler
            onOutsideClick={() => {
              setIsPopUpCreator(false);
            }}>
            <PopBox style={{ right: isAuthenticated ? 120 : 20, marginTop: isMobile ? -10 : 0 }}>

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/makeNFTs'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/nft.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>NFTs</span>
              </div>

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/createNFTcommunities'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/ic_people.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Communities</span>
              </div>

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/create/brand'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/ic_brand.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Brands</span>
              </div>

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/create/collection'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/ic_col.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Collections</span>
              </div>

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/livestream/create'); setIsPopUpCreator(false); }}>
                <Image src={IcStream} alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Live Stream</span>
              </div>

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/create/video'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/ic_video.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Videos</span>
              </div>

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/create/music'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/ic_music.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Music</span>
              </div>

              {/* <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/create/musicChannel'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/ic_music.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Music Channel</span>
              </div> */}

              <div className='d-row align-center mt-2 cursor' onClick={() => { handleRouters('/create/discourse'); setIsPopUpCreator(false); }}>
                <Image src='/img/icons/ic_discord.png' alt='icon' width={20} height={20} />
                <span style={{ marginLeft: 12 }}>Discourse</span>
              </div>

            </PopBox>
          </OutsideClickHandler>}

      </HeaderBox>
    </Container>
  );
}

export default memo(Header);
