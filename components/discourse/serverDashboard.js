import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEMO_DEFAULT_AVATAR } from '../../keys';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useRouter } from 'next/router';
import UtilService from '../../sip/utilService';
import { onLikes } from '../../common/web3Api';

const ServerDashboard = ({ data, isAccess }) => {

  const router = useRouter();
  const serverId = router.query.server;
  const dispatch = useDispatch();
  const [trigger, setTrigger] = useState(1);
  const { title, description, thumbnail = DEMO_DEFAULT_AVATAR, owner } = data[0]?.attributes || '-';
  const { users } = useSelector(state => state.users)
  const { account, user, Moralis } = useMoralis();
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('itemId', serverId), [trigger, user], { autoFetch: true });
  const isLike = likes.find(item => item.attributes.userId === user?.id);
  
  const ownerMap = useMemo(() => [], []);
  users.forEach(x => ownerMap[x.account] = x);
  const getOwner = useCallback((user) => ownerMap[user], [ownerMap]);
  const creatorName = getOwner(owner);

  const onLikeDiscord = async () => {
    const request = { Moralis, itemId: serverId, user, type: 'discourse', router, follow: false }
    dispatch(onLikes(request, () => {
      setTrigger(trigger + 1);
    }))
  }

  return (
    <div className='color-b p-4 w-full' style={{ background: '#36393f', display: 'flex', flexDirection: 'column' }} >

      <div className='responsive-row align-center'>
        <img
          src={UtilService.ConvetImg(thumbnail)}
          style={{ width: 100, height: 100, borderRadius: 8 }}
          alt='thumbnail'
        />
        <div>
          <div className='f-32 text-bold ml-4'>{title}</div>
          {
            owner === account &&
            <div
              className='btn btn-primary ml-4 mt-2'
              onClick={() => router.push(`/edit/discord/${serverId}`)}
            >
              Edit
            </div>
          }
        </div>
      </div>

      <div onClick={onLikeDiscord} className='mt-3 cursor'>
        <span style={{ marginRight: 12, color: isLike ? '#ff343f' : '#666' }} aria-hidden="true" className="icon_heart"></span>
        {likes?.length || 0} favorites
      </div>

      <div className='mt-3 d-row'>
        <div className='arial'>Name:&nbsp;</div>
        <div>{title}</div>
      </div>

      <div className='d-row'>
        <div className='arial'>Description:&nbsp;</div>
        <div>{description}</div>
      </div>

      <div className='d-row'>
        <span className='arial'>Creator:&nbsp;</span>
        <div>{creatorName?.username}</div>
      </div>

      <div className='d-row'>
        <span className='arial'>Access:&nbsp;</span>
        <div>{isAccess ? 'You can join this discourse server' : 'You don\'t have the NFTs needed to access this content.'}</div>
      </div>

    </div>
  )
}

export default ServerDashboard;