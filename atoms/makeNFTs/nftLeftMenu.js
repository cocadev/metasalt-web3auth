import { useRouter } from 'next/router';
import React, { memo, useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateCreator } from '../../store/actions/nfts/nfts';


const NftLeftMenu = ({ brands, collections }) => {

  const dispatch = useDispatch();
  const { user, account } = useMoralis();
  const [trigger, setTrigger] = useState(1);
  const { nft } = useSelector(state => state.nfts);
  const { collection, brand, step, title, description, file } = nft;
  const router = useRouter();

  const [showBrand, setShowBrand] = useState(false)
  const [showCollection, setShowCollection] = useState(false);
  const FILTER_BRANDS = brands.concat({ value: 1, label: 'Create New Brand', link: true })
  const FILTER_COLLECTIONS = collections.concat({ value: 2, label: 'Create New Collection', link: true })

  const step1_disabled = false;
  const step2_disabled = step1_disabled || !title || !description;
  const step3_disabled = step2_disabled || !file;
  const step4_disabled = step3_disabled;
  const step5_disabled = step4_disabled;

  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1);
      let element = document.getElementById('html5qr-code-full-region__dashboard_section_swaplink');
      if (element) {
        element?.removeAttribute('href');
        element.style.cursor = 'pointer';
      }
    }, 1500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, account])

  return (
    <div className='filter-profile'>
      <div className='filter-title filterHeadder m-0 d-flex justify-content-center align-items-center'>START</div>
      <div className="accordion">
        <div className='divider' />
        <div>

          <h2 className="accordion-header" id="panelsStayOpen-headingFour">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour"
              aria-expanded="true" aria-controls="panelsStayOpen-collapseFour" style={{ background: '#1a1a1a', color: '#fff' }}>
              Brand
            </button>
          </h2>

          <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse "
            aria-labelledby="panelsStayOpen-headingFour">
            <div className="accordion-body p-4">
              <div className="row g-3">
                <div className='dropdownSelect one'>
                  <div
                    id="SelectFilter"
                    onClick={e => setShowBrand(!showBrand)}
                  >
                    {brand ? brand.label : 'Select Brand'}
                    {
                      showBrand ?
                        <div id="optionFilter" className={`${showBrand}`}>
                          {
                            FILTER_BRANDS.map((item, index) => {
                              return <div 
                                key={index} 
                                className="dropOption" 
                                onClick={() => item?.link ? router.push('/create/brand', undefined, { shallow: true }) : dispatch(onUpdateCreator({ brand: item }))}
                                style={{ cursor: 'pointer' }}>
                                <div className={`py-2 ${item?.link && 'color-sky'}`} >{item.label}</div>
                              </div>
                            })
                          }
                        </div>
                        : ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div className='divider' />
        <div >

          <h2 className="accordion-header" id="panelsStayOpen-headingFive">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFive"
              aria-expanded="true" aria-controls="panelsStayOpen-collapseFive" style={{ background: '#1a1a1a', color: '#fff' }}>
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
                    onClick={e => setShowCollection(!showCollection)}
                  >
                    {collection ? collection.label : 'Select Collection'}
                    {
                      showCollection ?
                        <div id="optionFilter" className={`${showCollection}`}>
                          {
                            FILTER_COLLECTIONS.map((item, index) => {
                              return <div 
                                key={index} 
                                className="dropOption" 
                                onClick={() => item?.link ? router.push('/create/collection', undefined, { shallow: true }) : dispatch(onUpdateCreator({ collection: item }))}
                                style={{ cursor: 'pointer' }}>
                                <div className={`py-2 ${item?.link && 'color-sky'}`}>{item.label}</div>
                              </div>
                            })
                          }
                        </div>
                        : ''
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='divider' />

        <div className="my-4">
          <div className="px-4 py-0">
            <div className={`${step === 1 ? 'green-btn' : 'grey-btn'} my-3 ${step1_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 1 }))}>Details</div>
            <div className={`${step === 2 ? 'green-btn' : 'grey-btn'} my-3 ${step2_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 2 }))}>Content</div>
            <div className={`${step === 3 ? 'green-btn' : 'grey-btn'} my-3 ${step3_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 3 }))}>Authentication (optional)</div>
            <div className={`${step === 4 ? 'green-btn' : 'grey-btn'} my-3 ${step4_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 4 }))}>Attributes</div>
            <div className={`${step === 5 ? 'green-btn' : 'grey-btn'} my-3 ${step5_disabled && 'btn-disabled'}`} onClick={() => dispatch(onUpdateCreator({ step: 5 }))}>Royalties</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(NftLeftMenu);