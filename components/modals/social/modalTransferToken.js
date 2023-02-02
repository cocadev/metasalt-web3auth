import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { DEMO_AVATAR } from '../../../keys';
import { addNotification } from '../../../store/actions/notifications/notifications';
import styled from 'styled-components';
import { onSaveRewards } from '../../../common/web3Api';

const Wallet = styled.div`
  font-size: 12px;
  background: #303030;
  color: #888;
  padding: 3px 0;
  font-weight: 600;
  border-radius: 4px;
  width: 90px;
  text-align: center;
  line-height: 15px;
`

const LayoutModal = dynamic(() => import('../../layouts/layoutModal'));

const ModalTransferToken = ({ onClose, isOpen }) => {

  const { Moralis, user, chainId } = useMoralis();
  const dispatch = useDispatch();
  const [rewardUsers, setRewardUsers] = useState([]);
  const [searchKey, setSearchKey] = useState();
  const [count, setCount] = useState(1);
  const { users } = useSelector(state => state.users);

  const onModalClose = () => {
    setRewardUsers([]);
    setSearchKey(null);
    onClose();
  }

  const onAddRewardUser = (x) => {
    if (rewardUsers.includes(x)) {
      setRewardUsers(rewardUsers.filter(c => c !== x))
    } else {
      setRewardUsers([...rewardUsers, x])
    }
  }

  const onTransferNFT = async () => {
    await rewardUsers.map(t => {
      const request = { Moralis, account: t, chainId, counts: count }
      dispatch(onSaveRewards(request, () => { }))
    })
    onModalClose();
    dispatch(addNotification('Sent token Successful!', 'success'))
  }

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onModalClose}
      title={'Send Tokens for rewards'}
    >

      <div className="row justify-center mt-5">

        <input
          className="form-control"
          placeholder="Transfer counts"
          value={count}
          onChange={e => setCount(e.target.value)}
          type='number'
        />

        <input
          className="form-control"
          placeholder="Search Username"
          value={searchKey}
          onChange={e => setSearchKey(e.target.value)}
        />

        <div style={{ maxHeight: 300, border: '1px solid grey', overflow: 'auto', marginTop: -15 }} className='w-full mb-3'>
          {users
            .filter((x, k) => k !== 0 && (x.username?.toLowerCase()?.includes(searchKey?.toLowerCase()) || !searchKey))
            .map((item, index) =>
              <div
                key={index}
                className={`d-row p-1 align-center cursor justify-betwen ${rewardUsers.includes(item.account || item.id) && 'bg-primary'} `}
                onClick={() => onAddRewardUser(item.account || item.id)}
              >
                <div className='d-row align-center'>
                  <div style={{ width: 40, height: 40, }} className='d-center'>
                    <img src={item.avatar || DEMO_AVATAR} alt='avatar' style={{ width: 40, height: 40, borderRadius: 20 }} />
                  </div>
                  <div className="ml-2">{item.username}</div>
                </div>

                {item.account && <Wallet>
                  <div>Wallet Connected</div>
                </Wallet>}
              </div>)}

          {users.filter((x, k) => k !== 0 && user.id !== x.id && x.account && (x.username?.toLowerCase()?.includes(searchKey?.toLowerCase()) || !searchKey)).length === 0 && <p className="mt-3 text-center">No matched users!</p>}
        </div>

        <div className="d-center d-row">
          <div className="offer-btn" onClick={onModalClose} style={{ width: 100, marginRight: 20 }}>
            Cancel
          </div>

          <div
            className={'offer-btn buy-btn bg-primary'}
            onClick={onTransferNFT}
            style={{ width: 150 }}
          >
            Send
          </div>
        </div>

      </div>

    </LayoutModal>
  );
};

export default ModalTransferToken;