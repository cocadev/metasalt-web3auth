import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import renderHTML from 'react-render-html';
import ReactTimeAgo from 'react-time-ago';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { updateBadgeCount } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { GOERLI_MINT721_ADDRESS, MAIN_MINT721_ADDRESS, PROD } from '../keys';
import { MetaTag } from '../components/MetaTag';
import { bulkMarkAsReadUserNotifications, getUserNotifications } from '../common/api';

const MyHistory = () => {

  const router = useRouter();
  const [tab, setTab] = useState('Notifications');
  const [notifications, setNotifications] = useState([]);
  const stepCount = 20;
  const [loadCount, setLoadCount] = useState(stepCount);
  const { account, user } = useMoralis();
  const { data: historyData1 } = useMoralisQuery('RealTimeHistory', query => query.equalTo('account', account || '-').descending('createdAt'), [account]);
  const { data: historyData2 } = useMoralisQuery('RealTimeHistory', query => query.equalTo('opposite', account || '-').descending('createdAt'), [account]);
  const historyData = [...historyData1, ...historyData2];
  const dispatch = useDispatch();
  const { nfts } = useSelector(state => state.nfts);
  const { users } = useSelector(state => state.users);

  const token_net = PROD ? 'eth' : 'goerli';
  const token_address = PROD ? MAIN_MINT721_ADDRESS : GOERLI_MINT721_ADDRESS;

  const history = historyData.map(item => {

    const nft = nfts.find((x) => x.token_id === item?.attributes?.tokenId)
    const metaData = nft?.metadata ? JSON.parse(nft.metadata) : { image: null, name: null, price: null };
    const user = users.find(x => x.account === (item?.attributes?.opposite || '-'));
    const userMe = users.find(x => x.account === (item?.attributes?.account || '-'));

    return {
      date: new Date(item?.attributes?.date),
      tokenId: item?.attributes?.tokenId,
      tokenConvertId: item?.attributes?.tokenId?.substr(0, 6) + '...' + item?.attributes?.tokenId?.substr(-4),
      tag: item?.attributes?.tag,
      opposite: user?.username,
      oppositeAddress: user?.account,
      asset: metaData.image,
      title: metaData.name,
      price: metaData.price,
      account: userMe?.username,
      address: item?.attributes?.account
    }
  }).sort(function (a, b) {
    return b.date - a.date
  })

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true })
  }

  const loadUserNotifications = async () => {
    if (user?.id) {
      const userNotifications = await getUserNotifications({ userId: user?.id })
      setNotifications(userNotifications)
    }
  }

  const markAsReadUserNotifications = async () => {
    const unReadUserNotifications = notifications.slice(0, loadCount).filter(item => item.status === 'unRead');
    const unReadUserNotificationIds = unReadUserNotifications.map(item => {
      return item.key;
    })
    if (unReadUserNotificationIds.length > 0) {
      await bulkMarkAsReadUserNotifications({ userId: user?.id, ids: unReadUserNotificationIds })
      if (loadCount < notifications.length) {
        const restUnReadUserNotifications = notifications.slice(loadCount, notifications.length).filter(item => item.status === 'unRead');
        dispatch(updateBadgeCount(restUnReadUserNotifications.length));
      } else {
        dispatch(updateBadgeCount(0));
      }
    }
  }

  useEffect(() => {
    loadUserNotifications();
  }, [user])

  useEffect(() => {
    if (notifications.length > 0 && loadCount > 0) {
      markAsReadUserNotifications();
    }
  }, [notifications, loadCount])

  return (
    <div>

      <MetaTag {...{
        title: 'Metasalt History',
        description: 'Search, Join, and Interact with your favorite communities',
        image: 'https://www.metasalt.io/img/preview.png',
      }} />

      <LayoutPage>
        <LayoutScreen
          title='My History'
          description='Create, Accept, Reject, Buy and All Histories'
        >
          <section className='container mt-5' style={{ minHeight: 500, padding: 0 }}>
            {/* <div className='p-3'>
              <button
                className={tab === 'Notifications' ? 'btn btn-selected' : 'btn'}
                onClick={() => setTab('Notifications')}>
                Notifications
              </button>
              <button
                className={tab === 'Actions' ? 'ml-4 btn btn-selected' : 'ml-4 btn'}
                onClick={() => setTab('Actions')}>
                Actions
              </button>
            </div> */}
            {
              tab === 'Notifications' ?
                <>
                  <table className='table de-table color-b' style={{ tableLayout: 'fixed' }}>
                    <tr>
                      <th scope='col' style={{ width: '5%' }}>No</th>
                      <th scope='col' style={{ width: '15%' }}>User</th>
                      <th scope='col' style={{ width: '50%' }}>Body</th>
                      <th scope='col' style={{ width: '10%' }}>Type</th>
                      <th scope='col' style={{ width: '20%' }}>Time</th>
                    </tr>
                    {
                      notifications.slice(0, loadCount).map((item, index) => (
                        <tr key={index} className='color-b'>
                          <td>{index + 1}</td>
                          {
                            item.account ?
                              <td className='text-ellipsis color-sky cursor' onClick={() => handleRouters(`/sales/${item.account}`)}>{item.title}</td>
                              :
                              <td className='text-ellipsis'>{item.title}</td>
                          }
                          <td>{renderHTML(item.body)}</td>
                          <td>{item.type}</td>
                          <td>{<ReactTimeAgo date={item.createdAt} locale='en-US' />}</td>
                        </tr>
                      ))
                    }
                  </table>
                  {notifications.length > loadCount &&
                    <div className='p-3 text-center'>
                      <button className='btn' onClick={() => setLoadCount(loadCount + stepCount)}>
                        Load More
                      </button>
                    </div>
                  }
                </>
                :
                <div className='row'>
                  <div className='col-lg-12'>
                    <table className='table de-table color-b'>
                      <tr>
                        <th scope='col'>No</th>
                        <th scope='col'>Action</th>
                        <th scope='col'>Item</th>
                        <th scope='col'>From</th>
                        <th scope='col'>To</th>
                        <th scope='col'>Time</th>
                      </tr>

                      {
                        history.map((item, index) => <tr key={index} className='color-b'>
                          <td>{index + 1}</td>
                          <td style={{ textTransform: 'uppercase' }}>{item.tag}</td>
                          <td
                            className='cursor flex flex-row align-center'
                            onClick={() => handleRouters(`/nftmarketplace/${token_net}/${token_address}/${item.tokenId}`)}
                          >
                            <img src={item.asset} alt='' style={{ maxWidth: 80, maxHeight: 40 }} />
                            <div style={{ marginLeft: 6 }}>
                              {item.title}
                            </div>
                          </td>

                          {item.tag !== 'buy' && <td className='color-sky cursor' onClick={() => handleRouters(`/sales/${item.address}`)}>{item.account}</td>}
                          {item.tag !== 'buy' && (item.oppositeAddress ? <td className='color-sky cursor' onClick={() => handleRouters(`/sales/${item.oppositeAddress}`)}>{item.opposite || '-'}</td> : <td>{'-'}</td>)}

                          {item.tag === 'buy' && (item.oppositeAddress ? <td className='color-sky cursor' onClick={() => handleRouters(`/sales/${item.oppositeAddress}`)}>{item.opposite || '-'}</td> : <td>{'-'}</td>)}
                          {item.tag === 'buy' && <td className='color-sky cursor' onClick={() => handleRouters(`/sales/${item.address}`)}>{item.account}</td>}

                          <td>{<ReactTimeAgo date={item.date} locale='en-US' />}</td>
                        </tr>)
                      }

                    </table>

                    <div className='spacer-double' />

                    <div className='d-center'>
                      <h2>.</h2>
                    </div>
                  </div>
                </div>
            }
          </section>
        </LayoutScreen>
      </LayoutPage>
    </div>

  );
}

export default MyHistory;
