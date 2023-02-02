import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import { SIGNIN_MESSAGE } from '../keys';


const WalletPage = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { Moralis, account, authenticate, isAuthenticated } = useMoralis();
  const { users } = useSelector(state => state.users);

  const onLink = useCallback(async () => {
    if (!window.ethereum) {
      dispatch(addNotification('🦊 You must install Metamask in your browser.', 'error', 'metamask'))
      return false;
    }
    if (isAuthenticated) {
      if (account) {
        const duplicatedUser = users.find(item => item.account === account)

        if (duplicatedUser) {
          dispatch(addNotification('Account already exists (' + duplicatedUser?.username + ')! Please choose another wallet address in Metamask!', 'error'));
          return false;
        }

        await Moralis.link(account)
          .then(res => {
            router.push('/makeNFTs', undefined, { shallow: true });
            window.location.reload();
          })
          .catch(e => {
            dispatch(addNotification(e.message, 'error'))
          });

      } else {
        dispatch(addNotification('🦊 Please connect the wallet to this website manually, and refresh the page!', 'error'))
      }
    } else {
      authenticate({ signingMessage: SIGNIN_MESSAGE });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <LayoutPage>
      <div className="row mx-0 align-items-center" style={{ height: '97.5vh' }}>
        <div className="col-md-6 my-5">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <h3 className="fw-bold mb-2 cursor color-purple-blue f-40" onClick={() => router.push('/', undefined, { shallow: true })}>Metasalt</h3>
              <h2 className="fw-bold my-4 text-white">Link your wallet to continue</h2>

              <div className="btn-primary btn w-full mb-3" onClick={onLink}> 🦊 Link</div>
              <div className='mt-3 color-7 text-center cursor' onClick={()=>router.back()}>Go Back</div>

            </div>
          </div>
        </div>
        <div className="col-md-6 login-img" />
      </div>
    </LayoutPage>
  )
}

export default WalletPage