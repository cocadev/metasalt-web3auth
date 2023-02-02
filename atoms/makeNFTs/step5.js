import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Web3 from 'web3';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useDispatch, useSelector } from 'react-redux';
import { onRemoveCreator, onUpdateCreator } from '../../store/actions/nfts/nfts';
import { addNotification } from '../../store/actions/notifications/notifications';
import NftCard from '../../components/cards/NftCard';
import { TinyLoading } from '../../components/loading';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { SignMint1155, SignMint721 } from '../../sip/LazymintConfig';
import { GetRandomIntInRange } from '../../common/function';
import { createLazyMint, createMintSupplyErc1155, getCollectionById, updateCollectionById } from '../../common/api';
import { InfuraAuth, InfuraLink, PROD } from '../../keys';

const Cryptr = require('cryptr');
const cryptr = new Cryptr('MetasaltSecret10');
const mint721ABI = require('../../constants/abis/mint721ABI.json');
const mint1155ABI = require('../../constants/abis/mint1155ABI.json');

function Step5({ onFinish }) {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user, web3Auth, chain } = useWeb3Auth()
  const [isLoading, setIsLoading] = useState(false)

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })
  const isLazyMint = router.query?.lazy === 'true';
  const isRedirectCommunity = router.query?.redirect === 'createNFTcommunities';
  const chainId = UtilService.getChain4(chain);
  const account = user?.account;
  const { nft } = useSelector(state => state.nfts)
  const {
    title,
    description,
    tokenPrice,
    royalties,
    code,
    baseFile,
    file,
    brand,
    collection,
    counts,
    erc1155,
    privateSale,
    isVideo,
    rate,
    tags,
    attributes,
    thumbnail
  } = nft;

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  const onDiscard = () => {
    dispatch(onUpdateCreator({ royalties: null, step: 4 }))
  }

  const uploadMetadata = async (imageURL) => {
    const encryptedString = cryptr.encrypt(JSON.stringify({ code, brand }));
    const tokenMetadata = {
      image: 'ipfs://' + imageURL.path,
      thumbnail,
      category: collection,
      name: title,
      description: UtilService.EmojiToString(description),
      hashed: encryptedString,
      brand,
      isVideo,
      rate,
      royalties: royalties * 10,
      tags: JSON.stringify(tags),
      attributes,
    };

    console.log('metadata::::::::', tokenMetadata)

    const result = await ipfs.add(JSON.stringify(tokenMetadata, null, 4), 'file.json');
    return {
      cMeta: JSON.stringify(tokenMetadata),
      uri: 'ipfs.moralis.io:2053/ipfs/' + result.path
    };
  };

  const onMint = async () => {

    const web3authProvider = await web3Auth.connect();
    const web3 = new Web3(web3authProvider);

    // const chainList = (PROD ? CHAINS_PROD : CHAINS_TEST)?.map((item) => item.key);
    // const isAvailable = chainList.includes(chainId);
    const isAvailable = true;

    if (!isAvailable) {
      dispatch(addNotification(`${UtilService.getChain2(chainId)} are not allowed to mint. please select other network!`, 'error'));
      return false;
    }

    setIsLoading(true);
    const total = 6; // display counts of all nfts (Rodel's work)
    const image = await ipfs.add(file);
    const { cMeta = '', uri: tokenURI = '' } = await uploadMetadata(image);
    const minter = account;
    const tokenId = minter + 'b' + UtilService.FormatNumberLength(chainId.substring(2), 5) + GetRandomIntInRange(10000, 99999) + UtilService.FormatNumberLength(total, 13);
    const supply = counts;
    const royaltyFee = Number(royalties) * 10;

    try {

      let signature;

      if (erc1155) {
        signature = await SignMint1155(web3, tokenId, tokenURI, supply, minter, royaltyFee, minter, UtilService.getMint1155Address(chainId));
      } else {
        signature = await SignMint721(web3, minter, tokenId, tokenURI, minter, royaltyFee, UtilService.getMintAddress(chainId));
      }

      const metadata = {
        token_id: tokenId,
        tokenURI,
        creator: account,
        royaltyFee: royalties * 10 + '' || '0',
        signature: signature,
        type: erc1155 ? 'ERC1155' : 'ERC721',
        supply: erc1155 ? Number(supply) : 1,
        privateSale,
        thumbnail,
      }

      // const params = erc1155 ? {
      //   to: account,
      //   data: metadata,
      //   _amount: Number(supply)
      // } : {
      //   to: account,
      //   data: metadata,
      // }

      const contractAddress = erc1155 ? UtilService.getMint1155Address(chainId) : UtilService.getMintAddress(chainId);

      if (isLazyMint) {
        await createLazyMint({
          ...metadata,
          metadata: cMeta,
          collectionId: collection?.value,
          token_address: contractAddress,
          creator: minter
        }).then(res => console.log('res', res))

        if (collection) {
          const response = await getCollectionById({ id: collection?.value })
          if (response) {
            const volume = Number(response.volume) + 1 || 0
            await updateCollectionById({ id: collection?.value, volume })
          }
        }

        if (PROD) {
          /*
          const link = `https://www.metasalt.io/nftmarketplace/${PROD ? 'eth' : 'goerli'}/${contractAddress}/${metadata.tokenId}`
          await sendNotificationToAll({
            userId: user.id,
            account: user.attributes.accounts ? user.attributes.accounts[0] : '',
            username: user.attributes.username,
            avatar: user.attributes.avatar,
            type: 'mint',
            tag: null,
            link,
          })
          */
        }

        dispatch(addNotification('Lazy mint successful, it will appear in your collections shortly.', 'success'))
        dispatch(onRemoveCreator());

      } else {

        const contract = new web3.eth.Contract(erc1155 ? mint1155ABI.abi : mint721ABI.abi, contractAddress, minter);
        const mint = erc1155 
          ? contract.methods.mintAndTransfer(metadata, minter, Number(supply))
          : contract.methods.mintAndTransfer(metadata, minter)

        await mint
          .send({ from: minter })
          .on('transactionHash', (transactionHash) => {
            console.log('Hash', transactionHash);
          })
          .then((result) => {
            console.log('The NFTs are minted', result);
          });

        // await Moralis.executeFunction(mint_request);
        dispatch(addNotification('Mint successful!, it will appear in your collections shortly.', 'success'))
        dispatch(onRemoveCreator());
      }

      if (erc1155) {
        await createMintSupplyErc1155({
          creator: account,
          token_address: UtilService.getMint1155Address(chainId),
          token_id: tokenId,
          isLazyMint,
          supply,
        })
      }

      if (isRedirectCommunity) {
        handleRouters('/createNFTcommunities')
      } else {
        onFinish();
        setTimeout(() => {
          handleRouters('/nftmarketplace')
        }, 2000)
      }

    } catch (e) {

      dispatch(addNotification(e.message, 'error'))
    }
    setIsLoading(false);
  };

  const verifyCallback = () => {
  }

  const expiredCallback = () => {
    dispatch(onUpdateCreator({ captcha: false }))
  }

  const onReCaptcha = () => {
    dispatch(onUpdateCreator({ captcha: true }))
  }

  return (
    <div className="col-lg-6 m-auto">

      <h2 className="text-white">Royalties</h2>

      <p className="text-white">How much will each sale return to original minter</p>

      <div className="d-flex mb-2" style={{ border: '1px solid #8364E2' }}>
        <input
          className="form-control m-0"
          rows="2"
          style={{ border: '1px solid #ccc' }}
          value={royalties}
          placeholder='Suggested 3%. Max is 50%'
          type="number"
          onChange={e => dispatch(onUpdateCreator({ royalties: e.target.value }))}
        />
      </div>

      <div className="d-flex flex-wrap">
        <ReCAPTCHA
          sitekey="6LfYL5seAAAAANK278M6LrrByHpDD_yKCiqbp_jk"
          callback={verifyCallback}
          expiredCallback={expiredCallback}
          onChange={onReCaptcha}
        />
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
      </div>

      {isLoading ?
        <TinyLoading />
        :
        <button className={'btn-main my-3'} onClick={onMint}>Mint</button>
      }

      <div className='d-center'>
        <h5 className="color-7 mt-5">Preview item</h5>
        <NftCard
          nft={{
            title: title || '1 MSN',
            description: 'Metasalt Token ',
            preview_image_url: baseFile,
            price: tokenPrice,
            isVideo,
            thumbnail
          }}
          disableLink={true}
          big={true}
          favHidden
        />
      </div>

      <div className="spacer-30"></div>
    </div>
  )
}

export default Step5;
