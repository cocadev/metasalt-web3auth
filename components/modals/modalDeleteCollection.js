import React from 'react';
import Modal from 'react-modal';
import { useMoralis } from 'react-moralis';
import { toast } from 'react-toastify';
import useWindowSize from '../../hooks/useWindowSize';

const ModalDeleteCollection = ({ onClose, collectionId, onSuccess }) => {

  const { Moralis } = useMoralis();
  const { width } = useWindowSize();

  const onDeleteCollection = async () => {
    const BrandsQuery = new Moralis.Query('Brands');
    BrandsQuery.equalTo('objectId', collectionId);
    const object = await BrandsQuery.first();
    object.destroy().then(() => {
      onSuccess();
      onClose();
      toast('Remove successful')
    }, () => {
    });
  }

  return (
    <Modal isOpen={true} onRequestClose={onClose} style={width > 900 ? windowStyles : mobileStyles}>
      <span className="icon_close_alt2 right-icon" onClick={onClose} aria-hidden="true"></span>
      <h3 className="text-center color-b">Are you sure about removing this collection?</h3>
      <br />

      <div className="row justify-content-around">
        <input
          type="button"
          value="Delete"
          onClick={onDeleteCollection}
          className='btn-main'
          style={{ background: 'red', marginLeft: 10 }}
        />
        <input
          type="button"
          value="Cancel"
          onClick={onClose}
          className='btn-main'
          style={{ background: '#888', marginLeft: 10 }}
        />
      </div>
    </Modal>
  );
};

export default ModalDeleteCollection;

const windowStyles = {
  content: {
    top: '55%',
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
    padding: 20
  }
};

const mobileStyles = {
  content: {
    top: '55%',
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
    padding: 20
  }
};
