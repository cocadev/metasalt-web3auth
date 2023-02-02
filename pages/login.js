import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import useWindowSize from '../hooks/useWindowSize';
import Timer from '../hooks/useTimer';
import LayoutPage from '../components/layouts/layoutPage';

const Account = dynamic(() => import('../menu/account'));
const ModalTerms = dynamic(() => import('../components/modals/modalTerms'));

const LoginPage = () => {

  const router = useRouter();
  const pwdRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailMethod, setIsEmailMethod] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [wrongPwd, setWrongPwd] = useState(0);
  const { width } = useWindowSize();
  const isMobile = width < 600;


  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }


  const handleLogin = async () => {}

  return (
    <LayoutPage>

      <div className="row mx-0 align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 my-5">
          <div className="row">
            <div className="col-lg-6 m-auto">
              <h3 className="fw-bold mb-2 cursor color-purple-blue f-40" onClick={() => handleRouters('/')}>Metasalt</h3>
              <h2 className="fw-bold my-4 text-white">Log in</h2>

              <div className='flex color-b '>
                <div className={`border-1 ${isEmailMethod && 'btn-selected'}`} onClick={() => setIsEmailMethod(true)}>Email</div>
                <div className={`border-1 ${!isEmailMethod && 'btn-selected'}`} onClick={() => setIsEmailMethod(false)}>Wallet</div>
              </div>

              <br />

              {isEmailMethod && <>
                <div className="form-floating mb-3 mt-3">
                  <input
                    type="email"
                    className="form-control my-3 color-b"
                    id="email"
                    placeholder="name@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                  />
                  <label htmlFor="email" style={{ color: '#777' }}>Username</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    ref={pwdRef}
                    type="password"
                    className="form-control my-3 color-b"
                    id="password"
                    placeholder="name@example.com"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password" style={{ color: '#777' }}>Password</label>
                </div>

                {wrongPwd < 3 ? <div
                  className="btn-submit btn w-full mb-3"
                  onClick={handleLogin}
                >
                  Log In
                </div> : <Timer
                  initialSeconds={60}
                  onFinish={() => setWrongPwd(0)}
                />}

              </>}

              {!isEmailMethod && <div className='d-center flex-row'>
                <div className='d-center border-2'>
                  <Account />
                  Metamask
                </div>
              </div>}

              <div className='d-center mt-3' hidden={true}>
                <div className='color-purple fw-6 cursor' onClick={() => handleRouters('/forgotPassword')}>Forgot Password?</div>
                <div className='divider mt-4' />
                <div className='mt-3 color-b'>Don't have an account?</div>
                <div className='color-purple fw-6 cursor' onClick={() => handleRouters('/register')}>Sign Up</div>
              </div>

            </div>
          </div>
        </div>
        {!isMobile && <div className="col-md-6 login-img" />}
      </div>

      {
        isModal &&
        <ModalTerms
          email={true}
          onClose={() => setIsModal(false)}
          onGo={() => {
            setIsModal(false);
            handleRouters('/mynfts')
          }}
        />
      }

    </LayoutPage>
  )
}

export default LoginPage;
