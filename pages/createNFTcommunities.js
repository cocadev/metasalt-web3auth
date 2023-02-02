import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useWindowSize from '../hooks/useWindowSize';
import LayoutPage from '../components/layouts/layoutPage';
import GatedDetailPage from '../atoms/createNFTcommunities/gatedDetailPage';
import { useWeb3Auth } from '../services/web3auth';
import { getBrandsByCreator, getCollectionByCreatorAndBrand } from '../common/api';
import { Title } from '../constants/globalCss';

const GatedLeftMenu = dynamic(() => import('../atoms/createNFTcommunities/gatedLeftMenu'));

const TitleSection = styled.div`
  padding: 80px 0 40px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    padding: 40px 20px;
  }
`

function CreatorGatePage() {

  const { width } = useWindowSize()
  const { user } = useWeb3Auth()
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [isCongrat, setIsCongrat] = useState(false)
  const [filterBrands, setFilterBrands] = useState([])
  const [filterCollections, setFilterCollections] = useState([])

  const { gated } = useSelector(state => state.nfts);
  const { brand } = gated;

  useEffect(() => {
    const loadBrandsByCreator = async () => {
      const response = await getBrandsByCreator({ creatorId: user?.account })
      if (response) {
        const BRANDS = response.map((item) => {
          return {
            value: item.id,
            label: item.attributes.title,
          }
        })
        const FILTER_BRANDS = BRANDS.concat({ value: 1, label: 'Create New Brand', link: true })
        setFilterBrands(FILTER_BRANDS)
      } else {
        setFilterBrands([{ value: 1, label: 'Create New Brand', link: true }])
      }
    }

    if (user?.account) {
      loadBrandsByCreator().then()
    }
  }, [user?.account])

  useEffect(() => {
    const loadCollectionByCreatorAndBrand = async () => {
      const response = await getCollectionByCreatorAndBrand({ creatorId: user?.account, brandId: brand?.value })
      if (response) {
        const COLLECTIONS = response.map((item) => {
          return {
            value: item.id,
            label: item.attributes.title,
          }
        })
        const FILTER_COLLECTIONS = COLLECTIONS.concat({ value: 2, label: 'Create New Collection', link: true })
        setFilterCollections(FILTER_COLLECTIONS)
      } else {
        setFilterCollections([{ value: 2, label: 'Create New Collection', link: true }])
      }
    }

    if (brand && user?.account) {
      loadCollectionByCreatorAndBrand().then()
    }
  }, [brand, user?.account])

  const handleClose = () => {
    setIsOpenMenu(false);
  }

  return (
    <LayoutPage congrat={isCongrat}>
      <TitleSection>
        <Title>{'Create NFT Community'}</Title>
      </TitleSection>
      <br/>
      <div className='d-row'>
        {width > 850 && <GatedLeftMenu collections={filterCollections} brands={filterBrands} />}
        {width <= 850 &&
          <Offcanvas style={{ background: '#1a1a1a', width: 340 }} show={isOpenMenu} onHide={handleClose} placement='start'>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="color-b">Create NFT Community</Offcanvas.Title>
            </Offcanvas.Header>
            <GatedLeftMenu collections={filterCollections} brands={filterBrands}/>
          </Offcanvas>
        }

        <GatedDetailPage collections={filterCollections} brands={filterBrands} onFinish={() => setIsCongrat(true)} />

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
      </div>
    </LayoutPage>
  );
}

export default CreatorGatePage;
