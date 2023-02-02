import React from 'react';
import LayoutModal from '../../layouts/layoutModal';

const ModalBrandCollectionWarning = ({ onClose, onContinue }) => {

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Minting NFT'}
      description={'Do you want to mint this NFT without adding a brand or collection?'}
    >
      
      <br/>

      <div className="row" style={{ justifyContent: 'center' }}>

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div className="offer-btn buy-btn" onClick={onContinue} style={{ width: 200 }}>
          Continue
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalBrandCollectionWarning;