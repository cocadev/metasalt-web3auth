import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateGated } from '../../store/actions/nfts/nfts';
import DatePicker from "react-datepicker";
import { GATETYPES, GATESTATUS } from '../../constants/dropdownlist';
import useWindowSize from '../../hooks/useWindowSize';
import { useRouter } from 'next/router';
import "react-datepicker/dist/react-datepicker.css";

const GatedLeftMenu = ({ collections, brands }) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const { height, width } = useWindowSize();

  const { gated } = useSelector(state => state.nfts);
  const { gateType, gateStatus, brand, collection, step, title, description, file, addedContent, startDate } = gated;

  const [showStatus, setShowStatus] = useState(false)
  const [showType, setShowType] = useState(false)
  const [showBrand, setShowBrand] = useState(false)
  const [showCollection, setShowCollection] = useState(false)

  const step1_disabled = !brand || !collection || !gateType || !gateStatus || !startDate;
  const step2_disabled = step1_disabled || !title || !description;
  const step3_disabled = step2_disabled || !file;
  const step4_disabled = step3_disabled || addedContent.length === 0;
  const step5_disabled = step4_disabled;

  return (
    <div className='filter-profile'>
      <div className='filter-title filterHeadder m-0 d-flex justify-content-center align-items-center'>START</div>
      <div className="accordion" style={width <= 850 ? { maxHeight: height - 150, overflow: 'auto' } : {}}>
        <div className='divider' />
        <div>

          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo" style={{ background: '#1a1a1a', color: '#fff' }}>
              NFT Community TYPE
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
                    {gateType ? gateType.label : "NFT COMMUNITY TYPE"}
                    {
                      showType && <div id="optionFilter">
                        {
                          GATETYPES.map(item => {
                            return <div
                              className="dropOption"
                              onClick={() => dispatch(onUpdateGated({ gateType: item }))}
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

          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="true" aria-controls="panelsStayOpen-collapseThree" style={{ background: '#1a1a1a', color: '#fff' }}>
              STATUS
            </button>
          </h2>

          <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse "
            aria-labelledby="panelsStayOpen-headingThree">
            <div className="accordion-body p-4">
              <div className="row g-3">
                <div className='dropdownSelect one'>
                  <div
                    id="SelectFilter"
                    onClick={() => setShowStatus(!showStatus)}
                  >
                    {gateStatus ? gateStatus.label : "Select Status"}
                    {
                      showStatus &&
                      <div id="optionFilter">
                        {
                          GATESTATUS.map(item => {
                            return <div
                              className="dropOption"
                              onClick={() => dispatch(onUpdateGated({ gateStatus: item }))}
                              style={{ cursor: 'pointer' }}>
                              <div className="py-2" >{item.label}</div>
                            </div>
                          })
                        }
                      </div>
                    }

                  </div>

                </div>
                {
                  gateStatus &&
                  <DatePicker
                    // isClearable 
                    selected={startDate}
                    onChange={(date) => dispatch(onUpdateGated({ startDate: date }))}
                    placeholderText="Please select the date!"
                    minDate={new Date()}
                  />}

              </div>
            </div>
          </div>

        </div>
        <div className='divider' />
        <div>

          <h2 className="accordion-header" id="panelsStayOpen-headingFour">
            <button className="accordion-button acodiHeadTxt collapsed" type="button"
              data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour"
              aria-expanded="true" aria-controls="panelsStayOpen-collapseFour" style={{ background: '#1a1a1a', color: '#fff' }}>
              Brand
            </button>
          </h2>

          <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingFour">
            <div className="accordion-body p-4">
              <div className="row g-3">
                <div className='dropdownSelect one'>
                  <div
                    id="SelectFilter"
                    onClick={() => setShowBrand(!showBrand)}
                  >
                    {brand ? brand.label : "Select Brand"}
                    {
                      showBrand &&
                      <div id="optionFilter" className={`${showBrand}`}>
                        {
                          brands.map(item => {
                            return <div
                              className="dropOption"
                              onClick={() => item?.link ? router.push('/create/brand', undefined, { shallow: true }) : dispatch(onUpdateGated({ brand: item }))}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className={`py-2 ${item?.link && 'color-sky'}`} >{item.label}</div>
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
                    onClick={() => setShowCollection(!showCollection)}
                  >
                    {collection ? collection.label : "Select Collection"}
                    {
                      showCollection &&
                      <div id="optionFilter" className={`${showCollection}`}>
                        {
                          collections.map(item => {
                            return <div
                              className="dropOption"
                              onClick={() => item?.link ? router.push('/create/collection', undefined, { shallow: true }) : dispatch(onUpdateGated({ collection: item }))}
                              style={{ cursor: 'pointer' }}>
                              <div className={`py-2 ${item?.link && 'color-sky'}`} >{item.label}</div>
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
        <div className="my-4">
          <div className="px-4 py-0">
            <div className={`${step === 1 ? "green-btn" : "grey-btn"} my-3 ${step1_disabled && "btn-disabled"}`} onClick={() => dispatch(onUpdateGated({ step: 1 }))}>Details</div>
            <div className={`${step === 2 ? "green-btn" : "grey-btn"} my-3 ${step2_disabled && "btn-disabled"}`} onClick={() => dispatch(onUpdateGated({ step: 2 }))}>Image</div>
            {/* <div className={`${step === 3 ? "green-btn" : "grey-btn"} my-3 ${step3_disabled && "btn-disabled"}`} onClick={() => dispatch(onUpdateGated({ step: 3 }))}>NFTs</div> */}
            <div className={`${step === 4 ? "green-btn" : "grey-btn"} my-3 ${step4_disabled && "btn-disabled"}`} onClick={() => dispatch(onUpdateGated({ step: 4 }))}>Content</div>
            <div className={`${step === 5 ? "green-btn" : "grey-btn"} my-3 ${step5_disabled && "btn-disabled"}`} onClick={() => dispatch(onUpdateGated({ step: 5 }))}>Review</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(GatedLeftMenu);
