import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Select from 'react-select';
import { useMoralis, useMoralisCloudFunction, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../store/actions/notifications/notifications';
import LayoutPage from '../components/layouts/layoutPage';
import { SmallLoading } from '../components/loading';
import { Title } from '../constants/globalCss';
import { DropdownStyles } from '../constants/dropdownlist';

const UploadCollectionPage = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { Moralis, account } = useMoralis();
  const { fetch } = useMoralisCloudFunction('loadNFTs', { autoFetch: false });

  const [contractAddress, setContractAddress] = useState();
  const [brand, setBrand] = useState();
  const [collection, setCollection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isCongrat, setIsCongrat] = useState(false);
  const { data: brands } = useMoralisQuery('RealBrands', query => query.equalTo('creatorId', account || '-'), [account]);
  const { data: collections } = useMoralisQuery('Brands', query => query.equalTo('creatorId', account).equalTo('brand', brand?.value || '-'), [brand]);

  const BRANDS = brands.map((item) => {
    return {
      value: item.id,
      label: item.attributes.title,
    }
  })

  const COLLECTIONS = collections.map((item) => {
    return {
      value: item.id,
      label: item.attributes.title,
    }
  })

  const onSaveProfile = async () => {

    if (!account) {
      router.push('/wallet', undefined, { shallow: true })
      return false;
    }

    if (!contractAddress || !collection || !brand) {
      const param = !contractAddress ? 'Contract Address' : !brand ? 'Brand' : 'Collection';
      dispatch(addNotification(`${param} is not optional.`, 'error'))
      return false;
    }

    // setIsLoading(true);
    const query1 = new Moralis.Query('LazyCollections');
    query1.equalTo('collection', collection.value);
    const addressDuplicated = await query1.first();

    if (addressDuplicated) {
      dispatch(addNotification('This contract address is already added. please select other collection.', 'error'));
      return false;
    }

    const query2 = new Moralis.Query('LazyCollections');
    query2.equalTo('collection', collection.value);
    const colldectionDuplicated = await query2.first();

    if (colldectionDuplicated) {
      dispatch(addNotification('This collection is already added. please select other collection.', 'error'));
      return false;
    }

    setIsLoading(true);

    const response = await fetch({
      params: {
        collectionAddress: contractAddress,
        chainId: '0x1',
        account,
        collection: collection.value,
        brand: brand.value,
        colName: 'LazyCollections'
      }
    });

    if (response > 0) {
      dispatch(addNotification(`Add the ${response} NFTs successful`, 'success'));
      setIsCongrat(true);

      const LazyCollectionTable = Moralis.Object.extend('LazyCollectionTable');
      const lazyCollectionTable = new LazyCollectionTable();
      await lazyCollectionTable.save({
        collectionAddress: contractAddress,
        chainId: '0x1',
        account,
        collection: collection.value,
        brand: brand.value,
      });

      router.back();
    } else {
      dispatch(addNotification('Sorry! We can not offer the JSON from this contract address.', 'error'));
    }
    setIsLoading(false);

  }

  const onCancel = () => {
    setContractAddress('');
    setBrand('');
    setCollection('');
  }

  return (
    <LayoutPage container congrat={isCongrat}>

      <section>

        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Upload New Collection</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Contract Address</h5>
                <input
                  className="form-control"
                  placeholder="Enter Contract Address to upload"
                  value={contractAddress}
                  onChange={e => setContractAddress(e.target.value)}
                />

                <div className="spacer-10" />

                <div className="d-row align-center">
                  <h5 className="color-b">Brand</h5>
                  <Link href='/create/brand' prefetch={false}>
                    <input type="button" className="btn-main tiny-btn" value="New Brand" style={{ width: 85 }} />
                  </Link>
                </div>

                <div className='dropdownSelect one'>
                  <Select
                    styles={DropdownStyles}
                    menuContainerStyle={{ 'zIndex': 999 }}
                    options={BRANDS}
                    onChange={(e) => setBrand(e)}
                    value={brand}
                  />
                </div>

                <div className="spacer-30" />

                <div className="d-row align-center">
                  <h5 className="color-b">Collection</h5>
                  <Link href='/create/brand' prefetch={false}>
                    <input type="button" className="btn-main tiny-btn" value="New Collection" style={{ width: 115 }} />
                  </Link>
                </div>

                <div className='dropdownSelect one'>
                  <Select
                    styles={DropdownStyles}
                    menuContainerStyle={{ 'zIndex': 999 }}
                    options={COLLECTIONS}
                    onChange={(e) => setCollection(e)}
                    value={collection}
                  />
                </div>

                <div className="spacer-30" />

                <div className="d-row align-center">

                  {!isLoading ? <div className="btn-main" onClick={onSaveProfile}>
                    Save
                  </div> : <SmallLoading small />}

                  <div
                    className="ml-4 btn btn-primary d-center"
                    style={{ height: 38 }}
                    onClick={() => onCancel()}
                  >Cancel</div>
                </div>

              </div>
            </form>
          </div>


        </div>

      </section>

    </LayoutPage>
  );
}

export default UploadCollectionPage;