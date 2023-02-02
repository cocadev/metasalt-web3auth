import Link from 'next/link';
import React, { useState } from 'react';
import LayoutModal from '../layouts/layoutModal';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';

const ModalTerms = ({ onClose, onGo, email }) => {

  const { Moralis, account, user } = useMoralis();
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(false);

  const onSaveData = async () => {

    const ownerId = email ? user.id : account;
    const TermsAcceptedQuery = new Moralis.Query('TermsAccepted').equalTo('owner', ownerId);
    const object1 = await TermsAcceptedQuery.first();
    
    if (!object1) {
      const TermsAccepted = Moralis.Object.extend('TermsAccepted');
      const termsAccepted = new TermsAccepted();
      termsAccepted.save({
        owner: ownerId,
        agreed: true
      })
    }
    onGo();
  }

  const onCloseModal = () => {
    router.push('/', undefined, { shallow: true });
    onClose();
  }

  return (
    <LayoutModal
      title={'Welcome to Metasalt!'}
      isOpen={true}
      onClose={onClose}
    >
      <p>By using Metasalt, you agree to the <Link href='/termsOfService' style={{ color: '#0075ff' }} prefetch={false}>Terms of Service.</Link></p>

      <div style={{ display: 'flex', flexDirection: 'row', }}>
        <input
          type="checkbox"
          id="submit"
          label='I agree'
          style={{ width: 20, height: 20, marginRight: 10 }}
          value={isEnabled}
          onChange={e => setIsEnabled(e.target.checked)}
        />
        <p>I agree</p>
      </div>
      <br />

      <div className="row" style={{ justifyContent: 'center' }}>

        <div className="offer-btn" onClick={onCloseModal} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div 
          className={`offer-btn buy-btn ${!isEnabled ? 'btn-disabled' : ''}`} 
          onClick={onSaveData} 
          style={{ width: 200 }} 
        >
          Let's go
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalTerms;