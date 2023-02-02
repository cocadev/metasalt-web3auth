import { useRouter } from 'next/router';
import React from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';

const ModalDeleteCommunity = ({ onClose, gatedId }) => {

  const { Moralis } = useMoralis();
  const dispatch = useDispatch();
  const router = useRouter();

  const onDeleteNFT = async () => {

    const NFTGatesQuery = new Moralis.Query('NFTGates');
    NFTGatesQuery.equalTo('objectId', gatedId);
    const object = await NFTGatesQuery.first();

    if (object) {
      object.destroy().then(() => {
        dispatch(addNotification('Remove successful', 'success'));
        onClose();
        router.push('/nftcommunities', undefined, { shallow: true }).then(() => router.reload());
      }, (error) => { });
    } else {
      dispatch(addNotification('Can\'t remove this Community!', 'error'));
      onClose();
    }
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Do you want to remove this Community?'}
    >

      <div className="d-row justify-center mt-5 ">

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <button
          className="btn btn-danger"
          onClick={onDeleteNFT}
          style={{ width: 150 }}
        >
          Remove
        </button>
      </div>

    </LayoutModal>
  );
};

export default ModalDeleteCommunity;