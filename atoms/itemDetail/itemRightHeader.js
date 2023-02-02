import React, { useCallback, useEffect, useState } from 'react';
import { DEMO_AVATAR } from '../../keys';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { useWeb3Auth } from '../../services/web3auth';
import UtilService from '../../sip/utilService';
import { onLikes } from '../../common/web3Api';

const Title = styled.div`
  font-size: 35px;
  font-weight: 600;

  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`

const ItemRightHeader = ({ myNFT, brand, creator, totalSupply }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useWeb3Auth()
  const { Moralis } = useMoralis();
  const { token_id: ercTokenId, token_address } = router.query;
  const { name, category } = (myNFT?.metadata && JSON.parse(myNFT?.metadata)) || '-';
  const [collectionAvatar, setCollectionAvatar] = useState();
  const [trigger, setTrigger] = useState(1);
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('itemId', ercTokenId), [ercTokenId, trigger], { autoFetch: true });
  const isLike = likes.find(item => item.attributes.userId === user?._id);
  const isERC1155 = myNFT?.contract_type === 'ERC1155';
  const nftName = name || myNFT?.name;

  useEffect(() => {
    if (category) {
      setTimeout(() => {
        onGetCollectionAvatar(category?.value).then()
      }, 1000)
    }
  }, [category, myNFT])

  const onGetCollectionAvatar = useCallback(async (x) => {
    const BrandsQuery = new Moralis.Query('Brands');
    BrandsQuery.equalTo('objectId', x);
    const object = await BrandsQuery.first();
    if (object) {
      setCollectionAvatar(object.attributes.avatar)
    }
  }, [Moralis.Query])

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }
  const onLikeNFT = async () => {
    const request = { Moralis, itemId: ercTokenId, user, type: 'nft', router, follow: false }
    dispatch(onLikes(request, () => {
      setTrigger(trigger + 1);
    }))
  }

  console.log('myNFT: ', myNFT)

  return (
    <div>
      {nftName ?
        <Title className="color-b">{nftName}</Title>
        :
        <Skeleton count={1} height={36} />
      }

      <div className='color-b responsive-row align-center'>
        {!isERC1155 &&
          <div>
            {myNFT?.owner_of ?
              <div style={{ marginRight: 24 }}>Owned by &nbsp;
                <span style={{ color: '#2082e1', cursor: 'pointer' }} onClick={() => handleRouters(`/sales/${myNFT?.owner_of}`)}>
                  {myNFT?.owner_of?.username || UtilService.truncate(myNFT?.owner_of)}
                </span>
              </div>
              :
              <Skeleton count={1} height={20} width={200} />
            }
          </div>
        }
        &nbsp;&nbsp;

        {myNFT?.owner_of ?
          <div className='responsive-row align-center'>
            <div onClick={onLikeNFT} className='cursor'>
              <span style={{ marginRight: 12, color: isLike ? '#ff343f' : '#666' }} aria-hidden="true" className="icon_heart"></span>
              {likes?.length || 0} favorites
            </div>
            {isERC1155 && <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className='icon_grid-3x3 ml-4'></span> {totalSupply} items</div>}
            {isERC1155 && myNFT?.owner_of === user?.account && myNFT?.amount > 0 && <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className='icon_profile ml-4'></span> You own {myNFT?.amount}</div>}
          </div>
          :
          <Skeleton count={1} height={20} width={200} />
        }
      </div>

      <br />

      {UtilService.checkMetasalt(token_address) &&
        <div>
          {(creator && myNFT) ?
            <div className="br-8 color-b" style={{ background: '#111', border: '1px solid #222' }}>
              <div className='flex responsive-row'>
              <div className="d-row f-1 ml-10 mb-10" >
                <picture>
                  <img
                    className="mt-2 cursor"
                    src={UtilService.ConvetImg(creator?.avatar) || DEMO_AVATAR}
                    alt='avatar'
                    style={{ width: 50, height: 50, borderRadius: 25, objectFit: 'cover' }}
                    onClick={() => handleRouters(`/sales/${creator?.account}`)}
                  />
                </picture>
                <div style={{ marginLeft: 10 }}>
                  <div className="mt-16" style={{ fontWeight: '600' }}>Creator</div>
                  <div style={{ fontSize: 12 }}>{creator?.username}</div>
                </div>
              </div>

              {brand &&
                <div className="d-row f-1 ml-10 mb-10" >
                  <picture>
                    <img
                      className="mt-2 cursor"
                      src={UtilService.ConvetImg(brand?.avatar) || DEMO_AVATAR}
                      alt='avatar'
                      style={{ width: 50, height: 50, borderRadius: 25, objectFit: 'cover' }}
                      onClick={() => handleRouters(`/brands/${brand?.id}`)}
                    />
                  </picture>
                  <div style={{ marginLeft: 10 }}>
                    <div className="mt-16" style={{ fontWeight: '600' }}>Brand</div>
                    <div style={{ fontSize: 12 }}>{brand?.title}</div>
                  </div>
                </div>
              }

              {category &&
                <div className="d-row f-1 ml-10 mb-10" >
                  <picture>
                    <img
                      className="mt-2 cursor"
                      src={UtilService.ConvetImg(collectionAvatar) || DEMO_AVATAR}
                      alt='avatar'
                      style={{ width: 50, height: 50, borderRadius: 25, objectFit: 'cover' }}
                      onClick={() => handleRouters(`/subCollection/${category?.value}`)}
                    />
                  </picture>
                  <div style={{ marginLeft: 10 }}>
                    <div className="mt-16" style={{ fontWeight: '600' }}>Collection</div>
                    <div style={{ fontSize: 12, maxHeight: 22, overflow: 'hidden' }}>{category?.label}</div>
                  </div>
                </div>
              }
            </div>
            </div>
            : <div />
            // <Skeleton count={1} height={50} />
          }
        </div>
      }
    </div>
  );
}

export default ItemRightHeader;
