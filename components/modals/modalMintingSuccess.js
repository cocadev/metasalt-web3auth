import { useRouter } from 'next/router';
import React from 'react';
import Modal from 'react-modal';
import useWindowSize from '../../../hooks/useWindowSize';

const ModalMintingSuccess = ({ onClose, title, image }) => {

  const { width } = useWindowSize();
  const router = useRouter();

  const onSaveData = async () => {
    onClose();
    router.push('/mynfts', undefined, { shallow: true });
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

      <h3 className="text-center color-sky">Your created {title}</h3>

      <p className="text-center color-7" style={{ fontSize: 20, fontWeight: '500' }}>Woot! You just created {title}</p>

      <br />

      <div className="d-center">
        <img src={image} alt="" style={{ maxHeight: 400, maxWidth: 480, borderRadius: 8 }}/>
      </div>

      <div className="row mt-5" style={{ justifyContent: 'space-around' }}>

        <input
          type="button"
          value="Go to Sales"
          onClick={onSaveData}
          className='btn-main'
          style={{ background: '#0075ff', marginLeft: 10 }}
        />
      </div>

    </Modal>
  );
};

export default ModalMintingSuccess;

const windowStyles = {
  content: {
    background: '#111',
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#222',
    width: 580,
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
    padding: 20
  },
};
const mobileStyles = {
  content: {
    background: '#111',
    top: '40%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#222',
    height: 550,
    width: 'calc(100% - 30px)',
    border: '4px solid #8365e2',
    borderRadius: 12,
    zIndex: 9999,
    padding: 20
  },
};
