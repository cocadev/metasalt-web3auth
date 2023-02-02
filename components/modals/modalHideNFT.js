import { useRouter } from 'next/router';
import React from 'react';
import { useMoralis,  } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';

const ModalHideNFT = ({ onClose, onSucces, isOpen, hidden }) => {

  const { Moralis, account } = useMoralis();
  const dispatch = useDispatch();
  const router = useRouter();
  const { net, token_address, token_id } = router.query;

  const onHideNFT = async () => {

    const HideNFTsQuery = new Moralis.Query('HideNFTs');
    HideNFTsQuery.equalTo('net', net);
    HideNFTsQuery.equalTo('token_address', token_address);
    HideNFTsQuery.equalTo('token_id', token_id);
    const object = await HideNFTsQuery.first();

    if(object){
      object.destroy().then(() => {
        onSucces();
        dispatch(addNotification('Enable successful', 'success'));
        onClose();
      }, (error) => { });
    }else{

      const HideNFTs = Moralis.Object.extend('HideNFTs');
      const hideNFTs = new HideNFTs();
      await hideNFTs.save({
        net, token_address, token_id, owner: account
      })
      onSucces();
      dispatch(addNotification('Hide successful', 'success'));
      onClose();
    }
  }

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Do you want to ${!hidden ? 'hide' : 'enable'} this NFT?`}
    >

      <div className="row justify-center mt-5">

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div
          className={'offer-btn buy-btn bg-secondary'}
          onClick={onHideNFT}
          style={{ width: 150 }}
        >
          {!hidden ? 'Hide' : 'Enable'}
        </div>
      </div>      

    </LayoutModal>
  );
};

export default ModalHideNFT;