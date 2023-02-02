import React from 'react';
import { useMoralis } from 'react-moralis';
import UtilService from '../../sip/utilService';
import LayoutModal from '../layouts/layoutModal';

const ModalPriceLacks = ({ onClose, price }) => {

  const { chainId } = useMoralis();

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Add funds to purchase'}
    >

      <div className="divider"/><br/>

      <p className="text-center fw-6 f-20">You need {price} {UtilService.getChain3(chainId)} + <span className="color-sky"> gas fees </span></p>

      <p className="text-center" style={{ fontSize: 18 }}>Transfer funds to your wallet or add funds with a card. It can take up to a minute for your balance to update.</p>

      <div className="divider"/><br/>

      <div className="row" style={{ justifyContent: 'center' }}>

        <div className="offer-btn buy-btn" style={{ width: 200, opacity: 0.4 }}>
          Continue
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalPriceLacks;