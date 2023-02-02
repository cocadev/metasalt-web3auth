import Stream from './Stream'
import Controls from './Controls'
import ChatNdParticipants from './ChatNdParticipants'


function Room() {

  return (
    <div className='room'>
      <div className='room__streamSpace'>
        <Stream />
        <Controls />
      </div>
      <ChatNdParticipants />
    </div>
  )
}

export default Room