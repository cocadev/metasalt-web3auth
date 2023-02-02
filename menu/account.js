import { useRouter } from 'next/router';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { useMoralis } from 'react-moralis';
import Address from './address';
import Blockie from './blockie';
import { getExplorer } from './networks';
import { getEllipsisTxt } from './formatters';
import ModalTerms from '../components/modals/modalTerms';
import { IcWallet1 } from '../common/icons';

const Accounting = styled.div`
  height: 35px;
  padding: 0 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  border-radius: 6px;
  background-color: #8365e2;
  cursor: pointer;
  &:hover {
    background: #1a7df6;
  }
`

const styles = {
  text: {
    color: '#fff',
    fontWeight: '600',
    paddingTop: 15
  },
  metamask: {
    border: '1px dashed grey',
    borderRadius: 12,
    padding: 20,
    cursor: 'pointer'
  }
};
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#eee',
    width: 360,
    border: '4px solid #8365e2',
    borderRadius: 12
  },
};

function Account() {

  const router = useRouter();
  const { isAuthenticated, account, chainId } = useMoralis();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal, setIsModal] = useState(false);


  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const handleLogin = async () => {}

  if (!isAuthenticated) {
    return (
      <div style={styles.metamask} onClick={handleLogin}>
        <picture>
          <img src={IcWallet1.src} alt="metamask" />
        </picture>
      </div>
    );
  }

  return (
    <>
      <Accounting onClick={() => handleRouters('/')}>
        <p style={{ marginRight: '5px', ...styles.text }}>{getEllipsisTxt(account, 6)}</p>
        <Blockie currentWallet scale={3} />
      </Accounting>

      {
        isModal &&
        <ModalTerms
          onClose={() => setIsModal(false)}
          onGo={() => {
            setIsModal(false);
            handleRouters('/mynfts')
          }}
        />
      }

      <Modal
        isOpen={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        style={customStyles}
      >
        <h3 className="text-center">Account</h3>
        <div
          style={{
            marginTop: '10px',
            borderRadius: '1rem',
          }}
        >
          <Address avatar="left" size={6} copyable style={{ fontSize: '20px' }} />
          <div style={{ marginTop: '10px', padding: '0 10px' }}>
            <a href={`${getExplorer(chainId)}/address/${account}`} target="_blank" rel="noreferrer">
              View on Explorer
            </a>
          </div>
        </div>
        <br />
        <button
          type="primary"
          className="btn-main w-100"
          style={{
            marginTop: '10px',
            borderRadius: '0.5rem',
            fontSize: '16px',
            fontWeight: '500',
            background: 'red'
          }}
          onClick={() => setIsModalVisible(false)}
        >
          Disconnect Wallet
        </button>
      </Modal>
    </>
  );
}

export default Account;
