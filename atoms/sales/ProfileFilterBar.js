import React, { memo, } from 'react';

const ProfileFilterBar = ({onSetBig, isBig}) => {

  return (
    <div>
      <div className='row' style={{ marginTop: 22}}>
        <div className="col-12 items_filter">
          <div className='search-input'>

          </div>

          <div
            className='share-btn mx-2 mobile-hidden'
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <span aria-hidden="true" className="icon_grid-2x2" onClick={() => onSetBig(false)} style={{ color: !isBig ? '#555555' : '#8364E2' }}></span>
            <span aria-hidden="true" className="icon_grid-3x3" onClick={() => onSetBig(true)} style={{ color: isBig ? '#555555' : '#8364E2' }}></span>
          </div>

        </div>
      </div>
      {/* <div className='flex flex-row flex-wrap align-center' style={{ marginTop: -10, marginLeft: 20 }}>
        {isBuyNow && <div className='filter-btn' onClick={() => onChangeStatus('buyNow')}>History <span aria-hidden="true" className="icon_close"></span></div>}
        {isOnAuction && <div className='filter-btn' onClick={() => onChangeStatus('onAuction')}>Buy Now <span aria-hidden="true" className="icon_close"></span></div>}
        {isNew && <div className='filter-btn' onClick={() => onChangeStatus('new')}>Lazy Minted <span aria-hidden="true" className="icon_close"></span></div>}
        {isHasOffers && <div className='filter-btn' onClick={() => onChangeStatus('hasOffers')}>Authenticated <span aria-hidden="true" className="icon_close"></span></div>}
        {isEth && <div className='filter-btn' onClick={() => onChangeChains('eth')}>Ethereum <span aria-hidden="true" className="icon_close"></span></div>}
        {isPolygon && <div className='filter-btn' onClick={() => onChangeChains('polygon')}>Polygon <span aria-hidden="true" className="icon_close"></span></div>}
        {isBsc && <div className='filter-btn' onClick={() => onChangeChains('bsc')}>BSC <span aria-hidden="true" className="icon_close"></span></div>}
        {isSaleEth && <div className='filter-btn' onClick={() => onChangeSale('eth')}>ETH <span aria-hidden="true" className="icon_close"></span></div>}
        {isSaleWeth && <div className='filter-btn' onClick={() => onChangeSale('weth')}>WETH <span aria-hidden="true" className="icon_close"></span></div>}
        {isPrice && <div className='filter-btn' onClick={onInitialPrice}>{bigSearch.price.min} - {bigSearch.price.max}<span aria-hidden="true" className="icon_close"></span></div>}
        {isClear && <div className='ml-4 text-primary cursor -mt-10' onClick={onClearSearch}>Clear All</div>}
      </div> */}
    </div>

  );
}

export default memo(ProfileFilterBar);