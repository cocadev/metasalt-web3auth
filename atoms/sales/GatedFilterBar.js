import React, { memo } from 'react';

const GatedFilterBar = ({ search, setGateSearch }) => {

  const { brand, collection, type } = search;
  const isClear = brand || collection;
  
  const onClearSearch = () => {
    setGateSearch({ ...search, brand: null, collection: null, type: null })
  }

  return (
    <div>
      <div className='flex flex-row flex-wrap align-center' style={{ marginTop: 20, marginLeft: 20 }}>
        {type && <div className='filter-btn' onClick={() => setGateSearch({ ...search, type: null })}>{type.label} <span aria-hidden="true" className="icon_close"></span></div>}
        {collection && <div className='filter-btn' onClick={() => setGateSearch({ ...search, collection: null })}>{collection.label} <span aria-hidden="true" className="icon_close"></span></div>}
        {brand && <div className='filter-btn' onClick={() => setGateSearch({ ...search, brand: null })}>{brand.label} <span aria-hidden="true" className="icon_close"></span></div>}
        {isClear && <div className='ml-4 text-primary cursor -mt-10' onClick={onClearSearch}>Clear All</div>}
      </div>
    </div>

  );
}

export default memo(GatedFilterBar);