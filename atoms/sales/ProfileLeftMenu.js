import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useWindowSize from '../../hooks/useWindowSize';
import { onUpdateSearch } from '../../store/actions/nfts/nfts';
import { useDebouncedCallback } from 'use-debounce';
import { useMoralisQuery } from 'react-moralis';
import UtilService from '../../sip/utilService';
import { DEMO_AVATAR } from '../../keys';

const CheckBox = styled.input`
  width: 20px;
  height: 20px;
`

const Icon = styled.img`
  width: 20px;
  transform: rotate(${props => props.opened ? 90 : 270}deg);
  cursor: pointer;
  transition: transform .2s ease-in-out;
`

const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 12px 0px;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #555;
  margin: 22px 0;
`

const IconSearch = styled.span`
  position: absolute;
  left: 12px;
  top: 13px;
  cursor: pointer;
`

const Title = styled.div`
  overflow: hidden;
  height: 25px;
  font-size: 14px;
  display: flex;
  flex: 1
`

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  margin-right: 9px;
`

const ProfileLeftMenu = () => {

  const dispatch = useDispatch();
  const { height, width } = useWindowSize();
  const [isEnabled, setIsEnabled] = useState(false);
  const [collectionKey, setCollectionKey] = useState('');
  const [brandKey, setBrandKey] = useState('');
  const [text, setText] = useState('');
  const [isExpandSearch, setIsExpandSearch] = useState(true)
  const [isExpandStatus, setIsExpandStatus] = useState(false)
  const [isExpandQuantity, setIsExpandQuantity] = useState(false)
  const [isExpandChains, setIsExpandChains] = useState(false)
  const [isExpandCollections, setIsExpandCollections] = useState(false)
  const [isExpandBrands, setIsExpandBrands] = useState(false)
  const { search } = useSelector(state => state.nfts);
  const { lazyMint, normalMint, erc721, erc1155, buynow, cols, brands, eth, matic } = search;
  const { data: collections } = useMoralisQuery("Brands", query => query.descending('volumn').startsWith('title', collectionKey).limit(10), [collectionKey], { autoFetch: true });
  const { data: allBrands } = useMoralisQuery("RealBrands", query => query.descending('volumn').startsWith('title', brandKey).limit(10), [brandKey], { autoFetch: true });

  const debounced = useDebouncedCallback((value) => {dispatch(onUpdateSearch({ searchKey: value }))}, 1000);

  return (
    <div className='filter-profile p-3'>

      <div style={width <= 850 ? { maxHeight: height - 150, overflow: 'auto' } : {}}>

        <Box>
          <div className='w-full fw-600'>Search</div>
          <Icon 
            src="/img/icons/ic_back.png" 
            alt="back" 
            onClick={() => setIsExpandSearch(!isExpandSearch)}
            opened={isExpandSearch}
          />
        </Box>

        {isExpandSearch && <div className='mt-4 relative'>
          <input
            className="w-full form-control"
            style={{ border: '1px solid #ccc', paddingLeft: 40 }}
            placeholder='Search'
            value={text}
            onChange={e => {
              setText(e.target.value);
              debounced(e.target.value);
            }}
          />
          <IconSearch className='icon_search' />
        </div>}

        <Divider />

        <Box>
          <div className='w-full fw-600'>Status</div>
          <Icon 
            src="/img/icons/ic_back.png" 
            alt="back" 
            onClick={() => setIsExpandStatus(!isExpandStatus)} 
            opened={isExpandStatus}  
          />
        </Box>

        {
          isExpandStatus &&
          <div>
            <Box>
              <div className='w-full'>Buy Now</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={buynow}
                onChange={e => dispatch(onUpdateSearch({ buynow: e.target.checked }))}
              />
            </Box>

            <Box>
              <div className='w-full'>Lazy Minted</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={lazyMint}
                onChange={e => dispatch(onUpdateSearch({ lazyMint: e.target.checked }))}
              />
            </Box>

            <Box>
              <div className='w-full'>Normal Minted</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={normalMint}
                onChange={e => dispatch(onUpdateSearch({ normalMint: e.target.checked }))}
              />
            </Box>
          </div>
        }

        <Divider />

        <Box>
          <div className='w-full fw-600'>Quantity</div>
          <Icon 
            src="/img/icons/ic_back.png" 
            alt="back" 
            onClick={() => setIsExpandQuantity(!isExpandQuantity)}
            opened={isExpandQuantity}  
          />
        </Box>

        {
          isExpandQuantity && <div>

            <Box>
              <div className='w-full'>Single Items</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={erc721}
                onChange={e => dispatch(onUpdateSearch({ erc721: e.target.checked }))}
              />
            </Box>

            <Box>
              <div className='w-full'>Bundles</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={erc1155}
                onChange={e => dispatch(onUpdateSearch({ erc1155: e.target.checked }))}
              />
            </Box>
          </div>
        }

        <Divider />

        <Box>
          <div className='w-full fw-600'>Chains</div>
          <Icon 
            src="/img/icons/ic_back.png" 
            alt="back" 
            onClick={() => setIsExpandChains(!isExpandChains)}
            opened={isExpandChains}  
          />
        </Box>

        {
          isExpandChains && <div>

            <Box>
              <div className='w-full'>Ethereum</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={eth}
                onChange={e => dispatch(onUpdateSearch({ eth: e.target.checked }))}
              />
            </Box>

            <Box>
              <div className='w-full'>Polygon</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={matic}
                onChange={e => dispatch(onUpdateSearch({ matic: e.target.checked }))}
              />
            </Box>

            <Box className='btn-disabled'>
              <div className='w-full'>BSC</div>
              <CheckBox
                type="checkbox"
                label='I agree'
                value={isEnabled}
                onChange={e => setIsEnabled(e.target.checked)}
              />
            </Box>
          </div>
        }

        <Divider />

        <Box>
          <div className='w-full fw-600'>Collections</div>
          <Icon 
            src="/img/icons/ic_back.png" 
            alt="back" 
            onClick={() => setIsExpandCollections(!isExpandCollections)}
            opened={isExpandCollections}  
          />
        </Box>

        {isExpandCollections && <div>
          <input
            className="w-full form-control"
            style={{ border: '1px solid #ccc' }}
            placeholder='Filter'
            value={collectionKey}
            onChange={e => setCollectionKey(e.target.value)}
          />

          <div>
            {collections
            // .filter(item => collectionKey ? item.attributes.title?.includes(collectionKey) : item)
            .map((item, key) => {
              const { avatar, title, volumn } = item.attributes || '';
              const collectionID = item.id;
              return (
                <Box key={key}>
                  <Avatar src={UtilService.ConvetImg(avatar)} alt='col' />
                  <Title>
                    {title}
                  </Title>
                  <div className='mr-2'>
                    {volumn}
                  </div>
                  <CheckBox
                    type="checkbox"
                    label='I agree'
                    value={cols.includes(collectionID)}
                    onChange={e => {
                      let col = [];
                      if (!cols.includes(collectionID)) {
                        col = cols.concat(collectionID)
                      } else {
                        col = cols.filter(x => x !== collectionID)
                      }
                      dispatch(onUpdateSearch({ cols: col }))
                    }}
                  />
                </Box>)
            })}
          </div>
        </div>}

        <Divider />

        <Box>
          <div className='w-full fw-600'>Brands</div>
          <Icon 
            src="/img/icons/ic_back.png" 
            alt="back" 
            onClick={() => setIsExpandBrands(!isExpandBrands)}
            opened={isExpandBrands}  
          />
        </Box>

        {isExpandBrands && <div>
          <input
            className="w-full form-control"
            style={{ border: '1px solid #ccc' }}
            placeholder='Filter'
            value={brandKey}
            onChange={e => setBrandKey(e.target.value)}
          />

          <div>
            {allBrands.filter(item => brandKey ? item.attributes.title?.includes(brandKey) : item).map((item, key) => {
              const { avatar, title, volumn } = item.attributes || '';
              const brandID = item.id;
              return (
                <Box key={key}>
                  <Avatar src={UtilService.ConvetImg(avatar) || DEMO_AVATAR} alt='col' />
                  <Title>
                    {title}
                  </Title>
                  <div className='mr-2'>
                    {volumn}
                  </div>
                  <CheckBox
                    type="checkbox"
                    label='I agree'
                    value={brands.includes(brandID)}
                    onChange={e => {
                      let brandy = [];
                      if (!brands.includes(brandID)) {
                        brandy = brands.concat(brandID)
                      } else {
                        brandy = brands.filter(x => x !== brandID)
                      }
                      dispatch(onUpdateSearch({ brands: brandy }))
                    }}
                  />
                </Box>)
            })}
          </div>
        </div>}

      </div>

    </div>
  );
}

export default memo(ProfileLeftMenu);