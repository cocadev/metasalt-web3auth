import { useRouter } from 'next/router';
import React, { memo } from 'react';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { useWeb3Auth } from '../../services/web3auth';
import { createRealTimeHistory, deleteOrderDataById } from '../../common/api';
import UtilService from '../../sip/utilService';


const ItemStopSale = ({ setSwitchNetworkModal, priceChain, orderDataByTokenId }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const web3 = new Web3(window.ethereum)
  const { token_id: ercTokenId } = router.query
  const { user, chain } = useWeb3Auth();

  const onStopSale = async () => {

    const chainId = UtilService.getChain4(chain);

    if (priceChain !== chainId) {
      setSwitchNetworkModal(true);
      return false;
    }

    const result = orderDataByTokenId.find(item => item?.completed === false)
    result && await deleteOrderDataById({ id: result._id })

    await createRealTimeHistory({
      account: user?.account,
      date: new Date(),
      tokenId: ercTokenId,
      tag: 'stop'
    })

    dispatch(addNotification('Cancel successful', 'success'))
    setTimeout(() => router.push('/mynfts', undefined, { shallow: true }), 1000)
  }

  return (
    <div>
      <div className="offer-btn stop-btn" onClick={onStopSale}>
        <span style={{ marginRight: 12, fontSize: 20 }} aria-hidden="true" className="icon_tag_alt" />
        Stop Sale
      </div>
    </div>
  );
}

export default memo(ItemStopSale);
