import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import useWindowSize from '../hooks/useWindowSize';
import UtilService from '../sip/utilService';
const LayoutPage = dynamic(() => import('../components/layouts/layoutPage'));

const ForgotPasswordPage = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { Moralis } = useMoralis();
  const { width } = useWindowSize();
  const [email, setEmail] = useState('');
  const { users } = useSelector(state => state.users)

  const isMobile = width < 600;

  const onResetPassword = async () => {
    if (!email) {
      dispatch(addNotification('Email shouldn\'t be null!', 'error'));
      return false
    }
    if (!UtilService.ValidateEmail(email)) {
      dispatch(addNotification('Email is not valid!', 'error'));
      return false
    }

    const selectUser = users.find(i => i.email === email && email);

    if(!selectUser){
      dispatch(addNotification('Email does not exist!', 'error'));
      return false
    }

    Moralis.User.requestPasswordReset(email)
      .then(() => {
        dispatch(addNotification('Request sent successful', 'success'))
        // Password reset request was sent successfully
      }).catch((error) => {
        // Show the error message somewhere
        dispatch(addNotification('Error: ' + error.message, 'error'));
      });
  }

  return (
    <LayoutPage>

      <div className="row mx-0 align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 my-5">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <h3 className="fw-bold mb-2 cursor color-purple-blue f-40" onClick={() => router.push('/', undefined, { shallow: true })}>Metasalt</h3>
              <h2 className="fw-bold my-4 text-white">Forgot Password</h2>

              <div className="form-floating mb-3">
                <input 
                  type="email" 
                  className="form-control my-3" 
                  id="floatingInput" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <label htmlFor="floatingInput" className='color-7'>Email</label>
              </div>

              <div className="btn-submit btn w-full mb-3" onClick={onResetPassword}>Send</div>

              <div className='d-center mt-3'>
                <div className='color-purple fw-6 cursor' onClick={() => router.push('/login', undefined, { shallow: true })}>Log In</div>
                <div className='divider mt-4' />

                <div className='mt-3'>Don't have an account?</div>
                <div className='color-purple fw-6 cursor' onClick={() => router.push('/register', undefined, { shallow: true })}>Sign Up</div>
              </div>

            </div>
          </div>
        </div>
        {!isMobile && <div className="col-md-6 login-img" />}
      </div>
    </LayoutPage>
  )
}

export default ForgotPasswordPage