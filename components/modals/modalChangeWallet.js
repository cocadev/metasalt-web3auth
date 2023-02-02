import React from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import { useDispatch, useSelector } from 'react-redux';
import { useMoralis } from 'react-moralis';
import { addNotification } from '../../store/actions/notifications/notifications';
import UtilService from '../../sip/utilService';
import { SIGNIN_MESSAGE } from '../../keys';
import { useRouter } from 'next/router';
import LayoutModal from '../layouts/layoutModal';

const styles = {
  pane: {
    background: '#0075ff',
    padding: '8px 15px',
    borderRadius: 30,
    color: '#fff',
    margin: 8,
    cursor: 'pointer'
  },
  pane2: {
    border: '1px solid #0075ff',
    borderRadius: 30,
    color: '#bbb',
    padding: '8px 15px',
    margin: 8,
    cursor: 'pointer'
  },
  atom: {
    background: '#0075ff',
    padding: '15px 12px',
    borderRadius: 10,
    color: '#fff',
    margin: 8,
    marginTop: 0,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  atom2: {
    width: 300,
    border: '1px solid #0075ff',
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    margin: 8,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  },
  box: {
    borderRadius: 10,
    padding: '12px',
    marginTop: 40
  }
}

const ModalChangeWallet = ({ newAddress, onClose }) => {

  const { authenticate, Moralis, user } = useMoralis();
  const { width } = useWindowSize();
  const router = useRouter();
  const { users } = useSelector(state => state.users);
  const dispatch = useDispatch();
  const duplicatedUser = users.find(item => item.account === newAddress && newAddress)

  const onRelogin = async () => {

    authenticate({
      signingMessage: SIGNIN_MESSAGE, 
      onSuccess: async (res) => {
        onClose();
      },
      onError: (e) => {
        dispatch(addNotification('Account already exists! Please use email login.', 'error'));
        router.push('/', undefined, { shallow: true });
        onClose();
      }
    });
  }

  const onConnectLink = async () => {

    await Moralis.link(newAddress)
      .then(res => {
        router.push('/mynfts', undefined, { shallow: true });
        window.location.reload();
      })
      .catch(e => {
        dispatch(addNotification(e.message, 'error'))
      });
    onClose();
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'New Wallet Connected'}
    >

      <p className="text-center color-b" style={{ fontSize: 20, fontWeight: '500' }}>You just connected this wallet ({UtilService.truncate(newAddress)})?</p>

      <span className="color-b">You are signed in as: {UtilService.truncate(user?.attributes?.ethAddress)}  ({user?.attributes?.username})</span><br />
      <span className="color-b">You are connected to this wallet: {UtilService.truncate(newAddress)} ({duplicatedUser ? duplicatedUser.username : 'Not used yet'})</span>
      <br></br>
      <br></br>What do you want to do?

      <div style={styles.box}>
        <div className="flex flex-row justify-center">
          {user?.attributes?.ethAddress !== newAddress && <div
            style={styles.atom2}
            onClick={onRelogin}
          >
            <div className="text-center">
              {duplicatedUser ? `Login (${duplicatedUser.username}) account` : `Create a new account with ${UtilService.truncate(newAddress)}`}
            </div>
            {width > 450 && <div className="fw-6" />}
          </div>}

          {!duplicatedUser && !user?.attributes?.ethAddress && <div style={styles.atom2} onClick={onConnectLink}>
            <div className="text-center">Link ({UtilService.truncate(newAddress)}) to my user name.</div>
            {width > 450 && <div className="fw-6" />}
          </div>}

          {user?.attributes?.ethAddress === newAddress && 'btn-disabled' && <div style={styles.atom2} onClick={onClose}>
            <div className="text-center">
              Yay, the accounts match!
            </div>
            {width > 450 && <div className="fw-6" />}
          </div>}

        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalChangeWallet;