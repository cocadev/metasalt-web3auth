import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { DEMO_AVATAR } from '../keys';
import { useRouter } from 'next/router';
import UtilService from '../sip/utilService';
import { onSaveRewards } from '../common/web3Api';
const CustomPopover = dynamic(() => import('../components/custom/CustomPopover'));

const Box = styled.div`
  background: #0f0f0f;
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
  max-width: 600px;
  @media only screen and (max-width: 600px) {
    max-width: 220px;
    margin-left: -10px;
    padding: 10px;
  }
`

const Text = styled.div`
  font-size: 16px;
  @media only screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid grey;
  margin: 0 12px 0 3px;
`

const User = styled.div`
  background: #222;
  border-radius: 12px;
  margin: 8px 3px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

const InvitePage = () => {

  const { user, isAuthenticated, Moralis, account, chainId } = useMoralis();
  const dispatch = useDispatch();
  const router = useRouter();
  const { users } = useSelector(state => state.users);
  const [hidden, setHidden] = useState(false);
  const { data } = useMoralisQuery('InviteFriends', query => query.equalTo('from', user?.id), [user], { autoFetch: true });
  const { data: rewardingData } = useMoralisQuery('InviteFriends', query => query.equalTo('from', user?.id).notEqualTo('rewarded', true), [user], { autoFetch: true });
  const copyText = 'https://www.metasalt.io/register?invite=' + (isAuthenticated ? user?.id : '');

  const onRewarded = async () => {

    const InviteFriendsQuery = new Moralis.Query('InviteFriends');
    InviteFriendsQuery.equalTo('from', user?.id).notEqualTo('rewarded', true).limit(5);
    const objects = await InviteFriendsQuery.find()

    await objects.map(c => {
      c.save().then((object) => {
        object.set('rewarded', true);
        return object.save();
      });
    })

    dispatch(addNotification('You are rewared 1 Metasalt token!', 'success'))
    setHidden(true);

  }

  return (
    <LayoutPage>
      <LayoutScreen title={'Invite Friends'}>

        <div className="flex justify-center mt-3">
          <Box className="color-b">
            <p className="f-22 font-bold fw-700">Invite Friends to Metasalt</p>
            <Text>Do you know people who could benefit from Metasalt? You’ll get credit for friends who join when we add paid accounts.</Text>

            {
              data.length < 10 &&
              <div>
                <div className="f-12 mt-3">
                  Invite Code
                </div>

                <div className="d-row mt-1">

                  <input className="w-full br-4 f-14" value={copyText} disabled style={{ color: '#bbb' }} />

                  <CustomPopover content='Copy Link'>
                    <CopyToClipboard
                      text={copyText}
                      onCopy={() => {
                        dispatch(addNotification('Invite URL copied to your clipboard'))
                      }}
                    >
                      <div className="bg-primary p-2 ml-2 br-4 cursor" >
                        <img src='img/icons/ic_copy.png' alt='' />
                      </div>
                    </CopyToClipboard>
                  </CustomPopover>
                </div>

              </div>}

            {rewardingData.length < 5 && <div className="mt-3 color-purple f-14">
              Invites remaining: {5 - rewardingData.length} of 5
            </div>}

            <div style={{ fontSize: 14, color: '#15e7b4', marginTop: 14 }}>You will receive 1 Metasalt Token for every 5 new users you invite.</div>

            {rewardingData.length > 4 && !hidden && <div
              className='btn btn-primary mt-3'
              onClick={() => {
                setHidden(true);
                const request = { Moralis, account, chainId, counts: 1 }
                dispatch(onSaveRewards(request, () => onRewarded()))
              }
              }
            >
              Reward Token
            </div>}

          </Box>
        </div>

        <div className="flex justify-center">
          <Box className="color-b">
            <p className="f-22 font-bold fw-700">People You’ve Invited</p>
            <Text>Bragging rights, baby. These are the folks you’ve personally invited to the platform.</Text>

            <div className="f-14 mt-2">📩 For every person you invite who registers and becomes a Metasalt creator, you’ll earn a free month of Metasalt Pro (up to 3 months, Metasalt Pro coming later this year).</div>
            <br />

            {data.length === 0
              ? <div className="f-12 p-3 text-center color-b" style={{ background: '#3f3f3f' }}>
                Invite friends to get started. When an account is created using your code, they’ll show up here.
              </div>
              : <div>
                <div>You invited {data.length} users</div>
                <div>
                  {data.map((item, index) => {
                    const user = users.find(x => x.id === item.attributes.to)
                    return (
                      <User key={index} onClick={() => router.push(`/sales/${user?.account || user?.id}`)} className={!user?.account && 'btn-disabled'}>
                        <Avatar src={UtilService.ConvetImg(user?.avatar) || DEMO_AVATAR} alt='avatar' />
                        <div>{user?.username}</div>
                      </User>
                    )
                  })}
                </div>
              </div>
            }
          </Box>
        </div>

        <br /><br /><br />

      </LayoutScreen>
    </LayoutPage>
  )
};

export default InvitePage;