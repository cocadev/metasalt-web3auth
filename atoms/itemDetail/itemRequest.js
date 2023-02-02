import { useRouter } from 'next/router';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactTimeAgo from 'react-time-ago'
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import { useWeb3Auth } from '../../services/web3auth';
import { createRealTimeHistory, updateRequestOrder } from '../../common/api';


const Accepted = styled.div`
  font-size: 12px;
  margin-left: 12px;
  margin-top: 12px;
  background: #0075ff;
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  opacity: 0.75;
`

const Rejected = styled.div`
  font-size: 12px;
  margin-left: 12px;
  margin-top: 12px;
  background: #fc4136;
  color: #fff;
  padding: 3px 8px;
  border-radius: 12px;
  opacity: 0.75
`

const Btn = styled.div`
  margin-top: 10px;
  background: #0075ff;
  padding: 1px 6px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 4px;
  color: #fff;
`

const Btn2 = styled.div`
  margin-top: 10px;
  background: #fc4136;
  padding: 1px 6px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 4px;
  color: #fff;
  margin-left: 12px;
`

const ItemRequest = ({ requestOrdersByTokenId }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [isTitleOffers, setIsTitleOffers] = useState(true)
  const [requestData, setRequestData] = useState([])

  const { token_id: ercTokenId } = router.query;
  const { users } = useSelector(state => state.users);


  useEffect(() => {
    setRequestData(requestOrdersByTokenId.filter(item => item?.acceptor === user?.account && item?.requestor !== null))
  }, [requestOrdersByTokenId, user?.account])


  function getUserNameFromAddress(tAdd) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.account) === tAdd?.toLowerCase());
      return tt?.username;
    }
  }

  function getUserAvatarFromAddress(tAdd) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.account) === tAdd?.toLowerCase());
      return tt?.avatar;
    }
  }

  const onAcceptOrder = useCallback(async (requesterId) => {
    const filtered = requestOrdersByTokenId.filter(item => item?.acceptor === user?.account && item?.requestor === requesterId)
    if (filtered.length) {
      const response = await updateRequestOrder({ id: filtered[0]._id, confirmed: true })
      response && response.data && setRequestData(requestData.map(item => item._id === response.data._id ? response.data : item))
    }

    await createRealTimeHistory({
      account: user?.account,
      date: new Date(),
      tokenId: ercTokenId,
      opposite: requesterId,
      tag: 'accept'
    })

    dispatch(addNotification('Request Accepted!', 'success'))
  }, [dispatch, ercTokenId, requestData, requestOrdersByTokenId, user?.account])

  const onRejectOrder = useCallback(async (requesterId) => {
    const filtered = requestOrdersByTokenId.filter(item => item?.acceptor === user?.account && item?.requestor === requesterId)
    if (filtered.length) {
      const response = await updateRequestOrder({ id: filtered[0]._id, rejected: true })
      response && response.data && setRequestData(requestData.map(item => item._id === response.data._id ? response.data : item))
    }

    await createRealTimeHistory({
      account: user?.account,
      date: new Date(),
      tokenId: ercTokenId,
      opposite: requesterId,
      tag: 'reject'
    })

    dispatch(addNotification('Request Rejected!', 'success'))
  }, [dispatch, ercTokenId, requestData, requestOrdersByTokenId, user?.account])

  return (
    <div>
      <div className='offer-title' onClick={() => setIsTitleOffers(!isTitleOffers)}>
        <div><span aria-hidden="true" className="icon_ul" />&nbsp;&nbsp;Request</div>
        <span aria-hidden="true" className={`arrow_carrot-${!isTitleOffers ? 'down' : 'up'} text24`} />
      </div>

      {isTitleOffers && <div className='offer-body'>
        <div className="de_tab w-full">
          <div className='offer-body'>
            <div className="w-full">
              {requestData.length === 0 && <p>No requests yet</p>}
              {requestData.length > 0 &&
                <Table className='color-7'>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>From</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestData?.map((item, index) =>
                      <tr key={index}>
                        <td><div style={{ marginTop: 10 }}>{index + 1}</div></td>
                        <td style={{ color: '#3291e9', cursor: 'pointer' }} onClick={() => router.push(`/sales/${item.requestor}`, undefined, { shallow: true })}>
                          <picture>
                            <img src={getUserAvatarFromAddress(item.requestor)} alt="" style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover', marginRight: 12 }} />
                          </picture>
                          {getUserNameFromAddress(item.requestor)}
                        </td>
                        <td>
                          <div style={{ marginTop: 10 }}>
                            {<ReactTimeAgo date={new Date(item.createdAt)} locale="en-US" />}
                          </div>
                        </td>
                        <td>
                          <div className="d-row align-center">
                            {!item.rejected && (item.confirmed ? <Accepted>Accepted</Accepted> : <Btn onClick={() => onAcceptOrder(item.requestor)}>Accept</Btn>)}
                            {!item.confirmed && (item.rejected ? <Rejected>Rejected</Rejected> : <Btn2 onClick={() => onRejectOrder(item.requestor)}>Reject</Btn2>)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              }
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default memo(ItemRequest);
