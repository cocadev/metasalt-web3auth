import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Offcanvas } from 'react-bootstrap';
import OutsideClickHandler from 'react-outside-click-handler';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import useWindowSize from '../../hooks/useWindowSize';
import LayoutPage from '../../components/layouts/layoutPage';
import CustomPopover from '../../components/custom/CustomPopover';
import ProfileFilterBar from './ProfileFilterBar';
import ProfileLeftMenu from './ProfileLeftMenu';
import ProfileNFTList from './ProfileNFTList';
import ProfileTab from './ProfileTab';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { onLikes } from '../../common/web3Api';
import { Title } from '../../constants/globalCss'
import { DEMO_AVATAR, DEMO_BACKGROUND, PROFILE_BG } from '../../keys';

const Btn = styled.div`
  position: absolute;
  left: 30px;
  margin-top: 30px;

  @media only screen and (max-width: 600px) {
    padding: 3px 12px;
    left: 90px;
    margin-top: 70px;
  }
`

const Icon = styled.img`
  width: 22px;
  height: 22px;
  transition: transform .2s ease-in-out;
`

const Count = styled.div`
  text-align: center;
  font-size: 14px;
  margin-left: 4px;
  color: #aaa
`

const Sales = ({
  realData = [],
  isAll,
  enableLoadMore,
  onLoadMore,
  hiddenMenu,
  loading,
  allCollections = [],
  allLikes = [],
  allOrderData = [],
  allVerifications = [],
}) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useWeb3Auth()
  const { width } = useWindowSize()
  const [isActive, setIsActive] = useState(1)
  const [isBig, setIsBig] = useState(false)
  const [searchKey, setSearchKey] = useState()
  const [accounting, setAccounting] = useState(null)
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [isShare, setIsShare] = useState(false)
  const [trigger, setTrigger] = useState(1)
  const [isCollection, setIsCollection] = useState(null)

  const { Moralis } = useMoralis()
  const { id, collectionId, search } = router.query
  const { users } = useSelector(state => state.users)

  useEffect(() => {
    setTimeout(() => setTrigger(trigger + 1), 1000)
  }, [])

  useEffect(() => {
    if (id) {
      setAccounting(id)
    } else if (collectionId) {
      setIsCollection(collectionId)
    } else {
      setAccounting(user?.account)
    }
  }, [id, collectionId, user?.account])

  useEffect(() => {
    if (search && search?.includes('?search=')) {
      setSearchKey(search?.substring(8).replace(/%20/g, ' '))
    }
  }, [search])

  const follows = useMemo(() => allLikes.filter(item => item?.itemId === id && item?.follow === true && item?.type === 'user'), [allLikes, id])
  const followMe = useMemo(() => allLikes.filter(item => item?.userId === user?._id && item?.itemId === id && item?.follow === true && item?.type === 'user'), [allLikes, user?._id, id])
  const isFollow = followMe.length > 0;

  const collectionData = useMemo(() => allCollections.find(item => item._id === isCollection), [allCollections, isCollection])
  const myInfo = users?.find(item => accounting ? (item.account === accounting) : (item.email === user?.email))
  const username = collectionData?.title || myInfo?.username || '-'
  const avatar = collectionData?.avatar || myInfo?.avatar
  const banner = collectionData?.banner || myInfo?.banner || DEMO_BACKGROUND
  const ethAddress = myInfo?.account
  const myAddress = collectionData?.description || (ethAddress ? (ethAddress?.substr(0, 6) + '...' + ethAddress?.substr(-4)) : '-')
  const shareLink = `https://metasalt.io${router.query}`

  const onSetBig = e => setIsBig(e)
  const onTrigger = () => setTrigger(trigger + 1)

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const handleClose = () => {
    setIsOpenMenu(false)
  }

  const onMessageMe = async () => {
    if (isAuthenticated) {
      const selectedUser = users?.find(u => accounting === u.account)
      if (!selectedUser) return;
      handleRouters(`/chat?new=${selectedUser.id}`)
    } else {
      handleRouters('/login')
    }
  }

  const onFollowUser = async () => {
    const request = { Moralis, itemId: id, user, type: 'user', router, follow: true }
    dispatch(onLikes(request, () => onTrigger()))
  }

  return (
    <LayoutPage>
      {!isAll &&
        <div className='position-relative'>
          <div
            className='jumbotron breadcumb no-bg'
            style={{ backgroundImage: `url(${UtilService.ConvetImg(banner) || PROFILE_BG})`, backgroundPosition: 'center' }}
          >
            <div className='mainbreadcumb' />
          </div>
  
          {isCollection && user?.account === collectionData?.creatorId &&
            <Btn Edit className='btn btn-primary ml-2' onClick={() => handleRouters(`/edit/collection/${isCollection}`)} />
          }

          <div className='share-btn mobile-hidden' style={{ position: 'absolute', right: 30, marginTop: 30 }}>
            <span aria-hidden="true" className="social_share color-7" onClick={() => setIsShare(true)} />
            <span aria-hidden="true" className="icon_cog color-7" onClick={() => handleRouters('/settings')} />

            {isShare &&
              <OutsideClickHandler onOutsideClick={() => setIsShare(false)}>
                <div className="share-overlay flex flex-col">
                  <div><WhatsappShareButton url={shareLink}><WhatsappIcon size={25} round /> Whatsapp share</WhatsappShareButton></div>
                  <div className="mt-2"><TwitterShareButton url={shareLink}><TwitterIcon size={25} round /> Twitter share</TwitterShareButton></div>
                  <div className="mt-2"><FacebookShareButton url={shareLink}><FacebookIcon size={25} round /> Facebook share</FacebookShareButton></div>
                  <div className="mt-2"><TelegramShareButton url={shareLink}><TelegramIcon size={25} round /> Telegram share</TelegramShareButton></div>
                  <div className="mt-2"><LinkedinShareButton url={shareLink}><LinkedinIcon size={25} round /> Linkedin share</LinkedinShareButton></div>
                  <div className="mt-2"><EmailShareButton url={shareLink}><EmailIcon size={25} round /> Email share</EmailShareButton></div>
                </div>
              </OutsideClickHandler>
            }
          </div>
        </div>
      }

      <section>
        {!isAll ?
          <div className='d-center'>
            <div className='profile-avatar'>
              <picture><img src={UtilService.ConvetImg(avatar) || DEMO_AVATAR} alt='avatar' /></picture>
              <br />
            </div>

            <h2 className='color-b'>{username}</h2>
            <div style={{ marginTop: -7, maxWidth: 500 }} className='text-center color-7'>{myAddress}</div>

            {accounting !== user?.account && !isCollection &&
              <div className='d-row mt-3 align-items-center'>
              <CustomPopover content={isFollow ? 'unfollow' : 'follow'}>
                <div className='btn btn-primary ml-2 d-row' onClick={onFollowUser}>
                  <Icon src={!isFollow ? '/img/ic_unlike.png' : '/img/ic_like.png'} alt="follow" />
                  <Count>{follows.length}</Count>
                </div>
              </CustomPopover>

              <div className='btn btn-primary ml-2' onClick={onMessageMe}>Message Me</div>
            </div>
            }
          </div>
          :
          <div className='text-center'>
            <Title>{'Buy/Sell'}</Title>
          </div>
        }

        <div>
          <ProfileTab {...{ realData, isActive, setIsActive }} />
          <div className='d-row'>
            {!hiddenMenu &&
              <>
                {width > 850 && <ProfileLeftMenu />}
                {width <= 850 &&
                  <Offcanvas style={{ background: '#1a1a1a', width: 340 }} show={isOpenMenu} placement='start' onHide={handleClose}>
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title className="color-b">Filter</Offcanvas.Title>
                    </Offcanvas.Header>
                    <ProfileLeftMenu />
                  </Offcanvas>
                }
                {width <= 850 &&
                  <picture>
                    <img
                      src="/img/menu.png"
                      className="cursor position-absolute"
                      alt=""
                      style={{ width: 40, left: 12, marginTop: -12 }}
                      onClick={() => setIsOpenMenu(!isOpenMenu)}
                    />
                  </picture>
                }
              </>
            }

            <div className='w-100'>
              <ProfileFilterBar {...{ onSetBig, isBig }} />
              <ProfileNFTList
                {...{
                  isLoading: false,
                  isActive,
                  realData,
                  searchKey,
                  isBig,
                  enableLoadMore,
                  onLoadMore,
                  loading,
                  allOrderData,
                  allVerifications,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </LayoutPage>
  )
};

export default Sales;
