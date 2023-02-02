import React, { useState } from 'react';
import styled from 'styled-components';
import TagsInput from 'react-tagsinput';
import { useDispatch } from 'react-redux';
import { onUpdateCreator } from '../../store/actions/nfts/nfts';

const Property = styled.div`
  position: relative;
  background: #333;
  padding: 3px 12px;
  border: 1px solid #777;
  border-radius: 4px;
  margin: 5px 5px;
  font-size: 14px;
  width: 140px;

  div:nth-child(2) {
    font-size: 12px;
    text-transform: uppercase;
    color: #15b2e5
  }

  div:nth-child(3) {
    font-size: 16px;
    font-weight: 500;
    height: 25px;
    overflow: hidden;
    color: #ccc
  }
`
const CloseIcon = styled.span`
  font-size: 18px;
  color: #888;
  cursor: pointer;
  position: absolute;
  right: 5px;
`


function Step4({ tags = [], attributes = [] }) {

  const dispatch = useDispatch()
  const [traits, setTraits] = useState(attributes)
  const [type, setType] = useState('')
  const [value, setValue] = useState('')

  const onChangeTags = (data) => {
    dispatch(onUpdateCreator({ tags: data }))
  }

  const onDiscard = () => {
    dispatch(onUpdateCreator({ tokenPrice: null, step: 3 }))
  }

  const onSave = () => {
    dispatch(onUpdateCreator({ attributes: traits, step: 5 }));
  }

  const onAddTrait = () => {
    setTraits([...traits, {
      trait_type: type, value
    }])
    setType('')
    setValue('')
  }

  const onRemoveTrait = (k) => {
    setTraits([...traits.filter((_, c) => c !== k)])
  }

  return (<div className="col-lg-6 m-auto">
      <h2 className="text-white">Attributes</h2>

      <h4 className="text-white mt-5">Enter tags</h4>
      <TagsInput value={tags} onChange={onChangeTags}/>

      <h4 className="text-white mt-5">Add Traits</h4>
      <div className="mt-2 flex flex-row flex-wrap">

        {traits.map((item, index) => <Property key={index}>
          <CloseIcon aria-hidden="true" className="icon_close right-icon"
                     onClick={() => onRemoveTrait(index)}></CloseIcon>
          <div>{item.trait_type}</div>
          <div>{item.value}</div>
        </Property>)}

      </div>

      <div className="flex flex-row mt-2">
        <div className="mr-2" style={{ border: '1px solid #8364E2' }}>
          <input
            className="form-control m-0"
            placeholder="Trait Type"
            value={type}
            onChange={e => setType(e.target.value)}
          />
        </div>
        <div className="mr-2" style={{ border: '1px solid #8364E2' }}>
          <input
            className="form-control m-0"
            placeholder="Trait Value"
            value={value}
            onChange={e => setValue(e.target.value)}
          />
        </div>
        <div className={`btn-main d-center ${!(type && value) && 'btn-disabled'}`} onClick={onAddTrait}>Add</div>
      </div>

      <div className="d-flex mt-5">
        <button className="btn btn-primary ms-auto my-3" onClick={onDiscard}>Discard</button>
        <button className="btn btn-primary my-3 ms-3" onClick={onSave}>Save & Continue</button>
      </div>
    </div>)
}

export default Step4;
