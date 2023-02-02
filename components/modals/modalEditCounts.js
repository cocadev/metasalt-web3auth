import React from 'react';
import LayoutModal from '../layouts/layoutModal';

const ModalEditCounts = ({ onClose, saleCounts, setSaleCounts, onSuccess, maxValue }) => {

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Select lot size'}
      description={'number of NFTs per purchase'}
    >

      <input
        name="item_name"
        id="item_name"
        className="form-control"
        placeholder="Sale Price"
        type={'number'}
        value={saleCounts}
        onChange={(e) => setSaleCounts(e.target.value)}
        min={1}
        max={maxValue}
      />

      <div className="spacer-10"></div>

      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div className={`offer-btn buy-btn ${(maxValue < saleCounts) && 'btn-disabled'}`} onClick={onSuccess} style={{ width: 200 }}>
          Save
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalEditCounts;
