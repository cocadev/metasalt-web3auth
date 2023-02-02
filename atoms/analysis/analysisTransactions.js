import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import { Title } from "../../constants/globalCss";
import { ALCHEMY_KEY } from "../../keys";
import UtilService from "../../sip/utilService";
import { Alchemy } from "alchemy-sdk";
import ReactTimeAgo from 'react-time-ago'
import moment from "moment";

const AnalysisTransactions = ({ }) => {

  const router = useRouter();
  const { account, chainId } = useMoralis();
  const [transactions, setTransactions] = useState([]);
  const web3 = new Web3(window.ethereum);
  const hexToDecimal = hex => parseInt(hex, 16);
  
  const alchemy = new Alchemy({
    apiKey: ALCHEMY_KEY,
    network: UtilService.alchemyNet(chainId),
  });

  useEffect(() => {
    fetchTokenTransfers();
  }, [])

  const fetchTokenTransfers = async () => {

    const resFrom = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: account,
      excludeZeroValue: true,
      category: ["erc721", "erc1155"],
    });

    const resTo = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: account,
      excludeZeroValue: true,
      category: ["erc721", "erc1155"],
    });

    const allData = await Promise.all([...resFrom.transfers, ...resTo.transfers].map(async item => {
      const res =  await web3.eth.getTransaction(item.hash)
      const block = await web3.eth.getBlock(res?.blockNumber || 0)
      return {
        contract_type: item.category,
        amount: item.amount,
        from_address: item.from,
        to_address: item.to,
        token_id: item.tokenId || item.erc1155Metadata[0].tokenId,
        value: res?.value || 0,
        amount: item.erc1155Metadata ? hexToDecimal(item.erc1155Metadata[0].value) : 1,
        block_timestamp: block?.timestamp,
        token_address: item.rawContract.address
      }
    }))

    setTransactions(allData.sort(function (a, b) {
      return new Date(b.block_timestamp) - new Date(a.block_timestamp)
    }))
  }

  return (
    <div className="color-b">
      <Title>Metasalt Transactions</Title>

      <table className="table de-table color-b mt-5">
        <tr>
          <th scope="col">No</th>
          <th scope="col">Contract Type</th>
          <th scope="col">Amount</th>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col">Token ID</th>
          <th scope="col">Value</th>
          <th scope="col">Time</th>
        </tr>

        {
          transactions.length > 0 && transactions.map((item, index) => {

            return <tr key={index} className='color-b'>
              <td>{index + 1}</td>
              <td style={{ textTransform: 'uppercase' }}>{item.contract_type}</td>
              <td style={{ textTransform: 'uppercase' }}>{item.amount}</td>
              <td>{UtilService.truncate(item.from_address)}</td>
              <td>{UtilService.truncate(item.to_address)}</td>
              <td className="color-sky cursor" onClick={() => router.push(`/nftmarketplace/${UtilService.getChain5(chainId)}/${item.token_address}/${item.token_id}`, undefined, { shallow: true })}>
                {UtilService.truncate(item.token_id)}
              </td>
              <td>{item?.value ? web3.utils.fromWei((item?.value||0), 'ether') : item.value} {UtilService.getPriceUnit(chainId)}</td>
              <td>{<ReactTimeAgo date={moment.unix(item.block_timestamp)} locale="en-US" />}</td>
            </tr>
          })
        }

      </table>

    </div>
  );
};

export default AnalysisTransactions;