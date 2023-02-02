import { useRouter } from 'next/router';
import React from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';

const ModalDeleteNFT = ({ onClose, isOpen }) => {

  const { Moralis } = useMoralis();
  const dispatch = useDispatch();
  const router = useRouter();
  const { token_id: tokenId } = router.query;

  const onDeleteNFT = async () => {

    const LazyMintsQuery = new Moralis.Query('LazyMints');
    LazyMintsQuery.equalTo('tokenId', tokenId);
    const object = await LazyMintsQuery.first();

    if (object) {
      object.destroy().then(() => {
        dispatch(addNotification('Remove successful', 'success'));
        onClose();
        router.push('/nftmarketplace', undefined, { shallow: true }).then(() => router.reload());
      }, (error) => {
      });
    } else {
      dispatch(addNotification('Can\'t remove this NFT!', 'error'));
      onClose();
    }
  }

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={'Do you want to remove this NFT?'}
    >

      <div className="row justify-center mt-5">

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div
          className={'offer-btn buy-btn bg-red'}
          onClick={onDeleteNFT}
          style={{ width: 150 }}
        >
          Remove
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalDeleteNFT;