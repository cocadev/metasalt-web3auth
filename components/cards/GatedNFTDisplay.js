import Link from 'next/link';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { PROD } from '../../keys';
import UtilService from '../../sip/utilService';

const GatedNFTDisplay = ({ data }) => {

  const [isValidImg, setIsValidImg] = useState([]);
  const { nfts: nfts721 } = useSelector(state => state.nfts);
  const { addedNFT: nfts, addedGlobalNFT: globalNFTs } = data?.attributes || '';

  const token_net = PROD ? 'eth': 'goerli';
  const nftData = JSON.parse(nfts || '{}');
  const nft = nftData.map(x => x.token_id);
  const globalNFT = JSON.parse(globalNFTs || '{}');

  const metasaltNFTs = nft.length > 0 ? nft?.reduce(function (filtered, item) {
    const nftObject = nfts721?.find(x => x.token_id === item);
    if (nftObject) {
      const metadata = JSON.parse(nftObject.metadata);
      filtered.push({
        nftId: item,
        image: metadata.image,
        name: metadata.name
      })
    }
    return filtered;
  }, []) : [];

  const mainnetNFTs = globalNFT.length > 0 ? globalNFT?.reduce(function (filtered, item) {
    if (item.metadata) {
      const metadata = JSON.parse(item.metadata);
      const image = UtilService.ConvetImg(metadata?.image);

      filtered.push({
        token_address: item.token_address,
        image,
        name: metadata.name || '-'
      })
    }
    return filtered;
  }, []) : [];

  const isNFTAvailable = (metasaltNFTs.length + mainnetNFTs.length) > 0

  const onErrorVideo = (e, pp) => {
    if (e.type === 'error') {
      setIsValidImg(isValidImg.concat(pp));
    } else {
      return null
    }
  }

  if (!isNFTAvailable){
    return <div>No NFT</div>
  }

  return (
    <div className='offer-body'>
      <div className='flex flex-row hidden flex-wrap d-center'>
        {
          metasaltNFTs.length > 0 && metasaltNFTs?.map((item, index) => {
            return (<Link
              key={index}
              style={{ border: '2px solid #444', margin: 5, borderRadius: 8 }}
              className='relative d-center cursor'
              href={`/nftmarketplace/${token_net}/${item.token_address}/${item.nftId}`}
              prefetch={false}
            >
              <div className='m-1'>
                <div style={{ height: 150 }} className='d-center'>
                  <img src={item.image} alt="nft" style={{ maxWidth: 150, maxHeight: 150 }} />
                </div>
                <div className='text-center'>{item.name}</div>
              </div>
            </Link>)
          })
        }
        {
          mainnetNFTs.length > 0 && mainnetNFTs?.map((item, index) => {
            return (
              <a
                key={index}
                style={{ border: '2px dashed #bbb', margin: 5, borderRadius: 8 }}
                className='relative d-center cursor'
                href={'https://etherscan.io/address/' + item.token_address}
                target="_blank"
                // rel="noopener noreferer"
                rel="noreferrer"
              >
                <div style={{ height: 150 }} className='d-center'>
                  {isValidImg.includes(index) && <img src={item.image} alt="nft" style={{ maxWidth: 150, maxHeight: 150 }} />}
                  {!isValidImg.includes(index) && <video src={item.image} preload="auto" autoPlay={true} onError={e => onErrorVideo(e, index)} style={{ maxWidth: 150, maxHeight: 150 }} />}
                </div>
                <div>{item.name}</div>
              </a>)
          })
        }
      </div>
    </div>
  );
};

export default GatedNFTDisplay;        
