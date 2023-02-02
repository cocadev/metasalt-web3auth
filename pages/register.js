import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import useWindowSize from '../hooks/useWindowSize';
import LayoutPage from '../components/layouts/layoutPage';
import { registerNew, sendNotificationToInvite } from '../common/api';

const Account = dynamic(() => import('../menu/account'));


const RegisterPage = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { Moralis } = useMoralis();
  const { width } = useWindowSize();
  const usernameRef = useRef();
  const pwdRef = useRef();
  const repwdRef = useRef();
  const { query } = router;

  const { users } = useSelector(state => state.users);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isEmailMethod, setIsEmailMethod] = useState(true);
  const isMobile = width < 600;

  const isAvailable = password === rePassword && password && rePassword && username && email;


  const handleRouters = async (path) => {
    await router.push(path, undefined, { shallow: true })
  }

  const handleRegister = async () => {
    try {
      await registerNew({ email: username, password }).then(async res => {})
      dispatch(addNotification('Signup Successful!', 'success'))
      handleRouters('/$metasalttokens').then(() => window.location.reload());
    } catch (error) {
      dispatch(addNotification('Error: ' + error.code + ' ' + error.message, 'error'))
    }
  }

  const onRegister = async () => {

    const duplicatedUser = users.find(item => item.username === username)
    const duplicatedEmail = users.find(item => item.email === email && item.email && email)

    if (duplicatedUser) {
      dispatch(addNotification('Username already exists! Please use another one.', 'error'))
      return false;
    }
    if (duplicatedEmail) {
      dispatch(addNotification('Email already exists! Please use another one.', 'error'))
      return false;
    }

    const me = new Moralis.User();
    me.set('username', username);
    me.set('password', password);
    me.set('email', email);
    me.set('GUID', uuidv4());

    try {
      const response = await me.signUp();
      if (query?.invite) {
        const InviteFriends = Moralis.Object.extend('InviteFriends');
        const inviteFriends = new InviteFriends();
        await inviteFriends.save({
          from: query?.invite,
          to: response?.id,
        })
        await sendNotificationToInvite({
          userId: query?.invite,
          account: '',
          username: username,
          avatar: '',
          type: 'invite',
          tag: null,
        })
      }
      dispatch(addNotification('Signup Successful!', 'success'))
      handleRouters('/$metasalttokens').then(() => window.location.reload());
    } catch (error) {
      dispatch(addNotification('Error: ' + error.code + ' ' + error.message, 'error'))
    }
  };

  const onHandleKeyPress = (event, key) => {
    if (event.key === 'Enter') {
      key === 'username' && usernameRef.current.focus();
      key === 'password' && pwdRef.current.focus();
      key === 'repassword' && repwdRef.current.focus();
      key === 'button' && onRegister();
    }
  }

  return (
    <LayoutPage>

      <div className="row mx-0 align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 my-5">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <h3 className="fw-bold mb-2 cursor color-purple-blue f-40" onClick={() => handleRouters('/')}>Metasalt</h3>
              <h2 className="fw-bold my-4 text-white">Create new account</h2>

              <div className='flex color-b '>
                <div className={`border-1 ${isEmailMethod && 'btn-selected'}`} onClick={() => setIsEmailMethod(true)}>Email</div>
                <div className={`border-1 ${!isEmailMethod && 'btn-selected'}`} onClick={() => setIsEmailMethod(false)}>Wallet</div>
              </div>

              <br />

              {isEmailMethod && <>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control my-3"
                    id="floatingInput"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    onKeyPress={(e) => onHandleKeyPress(e, 'username')}
                  />
                  <label htmlFor="floatingInput" style={{ color: '#777' }}>Email Address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    ref={usernameRef}
                    type="text"
                    className="form-control my-3"
                    id="floatingInput"
                    placeholder="name@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => onHandleKeyPress(e, 'password')}
                  />
                  <label htmlFor="floatingInput" style={{ color: '#777' }}>Choose a Username</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    ref={pwdRef}
                    type="password"
                    className="form-control my-3"
                    id="floatingInput"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => onHandleKeyPress(e, 'repassword')}
                  />
                  <label htmlFor="floatingInput" style={{ color: '#777' }}>Password</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    ref={repwdRef}
                    type="password"
                    className="form-control my-3"
                    id="floatingInput"
                    placeholder="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    onKeyPress={(e) => onHandleKeyPress(e, 'button')}
                  />
                  <label htmlFor="floatingInput" style={{ color: '#777' }}>Re-enter Password</label>
                </div>

                <div className='spacer-single' />

                <div
                  className={`btn-submit btn w-full ${!isAvailable && 'btn-disabled'}`}
                  onClick={onRegister}
                >
                  Create Account
                </div>

              </>}

              {!isEmailMethod && <div className='d-center flex-row'>
                <div className='d-center border-2'>
                  <Account />
                  Metamask
                </div>
              </div>}

              <div className='d-center mt-3'>
                <div className='divider mt-4' />
                <div className='mt-3 color-b'>
                  Already have an account?
                </div>
                <div className='color-purple fw-6 cursor' onClick={() => handleRouters('/login')}>
                  Log In
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && <div className="col-md-6 login-img" />}
      </div>
    </LayoutPage>
  )
}

export default RegisterPage