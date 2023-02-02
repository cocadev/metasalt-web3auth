import React, { useContext, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList } from 'stream-chat-react';
import {
  CreateChannel,
  CustomMessage,
  MessagingChannelList,
  MessagingChannelPreview,
  MessagingInput,
  MessagingThreadHeader,
} from '../components/chat/components';
import { useChecklist } from '../components/chat/ChecklistTasks';
import { ChannelInner } from '../components/chat/components/ChannelInner/ChannelInner';

const urlParams = new URLSearchParams(typeof window !== 'undefined' && window.location.search);

const apiKey = urlParams.get('apikey') || 'cy27vcengxes';
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const skipNameImageSet = urlParams.get('skip_name_image_set') || false;
const noChannelNameFilter = urlParams.get('no_channel_name_filter') || false;
// const filters = noChannelNameFilter ? { type: 'messaging', members: { $in: [user] } } : { type: 'messaging', name: 'Social Demo', demo: 'social' };
const filters = [
  { type: 'team', demo: 'team' },
  { type: 'messaging', demo: 'team' },
];

const options = { state: true, watch: true, presence: true, limit: 8 };

const sort = {
  last_message_at: -1,
  updated_at: -1,
};

if (skipNameImageSet) {
  delete userToConnect.name;
  delete userToConnect.image;
}

export const GiphyContext = React.createContext({});

const AppChat = () => {

  const profile = null;
  // const { profile } = useContext(AppContext)
  const [chatClient, setChatClient] = useState(null);
  const [giphyState, setGiphyState] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileNavVisible, setMobileNav] = useState(false);
  const [theme, setTheme] = useState('dark');
  const { user: metaUser } = useMoralis();

  const client = StreamChat.getInstance(apiKey, {
    enableInsights: true,
    enableWSFallback: true,
  });


  useChecklist(chatClient, targetOrigin);

  useEffect(() => {
    const initChat = async () => {

      const { username, avatar } = metaUser?.attributes || ''

      await client.connectUser(
        {
          id: metaUser.id,
          name: username,
          image: avatar
        },
        client.devToken(metaUser.id),
      );

      if (profile.username !== '' || profile.avatar !== '') {
        await client.upsertUser({
          id: metaUser?.id,
          name: profile.username,
          image: profile.avatar
        })
      }

      setChatClient(client);
    };

    metaUser && initChat()

    return () => chatClient?.disconnectUser();
  }, [metaUser, profile]);

  useEffect(() => {
    const handleThemeChange = ({ data, origin }) => {
      // handle events only from trusted origin
      if (origin === targetOrigin) {
        if (data === 'light' || data === 'dark') {
          setTheme(data);
        }
      }
    };

    window.addEventListener('message', handleThemeChange);
    return () => window.removeEventListener('message', handleThemeChange);
  }, []);

  useEffect(() => {
    const mobileChannelList = document.querySelector('#mobile-channel-list');
    if (isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.add('show');
      document.body.style.overflow = 'hidden';
    } else if (!isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }, [isMobileNavVisible]);

  useEffect(() => {
    /*
     * Get the actual rendered window height to set the container size properly.
     * In some browsers (like Safari) the nav bar can override the app.
     */
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();

    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  

  const toggleMobile = () => setMobileNav(!isMobileNavVisible);

  const giphyContextValue = { giphyState, setGiphyState };

  if (!chatClient) return null;
  if (!metaUser) return null;

  const customChannelTeamFilter = (channels) => {
    console.log('channels: ', channels)
    return channels.filter((channel) => channel.type === 'team');
  };

  return (
    <div style={{ margin: 70, marginBottom: 0 }}>
      <Chat client={chatClient} theme={`messaging ${theme}`}>
        <div id='mobile-channel-list' >
          <ChannelList
            filters={{ type: 'messaging', members: { $in: [metaUser?.id || 1216818] } }}
            sort={sort}
            options={options}
            List={(props) => (
              <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />
            )}
            Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
          />
        </div>
        <div>
          <Channel
            Input={MessagingInput}
            maxNumberOfFiles={10}
            Message={CustomMessage}
            multipleUploads={true}
            ThreadHeader={MessagingThreadHeader}
            TypingIndicator={() => null}
          >
            {isCreating && (
              <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />
            )}
            <GiphyContext.Provider value={giphyContextValue}>
              <ChannelInner theme={theme} toggleMobile={toggleMobile} />
            </GiphyContext.Provider>
          </Channel>
        </div>
      </Chat>
    </div>
  );
};

export default AppChat;