import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { useSelector } from 'react-redux';
const CustomPopover = dynamic(() => import('../../../custom/CustomPopover'));
import { SkeletonLoader } from './SkeletonLoader';
import { CreateChannelIcon } from '../../assets';
import { DEMO_AVATAR } from '../../../../keys';
import UtilService from '../../../../sip/utilService';

const MessagingChannelList = ({ children, error = false, loading, onCreateChannel }) => {

  const { client, setActiveChannel } = useChatContext();
  const { id, image, name = 'Example User' } = client.user || {};
  const { users } = useSelector(state => state.users);

  const router = useRouter();
  const newUser = router.query?.new;

  useEffect(() => {
    const getDemoChannel = async (client) => {
      const channel = client.channel('messaging', 'first', { name: 'Metasalt Chat', demo: 'social' });
      await channel.watch();
      await channel.addMembers([client.user.id]);
      
      setActiveChannel(channel);
    };

    if (!loading && !children?.props?.children?.length) {
      // getDemoChannel(client);
    }
  }, [loading]); // eslint-disable-line

  useEffect(() => {
    if (newUser && client) {
      createChannel(newUser)
    }
  }, [newUser, client])

  const createChannel = async (x) => {

    const selectedUser = users?.find(u => x === u.id);

    await client.upsertUser({ 
      id: x, 
      name: selectedUser?.username,
      image: selectedUser?.avatar
   });

    const conversation = await client.channel('messaging', {
      members: [x, client.userID],
    });

    await conversation.watch();

    setActiveChannel(conversation);
  };

  const ListHeaderWrapper = ({ children }) => {
    return (
      <div className='messaging__channel-list'>
        <div className='messaging__channel-list__header'>
          <Avatar image={UtilService.ConvetImg(image) || DEMO_AVATAR} name={name} size={40} />
          <div className='messaging__channel-list__header__name'>
            <CustomPopover content={name || id} placement='bottom'>
              {name || id}
            </CustomPopover>
          </div>
          <button className='messaging__channel-list__header__button' onClick={onCreateChannel}>
            <CreateChannelIcon />
          </button>
        </div>
        {children}
      </div>
    );
  };

  if (error) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
          Error loading conversations, please try again momentarily.
        </div>
      </ListHeaderWrapper>
    );
  }

  if (loading) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
          <SkeletonLoader />
        </div>
      </ListHeaderWrapper>
    );
  }

  return <ListHeaderWrapper>{children}</ListHeaderWrapper>;
};

export default React.memo(MessagingChannelList);
