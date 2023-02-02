import { useRouter } from 'next/router';
import React, { memo, useState } from 'react';
import { useMoralis } from 'react-moralis';
import useWindowSize from '../../hooks/useWindowSize';
import ModalMinting from './modals/modalMinting';
import ModalSignToken from './modals/modalSignToken';

const styles = {
  btn: {
    padding: '3px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginLeft: 6
  }
}

const HeaderSignToken = () => {

  const { isAuthenticated, Moralis, account } = useMoralis();
  const { width } = useWindowSize();
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();

  const onTokenModal = async () => {
    const SupportedTransactionsAcceptedQuery = new Moralis.Query('SupportedTransactionsAccepted').equalTo('owner', account);
    const object1 = await SupportedTransactionsAcceptedQuery.first();
    if (!object1) {
      setIsShow(true);
    } else {
      router.push('/nftmarketplace', undefined, { shallow: true });
    }
  }

  return (
    <div className='flex flex-row'>
      <div 
        style={styles.btn} 
        className={`all-category ${isAuthenticated ? '-mt-6' : ''}`} 
        onClick={()=>router.push('/makeNFTs', undefined, { shallow: true })}
      >
        {width > 550 ? '+ Create NFT' : 'N'}
      </div>
      <div 
        style={styles.btn} 
        className={`all-category ${isAuthenticated ? '-mt-6' : ''}`} 
        onClick={()=>router.push('/createNFTcommunities', undefined, { shallow: true })}
      >
        {width > 550 ? '+ Create NFT Gate' : 'G'}
      </div>
      <div 
        style={styles.btn} 
        className={`all-category ${isAuthenticated ? '-mt-6' : ''}`} 
        onClick={onTokenModal}
      >
        {width > 550 ? '+ Buy $METASALT' : 'M'}
      </div>

      {isShow && <ModalSignToken onClose={() => setIsShow(false)} />}

    </div>
  );
};

export default memo(HeaderSignToken);        