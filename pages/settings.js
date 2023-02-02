import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import CustomPopover from '../components/custom/CustomPopover';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { smsVerification, smsVerificationCheck, updateUser, updateUserService } from '../common/api';
import { DEMO_AVATAR, InfuraAuth, InfuraLink, PROFILE_BG } from '../keys';

const CustomModal = dynamic(() => import('../components/custom/customModal'));

const SettingsPage = () => {

  const dispatch = useDispatch()
  const { user, setUser } = useWeb3Auth()

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notificationEnabled, setNotificationEnabled] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [enableSMS, setEnableSMS] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [smsEnabled, setSMSEnabled] = useState(false)
  const [twitter, setTwitter] = useState('')
  const [instagram, setInstagram] = useState('')
  const [site, setSite] = useState('')
  const avatarRef = useRef()
  const [avatar, setAvatar] = useState(null)
  const [localAvatar, setLocalAvatar] = useState(null)
  const [remoteAvatar, setRemoteAvatar] = useState(null)
  const [avatarModal, setAvatarModal] = useState(false)
  const bannerRef = useRef()
  const [banner, setBanner] = useState(null)
  const [localBanner, setLocalBanner] = useState(null)
  const [remoteBanner, setRemoteBanner] = useState(null)
  const [bannerModal, setBannerModal] = useState(false)

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const checkEnableNotification = async (value) => {
    setNotificationEnabled(value)
    await updateUserService({ userId: user.id, key: 'notification', value })
  }

  const checkEnableEmail = async (value) => {
    setEmailEnabled(value);
    await updateUserService({ userId: user.id, key: 'email', value })
  }

  const checkEnableSMS = async (value) => {
    setEnableSMS(value)
    if (value) {
      if (phone && isValidPhoneNumber(phone)) {
        const smsVerificationRes = await smsVerification({
          userId: user.id,
          to: phone,
        })
        if (smsVerificationRes.success) {
          dispatch(addNotification(`${smsVerificationRes.message} Please check.`, 'success'))
        }
      } else {
        dispatch(addNotification('Phone number is empty or not valid', 'error'))
      }
    }
  }

  const checkVerifyCode = async () => {
    if (verifyCode) {
      const smsVerificationRes = await smsVerificationCheck({
        userId: user.id,
        to: phone,
        code: verifyCode,
      })
      if (smsVerificationRes.success && smsVerificationRes.data.status === 'approved') {
        dispatch(addNotification(smsVerificationRes.message, 'success'))
        setSMSEnabled(true)
      } else {
        dispatch(addNotification('Your verification code is not correct', 'error'))
      }
    } else {
      dispatch(addNotification('Verification code is empty', 'error'))
    }
  }

  const resendSMSCode = async () => {
    if (phone && isValidPhoneNumber(phone)) {
      const smsVerificationRes = await smsVerification({
        userId: user.id,
        to: phone,
      })
      if (smsVerificationRes.success) {
        dispatch(addNotification(`${smsVerificationRes.message} Please check.`, 'success'))
      }
    } else {
      dispatch(addNotification('Phone number is empty or not valid', 'error'))
    }
  }

  const checkSMSEnabled = async (value) => {
    if (!value) {
      setSMSEnabled(value)
      await updateUserService({ userId: user.id, key: 'sms', value })
    }
  }

  const onChangeAvatar = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await UtilService.convertBase64(file)
      setLocalAvatar(base64)
      const result = await ipfs.add(file);
      setAvatar('ipfs://' + result.path);
    }
  };

  const onChangeBanner = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await UtilService.convertBase64(file)
      setLocalBanner(base64)
      const result = await ipfs.add(file);
      setBanner('ipfs://' + result.path);
    }
  };

  const onSaveProfile = async () => {
    const body = {
      id: user._id,
      username,
      bio,
      email,
      phone,
      twitter,
      instagram,
      site,
      banner,
      avatar,
      service: {
        notification: notificationEnabled,
        email: emailEnabled,
        sms: smsEnabled,
      }
    }
    const response = await updateUser(body)
    if (response?.success) {
      setUser(response.data)
      dispatch(addNotification(response.message, 'success'))
      // setProfile({ username: username, avatar: userAvatar })
    }
  }

  const onRemoveProfile = async () => {
    setLocalAvatar(null)
    setRemoteAvatar(null)
    setAvatarModal(false)
  }

  const onRemoveBanner = async () => {
    setLocalBanner(null)
    setRemoteBanner(null)
    setBannerModal(false)
  }

  useEffect(() => {
    if (user && user.idToken) {
      setUsername(user?.username)
      setBio(user?.bio)
      setEmail(user?.email)
      setTwitter(user?.twitter)
      setInstagram(user?.instagram)
      setSite(user?.site)
      setRemoteAvatar(UtilService.ConvetImg(user?.avatar))
      setRemoteBanner(UtilService.ConvetImg(user?.banner))
      setNotificationEnabled(user.service.notification)
      setEmailEnabled(user.service.email)
      setSMSEnabled(user.service.sms)
    }
  }, [user])

  return (
    <LayoutPage container>

      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 col-md-6 col-sm-12 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <h1 className="color-b">Profile Settings</h1>

                <div className="spacer-single" />

                <h5 className="color-b">Username</h5>
                <input
                  className="form-control"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Bio</h5>
                <textarea
                  className="form-control"
                  placeholder="Tell the world your story!"
                  style={{ height: 140 }}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Email Address</h5>
                <input
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Phone Number</h5>
                <PhoneInput
                  className='form-control phone-input'
                  placeholder='Phone number'
                  defaultCountry={'US'}
                  value={phone}
                  onChange={setPhone}
                  addInternationalOption={false}
                  // displayInitialValueAsLocalNumber
                />

                <div className='d-flex align-items-center'>
                  <input
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    type="checkbox"
                    checked={notificationEnabled}
                    onChange={e => checkEnableNotification(e.target.checked)}
                  />
                  <span>
                    {notificationEnabled ? 'Notification Service Enabled' : 'Enable Notification Service'}
                  </span>
                </div>

                <div className="spacer-10" />

                <div className='d-flex align-items-center'>
                  <input
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={e => checkEnableEmail(e.target.checked)}
                  />
                  <span>
                    {emailEnabled ? 'Email Service Enabled' : 'Enable Email Service'}
                  </span>
                </div>

                <div className="spacer-10" />

                {smsEnabled &&
                  <>
                    <div className='d-flex align-items-center'>
                      <input
                        style={{ width: 20, height: 20, marginRight: 10 }}
                        type="checkbox"
                        checked={enableSMS}
                        onChange={e => checkEnableSMS(e.target.checked)}
                      />
                      <span>Enable SMS Service</span>
                    </div>
                    {enableSMS &&
                      <div className='mt-3 d-flex align-items-center'>
                        <input className='w-25 m-0 form-control' type='text' value={verifyCode} onChange={e => setVerifyCode(e.target.value)} />
                        <button
                          className='btn btn-outline-dark ms-3' style={{ borderRadius: 10, padding: '5px 10px' }}
                          onClick={checkVerifyCode}>
                          Verify
                        </button>
                        <button
                          className='btn btn-outline-dark ms-3' style={{ borderRadius: 10, padding: '5px 10px' }}
                          onClick={resendSMSCode}>
                          Resend
                        </button>
                      </div>
                    }
                  </>
                }

                {smsEnabled &&
                  <div className='d-flex align-items-center'>
                    <input
                      style={{ width: 20, height: 20, marginRight: 10 }}
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={e => checkSMSEnabled(e.target.checked)}
                    />
                    <span>SMS Service Enabled</span>
                  </div>
                }

                <div className="spacer-20" />

                <h5 className="color-b">Links</h5>
                <div>
                  <div className="profile-links">
                    <span aria-hidden="true" className="social_twitter" />
                    <input
                      className="form-control"
                      placeholder="YourTwitterHandle"
                      value={twitter}
                      onChange={e => setTwitter(e.target.value)}
                    />
                  </div>
                  <div className="profile-links" style={{ marginTop: -20 }}>
                    <span aria-hidden="true" className="social_instagram" />
                    <input
                      className="form-control"
                      placeholder="YourInstagramHandle"
                      value={instagram}
                      onChange={e => setInstagram(e.target.value)}
                    />
                  </div>
                  <div className="profile-links" style={{ marginTop: -20 }}>
                    <span aria-hidden="true" className="icon_archive_alt" />
                    <input
                      className="form-control"
                      placeholder="yoursite.io"
                      value={site}
                      onChange={e => setSite(e.target.value)}
                    />
                  </div>
                </div>

                <div className="spacer-10" />

                <h5 className="color-b">Wallet Address</h5>
                <input className="form-control" placeholder="Wallet Address" value={user?.account} disabled />

                <div className="spacer-10" />

                <div className="btn-main" onClick={onSaveProfile}>
                  Save
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
            <h5 className="text-center color-b">Profile Image</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>
              <div className='browse'>
                <picture>
                  <img className='profile-avatar' id="get_file" style={{ marginTop: 0, }} src={localAvatar || remoteAvatar || DEMO_AVATAR} alt='avatar' />
                </picture>
                <br />
                <input id='upload_file' type="file" multiple onChange={onChangeAvatar} className="cursor" ref={avatarRef} />
              </div>

              <div className="center-div mt-20">
                <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => avatarRef.current.click()}>
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
                {!(!localAvatar && !remoteAvatar) && <div className="btn-danger ml-2 cursor" onClick={() => setAvatarModal(true)}>
                  <span aria-hidden="true" className="icon_trash" />
                </div>}
              </div>
            </div>

            <h5 className="text-center color-b">Profile Banner</h5>

            <div className="d-create-file" style={{ border: 'none', marginTop: -46 }}>

              <div className='position-relative browse'>
                <div id="get_file">
                  {(localBanner || remoteBanner) && <picture><img className='profile-banner' id="get_file" src={localBanner || remoteBanner} alt='avatar' /></picture>}
                  {!(localBanner || remoteBanner) && <div className='profile-banner' style={{ background: `url(${PROFILE_BG})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />}
                  <br />
                  <input id='upload_file' type="file" onChange={onChangeBanner} className="cursor" ref={bannerRef} />
                </div>
              </div>

              <div className="center-div">
                <CustomPopover content="Suggested Size is 680 * 90" placement="bottom">
                  <div className="btn-main ml-2 cursor" style={{ padding: '5px 24px' }} onClick={() => bannerRef.current.click()}>
                    <span aria-hidden="true" className="icon_pencil" />
                  </div>
                </CustomPopover>
                {!(!localBanner && !remoteBanner) &&
                  <div className="btn-danger ml-2 cursor" onClick={() => setBannerModal(true)}>
                    <span aria-hidden="true" className="icon_trash" />
                  </div>
                }
              </div>

            </div>
          </div>
        </div>
      </section>

      {avatarModal &&
        <CustomModal
          title={'Remove Avatar'}
          description={'Are you sure about removing the Avatar?'}
          onClose={() => setAvatarModal(false)}
          onApprove={onRemoveProfile}
        />
      }

      {bannerModal &&
        <CustomModal
          title={'Remove Banner'}
          description={'Are you sure about removing the Banner?'}
          onClose={() => setBannerModal(false)}
          onApprove={onRemoveBanner}
        />
      }

    </LayoutPage>
  );
}

export default SettingsPage;
