import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import clsx from 'clsx';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { Step4 } from '../components/loading';
import { useWeb3Auth } from '../services/web3auth';
import UtilService from '../sip/utilService';
import { onSaveRewards } from '../common/web3Api';
import { createVerification, getRewardsByOwner, getVerificationByVerifierAndTokenURI } from '../common/api';
import { PROD, VERIFY_PRICE } from '../keys';

const NftCard = dynamic(() => import('../components/cards/NftCard'));
const Cryptr = require('cryptr');
const cryptr = new Cryptr('MetasaltSecret10');


const Title = styled.div`
  background: #6e7ea5;
  padding: 2px;
  font-size: 18px;
  color: #fff;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
    padding: 4px;
  }
`


function AuthenticationPage() {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const [tokenURI, setTokenURI] = useState('')
  const [rewards, setRewards] = useState(0)
  const [viewNFT, setViewNFT] = useState(null)
  const [myNFT, setMyNFT] = useState(0)

  const search = router.query.token
  const { nfts } = useSelector(state => state.nfts)
  const isEnabledMint = rewards - VERIFY_PRICE >= 0 && tokenURI
  const { Moralis, chainId } = useMoralis();


  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const onGetRewards = useCallback(async () => {
    const response = await getRewardsByOwner({ owner: user?.account })
    const totalRewards = PROD ? (response?.ETH || 0) + (response?.POLYGON || 0) : (response?.GOERLI || 0) + (response?.MUMBAI || 0);
    setRewards(totalRewards)
  }, [user?.account])

  useEffect(() => {
    setTimeout(() => onGetRewards(), 1000)
  }, [onGetRewards, user?.account])

  useEffect(() => {
    if (search) {
      setTokenURI(search)
    }
  }, [search])

  const onViewNFT = () => {
    const nft = nfts.find((item) => item.token_id === tokenURI);
    if (nft) {
      const meta = JSON.parse(nft.metadata);
      const { image, chainId, description, price, name, isVideo, rate } = meta;
      setViewNFT({
        chainId,
        description,
        image,
        name,
        price,
        isVideo,
        rate,
        thumbnail: nft?.thumbnail
      });
    } else {
      dispatch(addNotification('Can\'t find NFT with this token URI.', 'error'))
    }
  }

  const onAuth = async () => {
    const response = await getVerificationByVerifierAndTokenURI({ verifier: user?.account, tokenURI })
    const nft = nfts.find((item) => item.token_id === tokenURI);

    if (response.length > 0) {
      dispatch(addNotification('You already authenticated this NFT!', 'error'))
      return false
    }

    if (nft) {
      const meta = JSON.parse(nft.metadata);
      let qrcode, myBrand = null;
      const decrypted = meta?.hashed ? await cryptr.decrypt(meta?.hashed) : null;

      if (decrypted) {
        const x = JSON.parse(decrypted)
        qrcode = x?.code
        myBrand = x.brand?.label
      }

      setMyNFT({
        category: myBrand, qrcode,
        title: meta.name,
        price: meta.price,
        counts: nft.amount
      });
      const request = { Moralis, account: user?.account, chainId, counts: -1 }
      dispatch(onSaveRewards(request, () => {}))
      dispatch(addNotification('Authenticate successful', 'success'))

      await createVerification({
        price: VERIFY_PRICE,
        verifier: user?.account,
        tokenURI,
      })
    } else {
      dispatch(addNotification('We can\'t find this NFT!', 'error'))
    }
  }


  return (
    <LayoutPage>
      <LayoutScreen
        title='Authenticate your NFTs'
        description='Do your due diligence. Know that your NFT is not a counterfeit or fake.'
      >
        <section className="container color-b">
          <div className="row">
            <div className="col-lg-12">
              <Title className='text-center'>FOLLOW THE STEPS TO AUTHENTICATE</Title>

              <div className="flex responsive-row">
                <div className="f-1 flex-col stepbox" style={{ background: '#222' }}>
                  <div style={{ height: 160 }} className='d-center'>
                    <Step4 />
                    <div style={{ color: '#6e7ea5', fontSize: 20, fontWeight: '600', marginTop: 12 }}>STEP 1:</div>
                    <div style={{ color: '#bbb', fontSize: 18, fontWeight: '600', marginTop: -5, marginBottom: 16 }}>Metasalt Tokens</div>
                  </div>
                  <div className="text-center f-1 flex-col" style={{ minHeight: 150 }}>
                    <div className="color-7 text-center">You have {rewards > 0 ? rewards : 0} Metasalt tokens</div>
                    {rewards - VERIFY_PRICE >= 0
                      ? <p>Balance after authentication: <span style={{ fontSize: 25, color: 'red', fontWeight: '600' }}> {rewards - VERIFY_PRICE}</span></p>
                      : <div>
                          <div className="alert alert-danger text-center" style={{ marginTop: 20, fontSize: 14 }}>
                            Can't authenticate because you don't have enough $METASALT tokens.
                            Please&nbsp;
                            <Link href='/creator' className='text-decoration-underline' prefetch={false}>
                              create
                            </Link>
                            &nbsp;at least one NFT before authentication or buy on&nbsp;
                            <Link href='/$metasalttokens' className='text-decoration-underline' prefetch={false}>
                              Uniswap
                            </Link>.
                            <br/>
                          </div>
                        </div>
                    }
                    <p>Authentication Cost: <span style={{ fontSize: 25, color: 'red', fontWeight: '600' }}>{VERIFY_PRICE}</span> Metasalt tokens</p>
                  </div>
                  <div className="d-center">
                    <div className="box-btn1 btn-main" onClick={() => handleRouters('/$metasalttokens')}>
                      BUY METASALT
                    </div>
                  </div>
                </div>
                <div className="f-1 flex-col stepbox" style={{ background: '#222' }}>
                  <div style={{ height: 160 }} className='d-center'>
                    <Step4 />
                    <div style={{ color: '#6e7ea5', fontSize: 20, fontWeight: '600', marginTop: 12 }}>STEP 2:</div>
                    <div style={{ color: '#bbb', fontSize: 18, fontWeight: '600', marginTop: -5, marginBottom: 16 }}>Input Token URI</div>
                  </div>
                  <div className="d-center f-1">
                    <div className="text-center">
                      Click on VIEW to confirm NFT details.
                    </div>
                    <input
                      name="item_name"
                      id="item_name"
                      className="form-control mt-3"
                      placeholder="Input the token URI"
                      value={tokenURI}
                      onChange={(e) => setTokenURI(e.target.value)}
                    />
                  </div>
                  <div className="d-center">
                    <div className="box-btn1 btn-main" onClick={onViewNFT}>
                      VIEW
                    </div>
                  </div>
                </div>
                <div className="f-1 flex-col stepbox" style={{ background: '#222' }}>
                  <div style={{ height: 160 }} className='d-center'>
                    <Step4 />
                    <div style={{ color: '#6e7ea5', fontSize: 20, fontWeight: '600', marginTop: 12 }}>STEP 3:</div>
                    <div style={{ color: '#bbb', fontSize: 18, fontWeight: '600', marginTop: -5, marginBottom: 16 }}>NFT</div>
                  </div>
                  <div className="d-center" style={{ minHeight: 150 }}>
                    <NftCard
                      nft={{
                        title: viewNFT?.name,
                        description: viewNFT?.description,
                        preview_image_url: UtilService.ConvetImg(viewNFT?.image),
                        price: viewNFT?.price,
                        isVideo: viewNFT?.isVideo,
                        thumbnail: viewNFT?.thumbnail
                      }}
                      disableLink={true}
                      big={false}
                      favHidden
                      demo={true}
                    />
                    <input
                      type="button"
                      id="submit"
                      value="AUTHENTICATE"
                      onClick={onAuth}
                      className={clsx('btn-main box-btn1', !isEnabledMint && 'btn-disabled')}
                    />
                  </div>
                </div>
                <div className="f-1 flex-col stepbox" style={{ background: '#222', maxWidth: 300 }}>
                  <div style={{ height: 160 }} className='d-center'>
                    <Step4 />
                    <div style={{ color: '#6e7ea5', fontSize: 20, fontWeight: '600', marginTop: 12 }}>STEP 4:</div>
                    <div style={{ color: '#bbb', fontSize: 18, fontWeight: '600', marginTop: -5, marginBottom: 16 }}>Result</div>
                  </div>
                  <div className="d-center f-1">
                    {myNFT ?
                      <div className="color-7 overflow-hidden" style={{ maxWidth: 270 }}>
                        <h5 className="color-7 text-center">
                          QR Code:
                          <span style={{ fontSize: 14, fontWeight: '400', wordWrap: 'break-word' }}>
                            <br /><br />
                            {myNFT.qrcode ||
                              <QRCode
                                size={170}
                                value={JSON.stringify({
                                  title: myNFT.title,
                                  price: myNFT.price,
                                  counts: myNFT.counts
                                })}
                              />
                            }
                          </span>
                        </h5>
                        <br />
                        <h5 className="color-7 text-center">Brand: <span
                          style={{ fontSize: 14, fontWeight: '400' }}>{myNFT.category}</span></h5>
                        <br /><br />
                        <div className="spacer-30" />
                        <br />
                      </div>
                      :
                      <></>
                    }
                  </div>
                  <div className="d-center">
                    <div className="box-btn1 btn-main" onClick={() => handleRouters('/nftmarketplace')}>
                      MARKETPLACE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default AuthenticationPage;
