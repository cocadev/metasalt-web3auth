import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useWindowSize from '../hooks/useWindowSize';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';
import { getBrandsByCreator, getCollectionByCreatorAndBrand } from '../common/api';
import { useWeb3Auth } from '../services/web3auth';

const ModalMinting = dynamic(() => import('../components/modals/modalMinting'));
const NftLeftMenu = dynamic(() => import('../atoms/makeNFTs/nftLeftMenu'));
const Step0 = dynamic(() => import('../atoms/makeNFTs/step0'));
const Step1 = dynamic(() => import('../atoms/makeNFTs/step1'));
const Step2 = dynamic(() => import('../atoms/makeNFTs/step2'));
const Step3 = dynamic(() => import('../atoms/makeNFTs/step3'));
const Step4 = dynamic(() => import('../atoms/makeNFTs/step4'));
const Step5 = dynamic(() => import('../atoms/makeNFTs/step5'));


function MakeNFTsPage() {

  const { user } = useWeb3Auth();
  const { width } = useWindowSize();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [isCongrat, setIsCongrat] = useState(false);
  const [myBrands, setMyBrands] = useState([])
  const [myCollections, setMyCollections] = useState([])

  const { nft } = useSelector(state => state.nfts);
  const { step, baseFile, brand, rate, tags, attributes } = nft;

  const handleClose = () => {
    setIsOpenMenu(false);
  }

  useEffect(() => {
    const loadCollectionByCreatorAndBrand = async () => {
      const response = await getCollectionByCreatorAndBrand({ creatorId: user?.account, brandId: brand?.value })
      if (response) {
        const collections = response.map(item => {
          return {
            value: item._id,
            label: item.title,
            ...item
          }
        })
        setMyCollections(collections)
      }
    }

    if (brand && user?.account) {
      loadCollectionByCreatorAndBrand().then()
    }
  }, [brand, user?.account])

  useEffect(() => {
    const loadBrandsByCreator = async () => {
      const response = await getBrandsByCreator({ creatorId: user?.account })
      if (response) {
        const brands = response.map(item => {
          return {
            value: item._id,
            label: item.title,
            ...item
          }
        })
        setMyBrands(brands)
      }
    }

    if (user?.account) {
      loadBrandsByCreator().then()
    }
  }, [user])

  useEffect(() => {
    setShowMintModal(true)
  }, [])

  return (
    <LayoutPage congrat={isCongrat}>
      <LayoutScreen title='Create NFT'>
        <div className='d-row'>
          {width > 850 && <NftLeftMenu brands={myBrands} collections={myCollections} />}
          {width <= 850 && <Offcanvas style={{ background: '#1a1a1a', width: 340 }} show={isOpenMenu} onHide={handleClose} placement='start'>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="color-b">Create NFT</Offcanvas.Title>
            </Offcanvas.Header>
            <NftLeftMenu brands={myBrands} collections={myCollections} />
          </Offcanvas>}

          <div className='w-100' style={{ minHeight: '100vh', color: 'white' }}>
            <div className="mx-2 h-100 p-4" style={{ background: '#1a1a1a' }}>
              <div className="row" style={{ paddingTop: 80 }}>
                {step === 0 && <Step0 brands={myBrands} />}
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 baseFile={baseFile} rate={rate} />}
                {step === 3 && <Step3 />}
                {step === 4 && <Step4 tags={tags} attributes={attributes}/>}
                {step === 5 && <Step5 onFinish={()=>setIsCongrat(true)}/>}
              </div>
            </div>
          </div>

          {width <= 850 &&
            <picture>
              <img
                src="/img/menu.png"
                className="cursor"
                alt=""
                style={{ position: 'absolute', left: 12, width: 40 }}
                onClick={() => setIsOpenMenu(!isOpenMenu)}
              />
            </picture>
          }
          {showMintModal && <ModalMinting onClose={() => setShowMintModal(false)} />}
        </div>

      </LayoutScreen>
    </LayoutPage>
  );
}

export default MakeNFTsPage;
