import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import { TinyLoading } from '../../loading';
import { DEMO_AVATAR } from '../../../keys';
import { sendNotification } from '../../../common/api';
import UtilService from '../../../sip/utilService';
const LayoutModal = dynamic(() => import('../../layouts/layoutModal'));

const ModalTransferNFT = ({ onClose, isERC1155, isOpen }) => {

  const { Moralis, user, account } = useMoralis();
  const dispatch = useDispatch();
  const router = useRouter();
  const [userId, setUserId] = useState();
  const [userKey, setUserKey] = useState();
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { users } = useSelector(state => state.users);
  const { token_address: tokenAddress, token_id: tokenId } = router.query;

  const onModalClose = () => {
    setUserId(null);
    setUserKey(null);
    onClose();
  }

  const onTransferNFT = async () => {
    setIsLoading(true);
    const LazyMintsQuery = new Moralis.Query('LazyMints');
    LazyMintsQuery.equalTo('tokenId', tokenId);
    const object = await LazyMintsQuery.first();

    if (object) {

      if(isERC1155){
        // decrese the counts of supply from owner erc1155
        await object.save().then((x) => {
          x.set('supply', Number(object.attributes.supply) - Number(count));
          return x.save();
        });

        // clone the object and add supply, owner, from_address erc1155
        const LazyMints = Moralis.Object.extend('LazyMints');
        const lazyMints = new LazyMints();
        lazyMints.save({ ...object.attributes, supply : Number(count), owner: userId, from_address: account });

      }else{
        // erc721
        await object.save().then((x) => {
          x.set('owner', userId);
          x.set('from', account);
          return x.save();
        });
      }

      const LazyMintsTransfers = Moralis.Object.extend('LazyMintsTransfers');
      const lazyMintsTransfers = new LazyMintsTransfers();
      lazyMintsTransfers.save({
        from_address: account,
        to_address: userId,
        amount: Number(count),
        token_id: tokenId
      })

      setIsLoading(false);
      dispatch(addNotification('Transfer successful', 'success'));
      const selectedUser = users.filter(item => item.account === userId)
      const link = `https://www.metasalt.io/nftmarketplace/eth/${tokenAddress}/${tokenId}`
      await sendNotification({
        userId: selectedUser[0].id,
        account: user.attributes.accounts ? user.attributes.accounts[0] : '',
        username: user.attributes.username,
        avatar: user.attributes.avatar,
        type: 'transfer',
        tag: null,
        link,
      })
      onModalClose();
      setTimeout(() => {
        router.reload();
      }, 2000)
    } else {
      setIsLoading(false);
      dispatch(addNotification('Can\'t transfer this NFT!', 'error'));
      onModalClose();
    }
  }

  return (
    <LayoutModal
      isOpen={isOpen}
      onClose={onModalClose}
      title={'Transfer NFT without gas fee'}
    >

      <div className="row justify-center mt-5">

        <input
          className="form-control"
          placeholder="Search Username"
          value={userKey}
          onChange={e => setUserKey(e.target.value)}
        />

        {isERC1155 && <input
          className="form-control"
          placeholder="Transfer counts"
          value={count}
          onChange={e => setCount(e.target.value)}
          type='number'
        />}

        <div style={{ maxHeight: 300, border: '1px solid grey', overflow: 'auto' }} className='w-full mb-3'>
          {users
            .filter((x, k) => k !== 0 && user.id !== x.id && x.account && (x.username?.toLowerCase()?.includes(userKey?.toLowerCase()) || !userKey))
            .map((item, index) =>
              <div
                key={index}
                className={`d-row p-1 align-center cursor ${userId === item.account && 'bg-primary'}`}
                onClick={() => setUserId(item.account)}
              >
                <div style={{ width: 40, height: 40, }} className='d-center'>
                  <img src={UtilService.ConvetImg(item.avatar) || DEMO_AVATAR} alt='avatar' style={{ width: 40, height: 40, borderRadius: 20 }} />
                </div>
                <div className="ml-2">{item.username}</div>
              </div>)}

          {users.filter((x, k) => k !== 0 && user.id !== x.id && x.account && (x.username?.toLowerCase()?.includes(userKey?.toLowerCase()) || !userKey)).length === 0 && <p className="mt-3 text-center">No matched users!</p>}
        </div>

        {isLoading ? <TinyLoading /> : <div className="d-center d-row">
          <div className="offer-btn" onClick={onModalClose} style={{ width: 100, marginRight: 20 }}>
            Cancel
          </div>

          <div
            className={`offer-btn buy-btn bg-primary ${!(userId && count > 0 )&& 'btn-disabled'}`}
            onClick={onTransferNFT}
            style={{ width: 150 }}
          >
            Transfer
          </div>
        </div>}


      </div>

    </LayoutModal>
  );
};

export default ModalTransferNFT;