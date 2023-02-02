import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { selectHMSMessages, selectPeers, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import Message from './Message';
import { DEMO_AVATAR } from '../../keys';


function ChatNdParticipants() {

  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState('chat')
  const [message, setMessage] = useState('')
  const messages = useHMSStore(selectHMSMessages)
  const hmsActions = useHMSActions()
  const peers = useHMSStore(selectPeers)
  const { users } = useSelector(state => state.users)
  const dispatch = useDispatch()

  const getPeerAvatar = (peer) => {
    const filtered = users.filter(item => item.username === peer.name)
    return filtered[0]?.avatar
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    hmsActions.sendBroadcastMessage(message)
    setMessage('')
  }
  
  useEffect(() => {
    if (peers.length > 1) {
      const filtered = peers.filter(item => item.roleName === 'broadcaster')
      if (filtered.length === 0) {
        dispatch(addNotification('Broadcaster not exist', 'error'))
        router.push('/livestream', undefined, { shallow: true } ).then()
      }
    }
  }, [peers])

  return (
    <div className='rightBox'>
      <div className='rightBox__head'>
        <span
          onClick={() => setSelectedOption('chat')}
          className={selectedOption === 'chat' ? 'selected' : ''}
        >
          Chat
        </span>
        <span
          className={selectedOption === 'participants' ? 'selected' : ''}
          onClick={() => setSelectedOption('participants')}
        >
          Participants
        </span>
      </div>
      <div className="rightBox__optionView">
        {selectedOption === 'chat' &&
        <>
          <div className="rightBox__chats">
            {/* Messages */}
            {messages.map((msg) => (
              <Message key={msg.id} message={msg}/>
            ))}
          </div>
          <form name='send-messge' onSubmit={handleSubmit}>
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Write your message"
            />
          </form>
        </>
        }
        {selectedOption === 'participants' &&
        <div className="rightBox__participants">
          {peers.map((peer, index) => (
            <div key={index} className='rightBox__participant'>
              <Image src={getPeerAvatar(peer) || DEMO_AVATAR} alt='' layout='fixed' width={40} height={40} className='br-50 p-0' />
              <div className='ms-2 d-flex flex-column participant-content'>
                <h6 className='m-0'>{peer.name}</h6>
                <p className='m-0'>{peer.roleName}</p>
              </div>
            </div>
          ))}
        </div>
        }
      </div>
    </div>
  )
}

export default ChatNdParticipants