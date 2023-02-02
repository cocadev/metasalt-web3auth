import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { MetaTag } from '../../../../components/MetaTag';
import UtilService from '../../../../sip/utilService';
import {
  GOERLI_MORALIS_APPID,
  GOERLI_MORALIS_SERVER_URL,
  MORALIS_API_KEY, PROD,
  PROD_MORALIS_APPID,
  PROD_MORALIS_SERVER_URL,
} from '../../../../keys';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useWindowSize from '../../../../hooks/useWindowSize';

const QRBox = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
`

const NftSellDetail = function (props) {

  const { image, name, description, isVideo, animation_url } = props;
  const router = useRouter();
  const [fullDisplay, setFullDisplay] = useState(false);

  const { net, token_address, token_id: ercTokenId } = router.query;
  const qrLink = `https://metasalt.io/nftmarketplace/${net}/${token_address}/${ercTokenId}`
  const cImage = animation_url || image;
  const ipfsImage = UtilService.ConvetImg(cImage);
  const isNFTVideo = (animation_url && animation_url !== image) ? true : (isVideo ? true : false);
  const { width, height } = useWindowSize();
  const windowRate = width > height;
  const qrSize = width / 20 > 80 ? width / 20 : 80

  useEffect(() => {
    try {
      ipfsImage && axios.get(ipfsImage).then(res => {
        if (res) {
          setFullDisplay(true)
        } else {
          setFullDisplay(false)
        }
      })
    } catch {

    }
  }, [ipfsImage])

  return (
    <div>
      <MetaTag {...{
        title: name,
        description: description,
        image: UtilService.ConvetImg(image)
      }} />

      <div className="d-center" style={{ height }}>

        <div className="text-center">
          {!isNFTVideo && <img src={fullDisplay ? ipfsImage : image} alt={''} style={{ height: windowRate ? height : 'auto', width: windowRate ? 'auto' : width }} />}
          {isNFTVideo && <video src={ipfsImage} controls className='w-100'></video>}
          {!ipfsImage && <Skeleton height={400} />}
          <QRBox className='flex absolute'>
            <div className='p-1 bg-white'>
              <QRCode value={qrLink} size={qrSize} />
            </div>
          </QRBox>
        </div>

      </div>

    </div>
  );
}

export default NftSellDetail;


export const getServerSideProps = async ({ res, query }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  const { net, token_address, token_id } = query;
  const Moralis = require('moralis/node')

  await Moralis.start({
    apiKey: MORALIS_API_KEY,
    serverUrl: PROD ? PROD_MORALIS_SERVER_URL : GOERLI_MORALIS_SERVER_URL,
    appId: PROD ? PROD_MORALIS_APPID : GOERLI_MORALIS_APPID
  });

  const LazyMintsQuery = new Moralis.Query('LazyMints').equalTo('tokenId', token_id);
  const object = await LazyMintsQuery.first();

  let image = ''
  let name = ''
  let description = ''
  let isVideo = ''
  let animation_url = ''

  if (object) {

    const { thumbnail, metadata } = object?.attributes;
    const response = JSON.parse(JSON.parse(metadata))

    image = response.image || thumbnail;
    name = response.name;
    description = response.description;

  } else {

    const options = {
      address: token_address,
      token_id: UtilService.DecimalToHex(token_id),
      chain: net,
    };

    const response = await Moralis.Web3API.token.getTokenIdMetadata(options);
    const metadata = JSON.parse(response.metadata)
    image = metadata?.image ? metadata.image : null
    name = metadata?.name ? metadata.name : null
    description = metadata?.description ? metadata.description : null

  }

  return {
    props: {
      image,
      name,
      description,
      isVideo,
      animation_url
    }
  }
}