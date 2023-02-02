import React from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';
import usePrice from '../../hooks/usePrice';
import { useWeb3Auth } from '../../services/web3auth';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutModal from '../layouts/layoutModal';

const ModalEditPrice = ({ onClose, changedPrice, setChangedPrice, onSuccess }) => {

  const dispatch = useDispatch();
  const { eth: ethPrice, matic: maticPrice } = usePrice();
  const { chain } = useWeb3Auth()
  const price = (chain === 'mumbai' || chain === 'polygon') ? maticPrice : ethPrice;

  const onSave = () => {
    if (changedPrice < 0.0001) {
      dispatch(addNotification('The NFT price shouldn\'t be less than 0.0001 ETH', 'error'))
      return false;
    }
    onSuccess();
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Set price for each NFT'}
    >

      <input
        name="item_name"
        id="item_name"
        className="form-control"
        placeholder="Sale Price"
        type={'number'}
        value={changedPrice}
        min={0.0001}
        onChange={(e) => setChangedPrice(e.target.value)}
      />

      <div>
        {changedPrice > 0.0001 ? (price * (changedPrice))?.toFixed(2) : 0} USD
      </div>

      <div className="spacer-10"></div>

      <div className="row" style={{ justifyContent: 'center' }}>

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div
          className={'offer-btn buy-btn'}
          onClick={onSave}
          style={{ width: 120 }}
        >
          Save
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalEditPrice;
