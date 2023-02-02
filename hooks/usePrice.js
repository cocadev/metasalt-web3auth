import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';

export default function usePrice() {

  const { Moralis } = useMoralis();
  const [ethPrice, setEthPrice] = useState({
    eth: 0, matic: 0
  });

  useEffect(() => {

    setTimeout(() => {
      convertPrice();
    }, 1000)

    async function convertPrice() {
      const matic = await Moralis.Web3API.token.getTokenPrice({ address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", chain: "eth" })
      // const bnb = await Moralis.Web3API.token.getTokenPrice({ address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", chain: "bsc" })
      // const rinkeby = await Moralis.Web3API.token.getTokenPrice({ address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", chain: "bsc" })
      const eth = await Moralis.Web3API.token.getTokenPrice({ address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", chain: "bsc" })
      //setCoinPrice({
      // matic: matic?.usdPrice,
      // bnb: bnb?.usdPrice,
      // rinkeby: rinkeby?.usdPrice,
      //})
      setEthPrice({
        eth: eth?.usdPrice,
        matic: matic?.usdPrice
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ethPrice;
}
