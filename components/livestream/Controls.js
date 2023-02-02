import { useRouter } from 'next/router';
import {
  VideocamOutlined,
  VideocamOffOutlined,
  MicNoneOutlined,
  MicOffOutlined,
  LogoutOutlined,
  PodcastsOutlined,
  StopCircleOutlined,
  ScreenShareOutlined,
} from '@mui/icons-material';
import { IconButton, Button } from '@mui/material';
import { selectHLSState, useHMSActions, useHMSStore } from '@100mslive/react-sdk'
import { selectIsLocalAudioEnabled, selectIsLocalVideoEnabled, selectLocalPeer } from '@100mslive/react-sdk'
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { endActiveRoom } from '../../common/api';


function Controls() {

  const router = useRouter()
  // const { managementToken } = useContext(AppContext)
  const managementToken = null;
  const hmsActions = useHMSActions()
  const hlsState = useHMSStore(selectHLSState)
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled)
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled)
  const localPeer = useHMSStore(selectLocalPeer)

  const dispatch = useDispatch()

  const roomId = router.query.roomId

  const startHLSStreaming = async () => {
    try {
      await hmsActions.startHLSStreaming()
    } catch (err) {
      dispatch(addNotification('Failed to start', 'error'))
    }
  }

  const stopHLSStreaming = async () => {
    try {
      await hmsActions.stopHLSStreaming()
    } catch (err) {
      dispatch(addNotification('Failed to stop', 'error'))
    }
  }

  const startScreenSharing = async () => {
    await hmsActions.setScreenShareEnabled(true)
  }

  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!audioEnabled);
  }

  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!videoEnabled);
  }


  const leaveRoom = async () => {
    await endActiveRoom(managementToken, roomId)
    try {
      if (localPeer?.roleName === 'broadcaster') {
        await hmsActions?.leave()
        await hmsActions?.stopHLSStreaming()
      } else {
        await hmsActions?.leave()
      }
      await router.push('/livestream', undefined, { shallow: true })
    } catch (e) {
      await router.push('/livestream', undefined, { shallow: true })
    }
  }


  return (
    <div className='controls'>
      {localPeer?.roleName === 'broadcaster'
        ? <>
          <IconButton onClick={startScreenSharing}>
            <ScreenShareOutlined />
          </IconButton>
          <IconButton onClick={toggleAudio}>
            {audioEnabled
              ? <MicNoneOutlined />
              : <MicOffOutlined />
            }
          </IconButton>
          <IconButton onClick={toggleVideo}>
            {videoEnabled
              ? <VideocamOutlined />
              : <VideocamOffOutlined />
            }
          </IconButton>
          <Button
            variant="contained"
            disableElevation
            className='leave'
            onClick={leaveRoom}
          >
            <LogoutOutlined /> Leave Room
          </Button>
          {hlsState.running
            ? <Button
              variant="contained"
              disableElevation
              className='leave'
              onClick={stopHLSStreaming}
            >
              <StopCircleOutlined /> Stop Streaming
            </Button>
            : <Button
              variant="contained"
              disableElevation
              onClick={startHLSStreaming}
            >
              <PodcastsOutlined /> Go Live
            </Button>
          }
        </>
        : <Button
          variant="contained"
          disableElevation
          className='leave'
          onClick={leaveRoom}
        >
          <LogoutOutlined /> Leave Room
        </Button>
      }
    </div>
  )
}

export default Controls