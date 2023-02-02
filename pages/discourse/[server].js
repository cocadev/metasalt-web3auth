import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styled from 'styled-components';
import _ from 'underscore';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutGated from '../../components/layouts/layoutGated';
import { DEMO_DEFAULT_AVATAR } from '../../keys';
import UtilService from '../../sip/utilService';

const LayoutPage = dynamic(() => import('../../components/layouts/layoutPage'));
const ChatList = dynamic(() => import('../../components/discourse/chatList'));
const ServerDashboard = dynamic(() => import('../../components/discourse/serverDashboard'));
const ModalCreateChannel = dynamic(() => import('../../components/modals/modalCreateChannel'));

const Container = styled.div`
  display: flex;
  flex-direction: row;
  @media only screen and (max-width: 600px) {
    flex-direction: column
  }
`

const ServerPage = () => {

  const router = useRouter();
  const serverId = router.query.server;
  const dispatch = useDispatch();
  const { account } = useMoralis();2
  const [isCreateModal, setIsCreateModal] = useState();
  const [trigger, setTrigger] = useState(0);
  const [chatId, setChatId] = useState('');
  const { data } = useMoralisQuery('DiscourseServers', query => query.equalTo('objectId', serverId).limit(1), [trigger, serverId]);
  const { thumbnail = DEMO_DEFAULT_AVATAR, addedNFT, title } = data[0]?.attributes || '-';
  const { data: channels } = useMoralisQuery('DiscourseChannels', query => query.equalTo('serverId', serverId), [trigger, serverId]);

  const onChangeChannel = (x) => {
    if(!account) {
      dispatch(addNotification('Please login before visiting our channel!', 'error'));
      return false;
    }
    setChatId(x.id);
  }

  const onCreateChannel = () => {
    if(!account) {
      dispatch(addNotification('Please login before creating our channel!', 'error'));
      return false;
    }
    setIsCreateModal(true);
  }

  return (
    <LayoutPage backHidden>

      {addedNFT && <LayoutGated data={addedNFT} title={title}/>}

      <Container className='h-full2'>

        <div className='color-b p-2' style={{ minWidth: 60, background: '#1c1e1f' }}>
          <div>
            <img className='cursor' onClick={() => router.back()} src="/img/icons/ic_back.png" alt="back" style={{ width: 30 }} />
          </div>
          <img className='mt-2' src={UtilService.ConvetImg(thumbnail)} style={{ height: 46, width: 46, borderRadius: 23 }} alt='thumbnail' />
        </div>

        <div className='color-b p-2' style={{ minWidth: 240, background: '#303136' }}>

          <div className='d-row justify-betwen'>
            <div className='cursor' style={{ fontWeight: '600' }} >CHANNELS</div>
            <div className='cursor' style={{ marginRight: 8 }} onClick={onCreateChannel}>+</div>
          </div>

          <div className='cursor mt-3 flex align-center' style={{ fontWeight: '600' }} onClick={() => setChatId(null)}>
            <img src='/img/icons/ic_clap.png' alt='welcome' style={{ width: 22, marginRight: 5 }}/>
            Welcome
          </div>

          {
            channels.map((item, index) =>
              <div
                className='cursor'
                key={index}
                style={{ marginTop: 4 }}
                onClick={() => onChangeChannel(item)}
              >
                # &nbsp;{item.attributes.title}
              </div>)
          }
        </div>

        {
          chatId
            ? <ChatList {...{ chatId }} />
            : <ServerDashboard {...{ data, isAccess: true }} />
        }
      </Container>

      {
        isCreateModal &&
        <ModalCreateChannel
          onClose={() => setIsCreateModal(false)}
          onSuccess={() => {
            setIsCreateModal(false)
            setTrigger(trigger + 1)
          }}
          serverId={serverId}
        />
      }

    </LayoutPage>
  )
}

export default ServerPage;