import React from 'react';
import UtilService from '../../sip/utilService';
import LayoutModal from '../layouts/layoutModal';
import styled from 'styled-components';
import ReactTimeAgo from 'react-time-ago';
import { useRouter } from 'next/router';

const Table = styled.div`
  border: 1px solid #444;
  border-radius: 5px;
  width: 100%;
  margin: 5px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #444;
  padding: 12px 20px;

`;

const ModalUnreviewedCollection = (props) => {

  const { amount, collection, creator, createdAt, onClose, onAccept, isShow } = props;
  const router = useRouter();
  const { id } = router.query;

  return (
    <LayoutModal
      isOpen={isShow}
      title="This is an unreviewed collection"
      onClose={onClose}
    >
      <div className="d-center">

        <img src='/img/icons/review-collection.webp' alt='' style={{ width: 170 }} />

        <br />

        <p className="color-b">
          Review this information to ensure it's what you want to buy.
        </p>

        <Table>
          <Row>
            <div className="f-1">Collection name</div>
            <div className="f-2">{collection || '-'}</div>
          </Row>
          <Row>
            <div className="f-1">Creator</div>
            <div className="f-2">{creator}</div>
          </Row>
          <Row>
            <div className="f-1">Total sales</div>
            <div className="f-2">{'-'}</div>
          </Row>
          <Row>
            <div className="f-1">Total volume</div>
            <div className="f-2">{amount}</div>
          </Row>
          <Row>
            <div className="f-1">Contract address</div>
            <div className="f-2">{UtilService.truncate(id)}</div>
          </Row>
          <Row>
            <div className="f-1">Total items</div>
            <div className="f-2">{'-'}</div>
          </Row>
          <Row>
            <div className="f-1">Created date</div>
            <div className="f-2">
              {createdAt && <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />}
            </div>
          </Row>
        </Table>

        <br/>

        <div style={{ display: 'flex', flexDirection: 'row', }}>
          <input
            type="checkbox"
            id="submit"
            label='I agree'
            style={{ width: 20, height: 20, marginRight: 10 }}
            value={false}
            onClick={onAccept}
          />
          <p>I understand that Metasalt has not reviewed this collection and blockchain transactions are irreversible.</p>
        </div>

      </div>
    </LayoutModal>
  );
};

export default ModalUnreviewedCollection;