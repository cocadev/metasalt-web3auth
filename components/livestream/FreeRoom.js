import { useRouter } from 'next/router';
import YouTube from 'react-youtube';
import { useHMSActions } from '@100mslive/react-sdk';
import { Button } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import ChatNdParticipants from './ChatNdParticipants';

const options = {
  playerVars: {
    autoplay: 1,
  },
}


function FreeRoom() {

  const router = useRouter()

  const hmsActions = useHMSActions()

  const roomId = router.query.roomId;

  const leaveRoom = async () => {
    await hmsActions?.leave()
    await router.push('/livestream', undefined, { shallow: true })
  }

  return (
    <div className='room'>
      <div className='room__streamSpace'>
        <div className="stream">
          <YouTube videoId={roomId} opts={options} className='free-youtube' />
        </div>
        <div className='controls'>
          <Button
            variant="contained"
            disableElevation
            className='leave'
            onClick={leaveRoom}
          >
            <LogoutOutlined /> Leave Room
          </Button>
        </div>
      </div>
      <ChatNdParticipants />
    </div>
  )
}

export default FreeRoom