import React from 'react';
import { useWeb3Auth } from '../../../services/web3auth';
import UtilService from '../../../sip/utilService';
import LayoutModal from '../../layouts/layoutModal';

const ModalSwitchNetwork = ({ onClose, network, isOpen }) => {

  const { setChain } = useWeb3Auth();

  const onSwitchNetwork = async() => {
    // await switchNetwork(network);
    setChain(UtilService.getChain5(network))
    onClose();
  }

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Please switch to ${UtilService.getChain2(network)}`}
    >
      
      <br/>
      <p style={{ fontSize: 18 }} className='color-b'>In order to trade items, please switch to {UtilService.getChain2(network)} within your MetaMask wallet.</p>

      <br/>

      <div className="row" style={{ justifyContent: 'center' }}>

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div className="offer-btn buy-btn" onClick={onSwitchNetwork} style={{ width: 200 }}>
          Switch network
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalSwitchNetwork;