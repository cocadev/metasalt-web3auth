import React from 'react';
import LayoutModal from '../../layouts/layoutModal';

const ModalBrandCollectionError = ({ onClose }) => {

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Create NFT Community'}
      description={'Make sure that you have selected a brand or collection to create nft community.'}
    >
      
      <br/>

      <div className="row" style={{ justifyContent: 'center' }}>

        <div className="offer-btn" onClick={onClose} style={{ width: 100 }}>
          Cancel
        </div>

      </div>

    </LayoutModal>
  );
};

export default ModalBrandCollectionError;