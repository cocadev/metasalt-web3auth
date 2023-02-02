import React, { useState } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import ModalTransferToken from '../../components/modals/social/modalTransferToken'

const Academy = () => {

  const { account, isAuthenticated } = useMoralis();
  const [isTransferModal, setIsTransferModal] = useState(false);
  const { data } = useMoralisQuery('admin');
  const admins = data.map(t => t.attributes.address?.toLowerCase())
  const isAdmin = account && isAuthenticated && admins.includes(account?.toLowerCase())

  return (
    <LayoutPage>
      <LayoutScreen title='Reward'>
        {isAdmin && <div className='d-center mt-5 color-b flex flex-row'>
          <div
            className={'btn bg-primary mt-4'}
            onClick={() => setIsTransferModal(true)}
          >
            <span className="color-b">Reward Token</span>
          </div>
        </div>}

        {isTransferModal && <ModalTransferToken
          isOpen={isTransferModal}
          onClose={() => setIsTransferModal(false)}
        />}
      </LayoutScreen>
    </LayoutPage>
  );
}

export default Academy;
