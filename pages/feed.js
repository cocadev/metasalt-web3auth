import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import renderHTML from 'react-render-html';
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
import moment from 'moment';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import useWindowSize from '../hooks/useWindowSize';
import UtilService from '../sip/utilService';
import { DEMO_AVATAR, GOERLI_MINT721_ADDRESS, MAIN_MINT721_ADDRESS, PROD } from '../keys';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { onLikes } from '../common/web3Api';

const CreatedAt = styled.div`
  font-size: 15px;
  @media only screen and (max-width: 600px){
    font-size: 12px;
  }
`
const Description = styled.div`
  font-size: 19px;
  margin-top: 10px;
  @media only screen and (max-width: 600px){
    font-size: 12px;
  }
`
const Username = styled.div`
  font-size: 19px;
  margin-top: 10px;
  @media only screen and (max-width: 600px){
    font-size: 12px;
  }
`

const FeedPage = () => {

  const { nfts: allData } = useSelector(state => state.nfts);
  const router = useRouter();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState();
  const [trigger, setTrigger] = useState(1);
  const [shareId, setShareId] = useState(-1);
  const [commentId, setCommentId] = useState(-1);
  const stepCount = 10;
  const [loadCount, setLoadCount] = useState(stepCount);
  const { user, Moralis, isAuthenticated, account } = useMoralis();
  
  const TestComments = Moralis.Object.extend('TestComments');
  const { data: orderData } = useMoralisQuery('OrderData', query => query.descending('createdAt'));
  const { data: comments } = useMoralisQuery('TestComments', query => query.limit(100), [trigger], { autoFetch: true });
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('userId', user?.id).equalTo('type', 'nft'), [trigger, user?.id], { autoFetch: true });
  const { users } = useSelector(state => state.users);
  const { width } = useWindowSize();

  const photoUrl = user?.get('avatar') || DEMO_AVATAR;
  const allNFT = allData || [];
  const renderAllNFT = allNFT.map((item, index) => {
    const { image, price, description, chain, isVideo } = JSON.parse(item.metadata);
    const me = users.find(z => (z.account) === item.owner_of);
    const moralisOrderData = orderData.length > 0 && orderData.find(x => x.attributes.tokenId === item.token_id);

    return {
      id: item.token_id,
      username: me?.username || 'Unnamed',
      user_avatar: UtilService.ConvetImg(me?.avatar) || DEMO_AVATAR,
      createdAt: moment(item.synced_at).format('L, LT'),
      poster_url: UtilService.ConvetImg(image),
      description,
      price: moralisOrderData?.attributes?.price || price,
      address: me?.account,
      isVideo,
      chain,
    };
  })

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true });
  }

  const customComments = useMemo(() => {
    return comments?.map(item => {
      const userId = item.attributes.userId;
      const user = users?.find(x => x.account === userId);
      return {
        nftID: item.attributes.nftID,
        username: user?.username,
        avatar: user?.avatar,
        comment: item.attributes.comment
      };
    });
  }, [users, comments]);

  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1)
    }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onLikeNFT = async (e) => {
    const request = { Moralis, itemId: e.id, user, type: 'nft', router, follow: false }
    dispatch(onLikes(request, () => {
      setTrigger(trigger + 1);
    }))
  }

  const onSend = async (e) => {
    if (!isAuthenticated) {
      handleRouters('/wallet');
      return false;
    }
    const testComments = new TestComments();
    testComments.save({
      userId: account,
      nftID: e.id,
      comment: commentText,
    }).then(() => {
      setCommentText('');
      setTrigger(trigger + 1);
      const RealTimeHistory = Moralis.Object.extend('RealTimeHistory');
      const realTimeHistory = new RealTimeHistory();
      realTimeHistory.save({
        account,
        date: new Date(),
        tokenId: e.id,
        tag: 'commented'
      });
    }, () => { });
  }

  return (
    <LayoutPage>
      <LayoutScreen
        title='Feed'
        description="Get to minting NFTs. Otherwise, scroll to view and buy your friend's NFTs."
      >
        <div className='centerpane'>

          <div className='d-row social-pane'>
            {allData?.length > 0 && <div>
              <div className="social-add">
                <Link href='/mynfts' className="d-row" style={{ alignItems: 'center' }} prefetch={false}>
                  <div className="d-row">
                    <div className="profile-avatar-s" style={{ width: 56 }}>
                      <img src={UtilService.ConvetImg(photoUrl)} alt="me" />
                    </div>
                    <p className="mt-3 text20 center-div">Get to minting NFTs. Otherwise, scroll to view and buy your friend's NFTs.</p>
                  </div>
                </Link>
                <div className="center-div m-10 cursor" onClick={() => handleRouters('/makeNFTs')}>
                  <div className="color-sky">CREATE YOUR NFT</div>
                </div>
              </div>

              {renderAllNFT.slice(0, loadCount).map((item, index) => (
                <PostItem
                  key={index}
                  item={item}
                  onLike={() => onLikeNFT(item)}
                  onShare={() => setShareId(item.id)}
                  isLiked={likes.find(c => c.attributes.itemId === item.id)}
                  shareId={shareId}
                  onShareClose={() => setShareId(-1)}
                  photoUrl={photoUrl}
                  onSend={() => onSend(item)}
                  commentText={commentText}
                  onCommentAvailable={() => {
                    setCommentText('');
                    setCommentId(commentId === item.id ? -1 : item.id)
                  }}
                  commentId={commentId}
                  onChangeComment={e => setCommentText(e.target.value)}
                  comments={customComments}
                  width={width}
                  chain={item.chain}
                />
              ))}

              {renderAllNFT.length > loadCount &&
                <div className='p-3 text-center'>
                  <button className='btn btn-outline-info' onClick={() => setLoadCount(loadCount + stepCount)}>
                    Load More
                  </button>
                </div>
              }
            </div>}
          </div>
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
};

export default FeedPage;

function PostItem({ onLike, onShare, isLiked, shareId, onShareClose, photoUrl, onSend, onCommentAvailable, commentText, commentId, onChangeComment, item, comments, width, chain }) {

  const router = useRouter();
  const { poster_url, user_avatar, username, createdAt, description, id, price, address, isVideo } = item;
  const commentLength = comments.filter(x => x.nftID === id).length;
  const token_net = PROD ? 'eth' : 'goerli';
  const token_address = PROD ? MAIN_MINT721_ADDRESS : GOERLI_MINT721_ADDRESS;
  const shareLink = `https://metasalt.io/nftmarketplace/${token_net}/${token_address}/${id}`;

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true });
  }

  return (
    <div className="social-add">
      <div className="d-row cursor" onClick={() => handleRouters(`/sales/${address}`)}>
        <div className="profile-avatar-s">
          <img src={user_avatar} alt="me" />
        </div>
        <div className="ml-10">
          <Username className="text-bold">{username}</Username>
          <CreatedAt>{createdAt}</CreatedAt>
        </div>
      </div>

      <div className="center-div mt-10 cursor" onClick={() => handleRouters(`/nftmarketplace/${token_net}/${token_address}/${id}`)}>
        {poster_url && !isVideo && <img src={poster_url} alt='nft' style={{ maxWidth: width > 600 ? 400 : 210 }} />}
        {poster_url && isVideo && <video src={poster_url} style={{ maxHeight: width > 600 ? '60%' : '80%', maxWidth: width > 600 ? '60%' : '80%' }} controls />}
      </div>

      <Description>
        {(description && renderHTML(UtilService.convertEmoji(description)))}
      </Description>

      <div className="center-div mobile-hidden" style={{ justifyContent: 'space-between' }}>
        <p className="text20 ">
          <img style={{ width: 24, height: 24 }} src={UtilService.CurrencyIcon(token_address)} alt="ether" /> {price}
        </p>
        <div className="btn-main " onClick={() => handleRouters(`/nftmarketplace/${token_net}/${token_address}/${id}`)}>Buy</div>
      </div>

      {commentLength > 0 && <div className="text-end">{commentLength} comments</div>}

      <div className="divider mt-10" />

      <div className="d-row mobile-hidden">
        <div className="center-div m-10 cursor" onClick={onLike}>
          <span
            aria-hidden="true"
            className={!isLiked ? 'icon_heart_alt' : 'icon_heart'}
            style={{ marginRight: 12, fontSize: 20, color: isLiked ? '#ff343f' : 'grey' }}
          />
          Like
        </div>
        <div className="center-div m-10 cursor" onClick={onCommentAvailable}>
          <span
            aria-hidden="true"
            className="icon_comment"
            style={{ marginRight: 12, fontSize: 20, }}
          />
          Comment
        </div>

        <div className="center-div m-10 cursor" style={{ position: 'relative', zIndex: 1 }} >
          <div onClick={onShare} className="center-div">
            <span
              aria-hidden="true"
              className="social_share"
              style={{ marginRight: 12, fontSize: 20, }}
            />
            <div>Share</div>
          </div>

          {shareId === id && <OutsideClickHandler
            onOutsideClick={() => { onShareClose() }}> <div className="share-overlay flex flex-col">
              <div><WhatsappShareButton url={shareLink}><WhatsappIcon size={25} round /> Whatsapp share</WhatsappShareButton></div>
              <div className="mt-2" ><TwitterShareButton url={shareLink}><TwitterIcon size={25} round /> Twitter share</TwitterShareButton></div>
              <div className="mt-2" ><FacebookShareButton url={shareLink}><FacebookIcon size={25} round /> Facebook share</FacebookShareButton></div>
              <div className="mt-2" ><TelegramShareButton url={shareLink}><TelegramIcon size={25} round /> Telegram share</TelegramShareButton></div>
              <div className="mt-2" ><LinkedinShareButton url={shareLink}><LinkedinIcon size={25} round /> Linkedin share</LinkedinShareButton></div>
              <div className="mt-2" ><EmailShareButton url={shareLink}><EmailIcon size={25} round /> Email share</EmailShareButton></div>
            </div>
          </OutsideClickHandler>}
        </div>
      </div>

      {commentId === id && <div>
        <div className="social-add" style={{ marginTop: 1, marginBottom: -10, position: 'relative' }}>
          <div className="d-row" style={{ alignItems: 'center' }}>
            <img
              src={UtilService.ConvetImg(photoUrl)}
              alt="photo_url"
              onClick={() => handleRouters('/mynfts')}
              style={{ width: 44, height: 44, borderRadius: 22, marginLeft: -14 }}
            />
            <input
              placeholder="Write a public comment..."
              className="ml-4 w-full color-b"
              style={{ background: '#333', border: 'none', padding: 12, borderRadius: 18, fontSize: 18 }}
              value={commentText}
              onChange={onChangeComment}
            />
            {commentText && <button className="btn-main cursor" onClick={onSend} style={{ position: 'absolute', right: 25, padding: '6px 10px' }}>Send</button>}
          </div>
        </div>
        <div>
          {comments && comments.filter(x => x.nftID === id).map((x, key) =>
            <div
              key={key}
              style={{ marginTop: 12, marginLeft: 15 }}
              className="flex flex-row"
            >
              <img
                src={UtilService.ConvetImg(x.avatar) || DEMO_AVATAR}
                alt="photo_url"
                onClick={() => handleRouters('/mynfts')}
                style={{ width: 36, height: 36, borderRadius: 18, marginLeft: -14 }}
              />
              <div style={{ marginLeft: 6, marginTop: -4, color: '#bbb' }}>
                <span style={{ fontSize: 13, marginLeft: 6 }}>{x.username}</span><br />
                <span style={{ background: '#333', padding: '7px 12px', borderRadius: 18, fontSize: 15 }}>{x.comment}</span>
              </div>
            </div>)}
        </div>
      </div>}
    </div>
  )
}