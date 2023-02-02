import React, { memo } from "react";
import NftCard from "../../components/cards/NftCard";
import { useMoralisQuery } from 'react-moralis';
import { useSelector } from "react-redux";
import UtilService from "../../sip/utilService";

const NFTMarketplace = () => {

  const { nfts } = useSelector(state => state.nfts)
  const { data: orderdata } = useMoralisQuery("OrderData", query => query.descending("createdAt"));

  return (
    <div className='nft flex flex-row flex-wrap d-center'>
      {
        nfts
          .filter(({_}, index) => index < 6)
          .map((item, index) => {
            if (!item.metadata) {
              return null
            }
            const {image, price, category, isVideo, name } = JSON.parse(item.metadata);
            const moralisOrderData = orderdata.length > 0 && orderdata.find(x => x.attributes.tokenId === item.token_id);
            const token_address = item.token_address;
            const isMetasalt = UtilService.checkMetasalt(item.token_address);
              
            return (
              <div key={index}>
                <NftCard
                  nft={{
                    preview_image_url: image,
                    title: name,
                    price: moralisOrderData?.attributes?.price || price,
                    description: 'Metasalt Token ',
                    lazyMint: item?.lazyMint,
                    categoryId: category?.value,
                    isVideo,
                    isMetasalt,
                    token_address
                  }}
                  big={true}
                  token_id={item.token_id}
                  favHidden={true}
                />
              </div>)
          })
      }
    </div>
  );
}

export default memo(NFTMarketplace);
