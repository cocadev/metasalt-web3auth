import {
  selectIsSomeoneScreenSharing,
  selectLocalPeer,
  selectPeers,
  selectPeersScreenSharing,
  useHMSStore,
} from '@100mslive/react-sdk';
import Screen from './Screen';
import VideoTile from './VideoTile';
import HlsView from './HlsView';


function Stream() {

  const peers = useHMSStore(selectPeers)
  const localPeer = useHMSStore(selectLocalPeer)

  const screenshareOn = useHMSStore(selectIsSomeoneScreenSharing)
  const presenters = useHMSStore(selectPeersScreenSharing)

  return (
    <div className="stream">
      {screenshareOn ?
        <Screen isLocal={false} presenter={presenters[0]} />
        :
        localPeer?.roleName === 'broadcaster' && peers.filter((peer) => peer.roleName === 'broadcaster').map((peer) => (
          <VideoTile key={peer.id} peer={peer} peers={peers} />
        ))
      }

      {localPeer?.roleName === 'hls-viewer' && <HlsView />}
    </div>
  )
}

export default Stream