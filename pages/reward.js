import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMoralis } from 'react-moralis';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { TinyLoading } from '../components/loading';
import UtilService from '../sip/utilService';
import { PROD } from '../keys';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';

const ModalRewardDisable = dynamic(() => import('../components/modals/modalRewardDisable'));
const erc20ABI = require('../constants/abis/erc20ABI.json');

export const Text = styled.div`
  font-size: 28px;
  
  @media only screen and (max-width: 600px) {
    font-size: 14px;
  }
`
export const Row = styled.div`
  width: 650px;
  padding: 4px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  @media only screen and (max-width: 600px) {
    width: 350px;
  }
`

const Reward = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { Moralis, user, chainId, isInitialized } = useMoralis();
  const [rewards1, setRewards1] = useState(0);
  const [rewards2, setRewards2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [rewardableAmount, setRewardableAmount] = useState(0);
  const account = user?.attributes.ethAddress;
  const web3 = new Web3((typeof window !== 'undefined' && window).ethereum);
  const erc = new web3.eth.Contract(erc20ABI.abi, UtilService.getERC20Address(chainId));
  
  useEffect(() => {
    if (isInitialized) {
      setTimeout(() => {
        onGetVirtualRewards();
        account && onGetBalanceOf();
        account && onGetBlockchainRewards();
      }, 1000)
    }
  }, [account, isInitialized])

  const onGetVirtualRewards = async () => {
    const RewardsQuery = new Moralis.Query('Rewards');
    RewardsQuery.equalTo('owner', account || user?.id);
    const reward = await RewardsQuery.first();
    const totalRewards = PROD ? (reward?.attributes?.ETH || 0) + (reward?.attributes?.POLYGON || 0) : (reward?.attributes?.GOERLI || 0) + (reward?.attributes?.MUMBAI || 0);
    setRewards1(totalRewards)
  }

  const onGetBalanceOf = async () => {
    const res = await erc.methods.balanceOf(account).call();
    setRewards2(res / 1000000000000000000)
  }

  const onGetBlockchainRewards = async () => {
    const res = await erc.methods.getReward(account).call();
    if (res !== '0') {
      setRewardableAmount(res / 1000000000000000000)
    } else {
      setRewardableAmount(0);
    }
  }

  const onClaimReward = () => {
    if (rewardableAmount === 0) {
      setIsModal(true);
      return false;
    } else {
      onClaim();
    }
  }

  const onClaim = async() => {
    setLoading(true);
    try {
      await erc.methods.claimCreatingReward().call();
      setTimeout(() => {
        onGetBalanceOf();
        onGetBlockchainRewards();
        setLoading(false);
      }, 2000)
    }catch(e){
      setLoading(false);
      dispatch(addNotification('Not enough reward balance', 'error'))
      console.log('e', e.message)
    }

  }

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  return (
    <LayoutPage>
      <LayoutScreen title='REWARDS' description='$METASALT TOKENS'>
        <div className='d-center mt-5 color-b'>
          <Row>
            <Text>TOKENS IN YOUR ACCOUNT</Text>
            <Text>{rewards1 || 0}</Text>
          </Row>

          <Row>
            <div className='text-start color-7 -mt-10'>
              The number of $METASALT tokens you have in your Metasalt account earned by minting NFTs onto the blockchain. These tokens can be used to
              <span className='color-sky cursor' onClick={() => handleRouters('/authentication')}> authenticate </span> NFTs or be sold on
              <span className='color-sky cursor' onClick={() => handleRouters('/buyethereum')}> Uniswap</span>.
            </div>
          </Row>

          <Row className='mt-5'>
            <Text>TOKENS IN YOUR WALLET</Text>
            <Text>{rewards2 || 0}</Text>
          </Row>

          <Row>
            <div className='text-start color-7 -mt-10'>
              The number of $METASALT tokens you have in your wallet that you claimed as a reward or that you bought from <span className='color-sky cursor' onClick={() => handleRouters('/buyethereum')}>Uniswap</span>.
              If you want to <span className='color-sky cursor' onClick={() => handleRouters('/authentication')}> authenticate </span> NFTs, you must use $METASALT tokens.
            </div>
          </Row>

          {!loading && <div className={'mt-5  btn-main'} onClick={onClaimReward}>Claim Reward {rewardableAmount || 0}</div>}
          {loading && <div className='mt-5'><TinyLoading /></div>}
        </div>

        <ModalRewardDisable
          open={isModal}
          onClose={() => setIsModal(false)}
        />

      </LayoutScreen>
    </LayoutPage>
  );
}

export default Reward;