import { useRouter } from 'next/router';
import React  from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';
import { deleteLiveStream } from '../../common/api';


const ModalDeleteRoom = ({ onClose, isOpen }) => {

  const router = useRouter()
  const dispatch = useDispatch()

  const roomId = router.query.roomId

  const onDeleteRoom = async () => {
    const response = await deleteLiveStream({ roomId })
    if (response.success) {
      dispatch(addNotification(response.message, 'success'))
      onClose()
      router.back()
    }
  }

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={'Do you want to remove this Room?'}
    >

      <div className="row justify-center mt-5">

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div
          className={'offer-btn buy-btn bg-red'}
          onClick={onDeleteRoom}
          style={{ width: 150 }}
        >
          Remove
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalDeleteRoom;