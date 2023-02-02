import React, { memo, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useMoralisQuery } from 'react-moralis';
import { useRouter } from 'next/router';

const HeaderSearch = () => {

  const { data: nftGates } = useMoralisQuery('NFTGates', query => query.descending('createdAt'));
  const [searchKey, setSearchKey] = useState();
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();

  return (

    <div style={{ display: 'flex', flex: 1, position: 'relative', marginLeft: 12, marginRight: 12, borderRadius: 10, maxWidth: 550 }}>
      <img src={'/img/search-black.png'} alt='search-black' style={{ position: 'absolute', top: 12, right: 12 }} />
      <input
        className="top-search main-font"
        placeholder="Search Communities"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        onClick={() => setIsShow(true)}
      />
      {isShow &&
        <div
          className='w-100 position-absolute overflow-auto'
          style={{ top: 40, boxShadow: '0 0.25rem 0.25rem rgb(0 0 0 / 25%)', padding: 12, background: '#111', maxHeight: 300, zIndex: 100 }}>
          <OutsideClickHandler onOutsideClick={() => setIsShow(false)}>
            NFT
            {
              nftGates.map((nft, index) => {
                const { img, title } = nft.attributes;
                if (searchKey && !title?.toLowerCase().includes(searchKey?.toLowerCase())) {
                  return null
                }

                return (
                  <div
                    key={index}
                    className='flex-row items-center flex cursor'
                    onClick={() => {
                      setIsShow(false);
                      router.push(`/nftcommunities?search=${title}`, undefined, { shallow: true })
                    }}
                  >
                    <div style={{ width: 50, height: 50 }} className='d-center'>
                      <img src={img} alt="" style={{ width: 'auto', maxHeight: 40, maxWidth: 40 }} />
                    </div>
                    <div style={{ marginLeft: 12, marginTop: 12 }}>
                      {title}
                    </div>
                  </div>
                )
              })}
          </OutsideClickHandler>
        </div>
      }
    </div>
  );
};

export default memo(HeaderSearch);        