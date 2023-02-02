import React, { memo, useState } from 'react';
import { GATETYPES } from '../../constants/dropdownlist';

const GatedLeftSearch = ({ collections, brands, search, setGateSearch }) => {

  const [showType, setShowType] = useState(false)
  const [showCollection, setShowCollection] = useState(false)
  const [searchBrand, setSearchBrand] = useState()

  return (
    <div className='filter-profile'>
      <div className='filter-title filterHeadder m-0 d-flex justify-content-center align-items-center'>Search</div>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className='divider' />
        <div>

          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo" style={{ background: '#1a1a1a', color: '#fff'}}>
              NFT COMMUNITY TYPE
            </button>
          </h2>

          <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingTwo">
            <div className="accordion-body p-4">
              <div className="row g-3">
                <div className='dropdownSelect one'>
                  <div
                    id="SelectFilter"
                    onClick={() => setShowType(!showType)}
                  >
                    {search.type?.label || "NFT COMMUNITY TYPE"}
                    {
                      showType && <div id="optionFilter">
                        {
                          GATETYPES.map((item, index) => {
                            return <div
                              key={index}
                              className="dropOption"
                              onClick={() => setGateSearch({ ...search, type: item })}
                              style={{ cursor: 'pointer' }}>
                              <div className="py-2" >{item.label}</div>
                            </div>
                          })
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className='divider' />
        <div>

          <h2 className="accordion-header" id="panelsStayOpen-headingFour">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour"
              aria-expanded="true" aria-controls="panelsStayOpen-collapseFour" style={{ background: '#1a1a1a', color: '#fff'}}>
              Brand
            </button>
          </h2>

          <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingFour">
            <div className="accordion-body p-4">

              {
                <div id="" >
                  <input
                    className='form-control'
                    placeholder='Filter'
                    value={searchBrand}
                    onChange={e => setSearchBrand(e.target.value)}
                  />
                  <div style={{ maxHeight: 300, overflow: 'auto' }}>
                    {
                      brands.map((item, index) => {
                        const isAvailable = item.label.toLowerCase().includes(searchBrand?.toLowerCase()) || !searchBrand
                        if (!isAvailable) return false
                        return <div
                          key={index}
                          className="dropOption"
                          onClick={() => {
                            setGateSearch({ ...search, brand: item, collection: null })
                          }
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="py-2 color-b" >{item.label}</div>
                        </div>
                      })
                    }
                  </div>
                </div>
              }
            </div>
          </div>

        </div>
        <div className='divider' />
        <div>

          <h2 className="accordion-header" id="panelsStayOpen-headingFive">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFive"
              aria-expanded="true" aria-controls="panelsStayOpen-collapseFive" style={{ background: '#1a1a1a', color: '#fff'}}>
              Collection
            </button>
          </h2>

          <div id="panelsStayOpen-collapseFive" className="accordion-collapse collapse "
            aria-labelledby="panelsStayOpen-headingFive">
            <div className="accordion-body p-4">
              <div className="row g-3">
                <div className='dropdownSelect one'>
                  <div
                    id="SelectFilter"
                    onClick={() => setShowCollection(!showCollection)}
                  >
                    {search.collection?.label || "Search Collection"}
                    {
                      showCollection &&
                      <div id="optionFilter" className={`${showCollection}`}>
                        {
                          collections.map(item => {
                            return <div
                              className="dropOption"
                              onClick={() => setGateSearch({ ...search, collection: item })}
                              style={{ cursor: 'pointer' }}>
                              <div className={`py-2`}>{item.label}</div>
                            </div>
                          })
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className='divider' />

      </div>
    </div>
  );
}

export default memo(GatedLeftSearch);