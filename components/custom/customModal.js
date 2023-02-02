import LayoutModal from '../layouts/layoutModal';

const CustomModal = ({ title, description, onClose, onApprove }) => {

  return (
    <LayoutModal title={title} isOpen={true} onClose={onClose}>
      <p className="text-center color-b">{description}</p>

      <div className="row justify-center mt-5">

        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div
          className={'offer-btn buy-btn'}
          onClick={onApprove}
          style={{ width: 150 }}
        >
          OK
        </div>
      </div>

    </LayoutModal>
  );
}

export default CustomModal;
