import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useSelector } from 'react-redux';
import InputEmoji from 'react-input-emoji';
import styled from 'styled-components';

const Box = styled.div`
  background: #36393f; 
  display: flex;
  flex-direction: column;
  color: #bbb;
  padding: 1.5rem !important;
  width: 100%;
  @media only screen and (max-width: 768px) {
    padding: 5px!important;
  }

`

const Container = styled.div`
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  flex: 1;
  @media only screen and (max-width: 768px) {
    max-height: calc(100vh - 350px);
  }
`

const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 23px; 
  margin: 4px;
  @media only screen and (max-width: 768px) {
    width: 26px;
    height: 26px;
    border-radius: 13px; 
    margin: 2px;
  }
`

const UserName = styled.div`
  color: #F6931A!important;
  font-weight: 600;
  font-size: 20px;
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
`

const Text = styled.div`
  max-width: 700px;
  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`

const ChatList = ({ chatId }) => {

  const router = useRouter();
  const serverId = router.query.server;
  const { Moralis, account } = useMoralis();
  const [textMessage, setTextMessage] = useState('');
  const [trigger, setTrigger] = useState(0);
  const { users } = useSelector(state => state.users)
  const { data: chats } = useMoralisQuery('DiscourseChannels', query => query.equalTo('objectId', chatId), [chatId]);
  const { data: msgs } = useMoralisQuery('DiscourseMessages', query => query.equalTo('chatId', chatId), [chatId, trigger]);
  const { title } = chats[0]?.attributes || '-';

  const ownerMap = useMemo(() => [], []);
  users.forEach(x => ownerMap[x.account] = x);
  const getOwner = useCallback((user) => ownerMap[user], [ownerMap])

  useEffect(() => {
    setTextMessage('')
  }, [])

  const onSendMessage = async () => {
    setTextMessage('');

    const DiscourseMessages = Moralis.Object.extend('DiscourseMessages');
    const messages = new DiscourseMessages();
    const request = {
      owner: account,
      msg: textMessage,
      serverId,
      chatId
    }
    console.log(textMessage);
    await messages.save(request);
    setTrigger(trigger + 1);
  }

  return (
    <Box>
      <Text className='f-20 text-bold'># {title}</Text>

      <Container>
        <div className='w-full'>
          {msgs.map((item, index) => {
            const isMe = item.attributes.owner === account;
            const owner = getOwner(item.attributes.owner);
            return <div key={index} className={`${!isMe ? 'd-row' : 'd-row-reverse'} m-2`} >
              <div style={{ justifyContent: !isMe ? 'flex-start' : 'flex-end', flexDirection: !isMe ? 'row' : 'row-reverse', display: 'flex' }}>
                <Avatar src={owner?.avatar} alt='avatar' />
                <div className='ml-2 mr-2'>
                  <UserName style={{ textAlign: isMe ? 'right' : 'left' }}>
                    {owner?.username}
                  </UserName>
                  <Text style={{ maxWidth: 700 }}>{item.attributes.msg}</Text>
                </div>
              </div>
            </div>
          })}
        </div>

      </Container>

      <div>
        <InputEmoji
          type="text"
          style={{ marginBottom: 0 }}
          className="form-control mt-2"
          placeholder="Type a Message"
          value={textMessage}
          onChange={(e) => setTextMessage(e)}
          onEnter={(e) => onSendMessage(e)}
        />

      </div>
    </Box>
  )
}

export default ChatList;