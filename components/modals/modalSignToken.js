import React from 'react';
import Modal from 'react-modal';
import { useMoralis } from 'react-moralis';

import useWindowSize from '../../../hooks/useWindowSize';

const ModalSignToken = ({ onClose }) => {

  const { width } = useWindowSize();
  const router = useRouter();
  const { Moralis, account } = useMoralis();

  const onSwitchNetwork = async () => {

    onClose();

    const TermsAccepted = Moralis.Object.extend('SupportedTransactionsAccepted');
    const termsAccepted = new TermsAccepted();
    termsAccepted.save({
      owner: account,
      agreed: true
    })

    router.push('/$metasalttokens', undefined, { shallow: true });
  }

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={width > 900 ? windowStyles : mobileStyles}
    >
      <span
        aria-hidden="true"
        className="icon_close_alt2 right-icon"
        onClick={onClose}
      />

      <h3 className="text-center color-b">Connect to see your balances</h3>

      <div className="divider" /><br />

      <p style={{ fontSize: 17, color: '#bbb', fontWeight: '600' }}>Supported transactions:</p>

      <p style={{ fontSize: 14, color: '#bbb' }}>

        Buy and sell $METASALT tokens on Uniswap<br />
        Buy Ethereum using a Credit Card by clicking on the Fiat link <br />
        Carefully read all messages when making transactions. <br /><br />
        To proceed click "I agree"
      </p>


      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="offer-btn buy-btn" onClick={onSwitchNetwork} style={{ width: 120, height: 40 }}>
          I agree
        </div>
      </div>

    </Modal>
  );
};

export default ModalSignToken;

const windowStyles = {
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    width: 580,
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
  },
};

const mobileStyles = {
  content: {
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#000',
    height: 500,
    width: 'calc(100% - 30px)',
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
  },
};