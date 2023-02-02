import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { useDispatch } from 'react-redux';
import useWindowSize from '../../hooks/useWindowSize';
import LayoutModal from '../layouts/layoutModal';
import { useWeb3Auth } from '../../services/web3auth';
import { PROD } from '../../keys';
import { CHAINS_PROD, CHAINS_TEST } from '../../constants/dropdownlist';

const styles = {
  atom1: {
    background: '#0075ff',
    padding: '15px 12px',
    borderRadius: 10,
    color: '#fff',
    margin: 8,
    marginTop: 0,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  atom2: {
    border: '1px solid #0075ff',
    padding: '15px 12px',
    borderRadius: 10,
    color: '#777',
    margin: 8,
    marginTop: 0,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: '12px',
    marginTop: 20
  }
}

const ModalMinting = ({ onClose }) => {

  const { width } = useWindowSize();
  const [netActive, setNetActive] = useState(-1);
  const [isGas, setIsGas] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { chain, isAuthenticated, login, setChain } = useWeb3Auth();

  useEffect(() => {
    if (!chain) return null;
    const newSelected = (PROD ? CHAINS_PROD : CHAINS_TEST).find((item) => item.chain === chain);
    setNetActive(newSelected?.idx || -1);
  }, [chain]);

  const handleSwitchNet = (e) => {
    if (!isAuthenticated) {
      // onClose();
      login();
    }else{
      console.log('== chain ==', e)
      setChain(e);
    }
  };

  const onSaveData = async () => {

    onClose();
    // if(netActive === -1 || !user?.attributes?.ethAddress){
    //   router.push('/wallet');
    //   return false;
    // }
    router.push('/makeNFTs?lazy=' + (!isGas ? 'true' : 'false'), undefined, { shallow: true })
  }

  return (
    <LayoutModal
      isOpen={true}
      title={'Minting new item'}
      onClose={onClose}
      description={'Which Blockchain do you want to mint on?'}
    >
      <div className="flex justify-center flex-wrap">

        {
          (PROD ? CHAINS_PROD : CHAINS_TEST).map((item, index) =>
            (item.idx === 2 && PROD) ? <CustomPopover
              content={'Coming Soon!'}
              placement="bottom"
              key={index}
            >
              <div
                className={netActive === item.idx ? 'btn-disabled btn-network1' : 'btn-disabled btn-network2'}
                onClick={() => handleSwitchNet(item.chain)}
              >
                {item.value}
              </div>
            </CustomPopover> : <div
              key={index}
              className={netActive === item.idx ? 'btn-network1' : 'btn-network2'}
              onClick={() => handleSwitchNet(item.chain)}
            >
              {item.value}
            </div>)
        }
      </div>

      <div style={styles.box}>
        <p className="text-center color-7" style={{ fontSize: 20, fontWeight: '500' }}>No Fee or Fee?</p>
        <div className="flex flex-row justify-center">
          <div style={!isGas ? styles.atom1 : styles.atom2} onClick={() => setIsGas(false)}>
            {width > 600 && <div>Lazy Mint</div>}
            {width > 600 && <img className="mt-2" src={`/img/${!isGas ? '21' : '11'}.svg`} alt="" />}
            <div className="mt-2 fw-6 text-center">No Gas Required</div>
            {width > 450 && <div className="fw-6" />}
          </div>
          <div style={isGas ? styles.atom1 : styles.atom2} onClick={() => setIsGas(true)}>
            {width > 600 && <div>Normal Mint</div>}
            {width > 600 && <img className="mt-2" src={`/img/${!isGas ? '20' : '10'}.svg`} alt="" />}
            <div className="mt-2 fw-6 text-center">Gas Fee Required</div>
            {width > 450 && <div className="fw-6" />}
          </div>
        </div>
      </div>

      <br />

      <div className="d-flex d-center">

        <input
          type="button"
          value="Proceed to Mint"
          onClick={onSaveData}
          // className={`btn-primary btn ${(netActive === -1 && window.ethereum) && 'btn-disabled'}`}
          className={'btn-primary btn'}

          style={{ background: '#0075ff' }}
        />
      </div>
      <ReactTooltip backgroundColor="#333" />

    </LayoutModal>
  );
};

export default ModalMinting;