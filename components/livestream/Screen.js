import React from 'react';
import {
  selectLocalPeer,
  selectPeers,
  selectScreenShareByPeerID,
  useHMSActions,
  useHMSStore,
} from '@100mslive/react-sdk';
import VideoTile from './VideoTile';


const Screen = ({ presenter }) => {

  const hmsActions = useHMSActions();
  const screenRef = React.useRef(null);
  const screenTrack = useHMSStore(selectScreenShareByPeerID(presenter.id));

  const peers = useHMSStore(selectPeers)
  const localPeer = useHMSStore(selectLocalPeer)

  React.useEffect(() => {
    (async () => {
      if (screenRef.current && screenTrack) {
        if (screenTrack.enabled) {
          await hmsActions.attachVideo(screenTrack.id, screenRef.current);
        } else {
          await hmsActions.detachVideo(screenTrack.id, screenRef.current);
        }
      }
    })();
  }, [hmsActions, screenTrack]);

  return (
    <div className="w-100 h-100 overflow-hidden position-relative">
      <video
        ref={screenRef}
        autoPlay={true}
        playsInline
        muted={false}
        className={`object-cover h-full w-full ${presenter.isLocal ? 'local' : ''}`}
      />
      <div className='screenShare-camera'>
        {
          localPeer?.roleName === 'broadcaster' && peers.filter((peer) => peer.roleName === 'broadcaster').map((peer) => (
            <VideoTile key={peer.id} peer={peer} peers={peers} />
          ))
        }
      </div>
    </div>
  );
};

export default Screen;
