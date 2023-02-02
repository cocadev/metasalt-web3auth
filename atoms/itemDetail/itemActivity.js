import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import ReactTimeAgo from 'react-time-ago';
import { useMoralis } from 'react-moralis';
import { useSelector } from 'react-redux';
import useWindowSize from '../../hooks/useWindowSize';
import UtilService from '../../sip/utilService';
import { Alchemy } from 'alchemy-sdk';
import moment from 'moment';
import Web3 from 'web3';
import { ALCHEMY_KEY } from '../../keys';
import { useWeb3Auth } from '../../services/web3auth';

const TRow = styled.tr`
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    display: flex;
    margin: 3px;
    line-height: 0.3;
    font-size: 12px;

    td {
      border-style: none;
      margin-top: 4px;
    }
  }
`

const ItemActivity = ({ sales, lazyMintTransfers: lazyTransfers }) => {

  const router = useRouter();
  const { net, token_address, token_id } = router.query;
  const { web3Auth } = useWeb3Auth();
  const { width } = useWindowSize();
  const { users } = useSelector(state => state.users)
  const { Moralis } = useMoralis();
  const [isTitleListings, setIsTitleListings] = useState(true);
  const [isErc1155Listings, setIsErc1155Listings] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const hexToDecimal = hex => parseInt(hex, 16);

  const lazyTrans = lazyTransfers.map(x => {
    return {
      value: 0,
      title: 'Transfer',
      from_address: x.from_address,
      to_address: x.to_address,
      block_timestamp: x.createdAt,
      amount: x.amount
    }
  })

  const activities = [...transactions, ...lazyTrans].sort(function (a, b) {
    return new Date(b.block_timestamp) - new Date(a.block_timestamp)
  });

  useEffect(() => {
    if (token_id && web3Auth) {
      fetchContractNFTTransfers()
    }
  }, [token_id, web3Auth])

  const fetchContractNFTTransfers = async () => {

    setIsLoading(true)
    console.log('loading:::')

    const alchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: UtilService.alchemyNet(net),
    });

    const res = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      contractAddresses: [token_address],
      excludeZeroValue: true,
      category: ["erc721", "erc1155"],
    });


    const allData = await Promise.all(res.transfers.map(async item => {
      const tId = item.tokenId || item.erc1155Metadata[0].tokenId;
      if(tId !== token_id) return null
      const pp =  await alchemy.core.getTransactionReceipt(item.hash)
      const block = await alchemy.core.getBlock(pp?.blockNumber || 0)
      return {
        amount: item.amount,
        from_address: item.from,
        to_address: item.to,
        value: pp?.value || 0,
        amount: item?.erc1155Metadata ? hexToDecimal(item.erc1155Metadata[0].value) : 1,
        block_timestamp: block?.timestamp,
      }
    }))

    setTransactions(allData.filter(c => !!c).sort(function (a, b) {
      return new Date(b.block_timestamp) - new Date(a.block_timestamp)
    }))

    setIsLoading(false)
  };

  function getUserNameFromAddress(tAdd) {
    if (users?.length === 0) {
      return '-'
    } else {
      const tt = users?.find(z => (z.account) === tAdd?.toLowerCase());
      return tt?.username;
    }
  }


  return (
    <div>
      <div className='offer-title' onClick={() => setIsTitleListings(!isTitleListings)}>
        <div><span aria-hidden="true" className="icon_tag_alt" />&nbsp;&nbsp;Activity</div>
        <span aria-hidden="true" className={`arrow_carrot-${!isTitleListings ? 'down' : 'up'} text24`} />
      </div>

      {isTitleListings &&
        <div className='offer-body'>
          <div className="w-full" style={{ overflow: 'auto', maxHeight: 300 }}>
            {isLoading ?
              <div>
                <Skeleton height={30} />
                <Skeleton height={30} />
                <Skeleton height={30} />
              </div>
              :
              <div>
              {activities.length > 0 ?
                <Table className="color-7">
                  {width > 850 &&
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                  }
                  {width > 850 ?
                    <tbody className='color-b'>
                      {activities?.map((item, index) =>
                        <tr key={index}>
                          {/* <td>{index === activities.length - 1 ? 'Minted' : item.title || 'Sale'}</td> */}
                          <td>{item.title || 'Sale'}</td>
                          <td>{Moralis.Units.FromWei(item.value)}</td>
                          <td>{item.amount}</td>
                          <td style={{ color: '#3291e9', cursor: 'pointer', maxWidth: 120, overflow: 'hidden' }} onClick={() => router.push(`/sales/${item.from_address}`, undefined, { shallow: true })}>
                            {item.from_address ? (getUserNameFromAddress(item.from_address) || UtilService.truncate(item.from_address)) : '-'}
                          </td>
                          <td style={{ color: '#3291e9', cursor: 'pointer', maxWidth: 120, overflow: 'hidden' }} onClick={() => router.push(`/sales/${item.to_address}`, undefined, { shallow: true })}>
                            {getUserNameFromAddress(item.to_address) || UtilService.truncate(item.to_address)}
                          </td>
                          <td><ReactTimeAgo date={moment.unix(item.block_timestamp)} locale="en-US" /></td>
                        </tr>
                      )}
                    </tbody>
                    :
                    <div className='color-b'>
                      {activities?.map((item, index) =>
                        <div
                          style={{ background: '#222', margin: 3, fontSize: 12, lineHeight: 0.6 }} key={index}>
                          <td>{index === activities.length - 1 ? 'Minted' : 'Transfer'}</td>
                          <div>Price: {Moralis.Units.FromWei(item.value)}</div>
                          <div>Quantity: {item.amount}</div>
                          <div style={{ color: '#3291e9', cursor: 'pointer' }} onClick={() => router.push(`/sales/${item.from_address}`, undefined, { shallow: true })}>
                            From: {item.from_address ? getUserNameFromAddress(item.from_address) : '-'}
                          </div>
                          <div style={{ color: '#3291e9', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => router.push(`/sales/${item.to_address}`, undefined, { shallow: true })}>
                            To: {getUserNameFromAddress(item.to_address)}
                          </div>
                          <div>Date: <ReactTimeAgo date={moment.unix(item.block_timestamp)} locale="en-US" /></div>

                        </div>
                      )}
                    </div>
                  }
                </Table>
                :
                <div className='color-7'>No Activities yet</div>
              }
            </div>
            }
        </div>
        </div>
      }

      <>
        <div className='offer-title' onClick={() => setIsErc1155Listings(!isErc1155Listings)}>
          <div><span aria-hidden="true" className="icon_tag_alt" />&nbsp;&nbsp;Sales</div>
          <span aria-hidden="true" className={`arrow_carrot-${!isErc1155Listings ? 'down' : 'up'} text24`} />
        </div>
        {(isErc1155Listings || isLoading) &&
          <div className='offer-body'>
            {isLoading ?
              <div className="w-full" style={{ overflow: 'auto', maxHeight: 300 }}>
                <Skeleton height={30} />
                <Skeleton height={30} />
                <Skeleton height={30} />
              </div>
              :
              <div className="w-full" style={{ overflow: 'auto', maxHeight: 300 }}>
                {sales.length > 0 ?
                  <Table className="color-7">
                    <thead>
                      <tr>
                      <th>Owner</th>
                      <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                      {sales?.map((item, index) =>
                        <TRow key={index}>
                          <td style={{ color: '#3291e9', cursor: 'pointer' }} onClick={() => router.push(`/sales/${item.owner_of}`, undefined, { shallow: true })}>
                            {getUserNameFromAddress(item.owner_of) || UtilService.truncate(item.owner_of)}
                          </td>
                          <td className='color-b'>{item.amount}</td>
                        </TRow>
                      )}
                    </tbody>
                  </Table>
                  :
                  <div className='color-7'>No Sales yet</div>
                }
              </div>
            }
          </div>
        }
      </>
    </div>
  );
}

export default ItemActivity;
