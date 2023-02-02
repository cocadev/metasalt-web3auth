import React, { memo, useMemo } from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { onGetData } from '../../store/actions/nfts/nfts';
import { SmallLoading, TinyLoading } from '../../components/loading';
import NftCard from '../../components/cards/NftCard';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';

const ProfileNFTList = ({
  isLoading,
  isBig,
  realData,
  disableCount,
  enableLoadMore,
  onLoadMore,
  loading,
  allOrderData,
  allVerifications,
}) => {

  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const { Moralis } = useMoralis()

  const orderingList = useMemo(() => {
    const filtered = allOrderData.filter(item => item?.completed !== true)
    return filtered.map(item => item.tokenId)
  }, [allOrderData])
  const saleCheckDataIds = useMemo(() => {
    const filtered = allOrderData.filter(item => item?.completed === true)
    return filtered.map(item => item.tokenId)
  }, [allOrderData])
  const verificationIds = useMemo(() => {
    const filtered = allVerifications.filter(item => item?.verifier === user?.account)
    return filtered.map(item => item.tokenURI)
  }, [allVerifications, user?.account])

  const filteredData = realData?.reduce((filtered, item) => {

    const {
      name = '',
      description = '',
      category = '',
      image = '',
      isVideo,
      animation_url,
      thumbnail: thumb,
    } = (typeof item.metadata === 'object' ? item.metadata : JSON.parse(item.metadata)) || '-';
    const hexTokenId = item.tokenId || item.token_id;
    const myOrderData = allOrderData.find(item => item?.tokenId === hexTokenId)
    const newPrice = myOrderData?.price;
    const cImage = UtilService.ConvetImg(item?.image || image);
    const isMetasalt = UtilService.checkMetasalt(item.token_address)

    filtered.push({
      newPrice,
      image: UtilService.ConvetImg(animation_url) || cImage,
      category,
      isVideo: (animation_url && animation_url !== image) ? true : isVideo,
      hexTokenId,
      name: name || item?.name || 'NFT',
      description,
      orderingList,
      verificationIds,
      saleCheckDataIds,
      supply: item.contract_type === 'ERC1155' ? item.amount : 0,
      lazyMint: item?.lazyMint,
      isMetasalt,
      token_address: item.token_address,
      thumbnail: (animation_url ? cImage : item.thumbnail) || thumb,
      net: item?.net
    })
    return filtered;
  }, []);

  const onRefreshData = () => {
    dispatch(onGetData(Moralis, 0, user?.account))
  }

  return (
    <div>
      {!disableCount &&
        <div className='ml-20 mb-3 color-7'>
          &nbsp;{loading
          ? <span className="icon_loading" style={{ color: '#bbb' }}></span>
          : <span className="icon_refresh cursor" onClick={onRefreshData} style={{ color: '#bbb' }}></span>
        }
          &nbsp;&nbsp;&nbsp;{filteredData.length}
          &nbsp;items
        </div>
      }
      <div className='flex flex-wrap align-items-start justify-content-center'>
        {isLoading && <SmallLoading />}
        {filteredData.map((item, index) => {
          const {
            name,
            description,
            category,
            image,
            newPrice,
            orderingList,
            hexTokenId,
            verificationIds,
            saleCheckDataIds,
            isVideo,
            lazyMint,
            supply,
            isMetasalt,
            token_address,
            thumbnail,
            net
          } = item;

          return (
            <div key={index}>
              <NftCard
                nft={{
                  preview_image_url: image,
                  title: name,
                  price: newPrice,
                  description,
                  lazyMint,
                  ordering: orderingList?.includes(hexTokenId),
                  verified: verificationIds?.includes(hexTokenId),
                  onsale: saleCheckDataIds?.includes(hexTokenId),
                  categoryId: category?.value,
                  isVideo,
                  isMetasalt,
                  token_address,
                  thumbnail,
                  net
                }}
                mine={true}
                big={isBig}
                token_id={hexTokenId}
                supply={supply}
              />
            </div>)
        })}
      </div>

      {enableLoadMore && !loading &&
        <div className='w-100 d-flex align-items-start justify-content-center'>
          <div className='btn btn-primary mt-5' onClick={onLoadMore}>Load More</div>
        </div>
      }

      {loading &&
        <div className='mt-4 d-flex align-items-center justify-content-center'>
          <TinyLoading />
        </div>
      }
    </div>
  );
}

export default memo(ProfileNFTList);
