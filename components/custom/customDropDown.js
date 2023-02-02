import { useState } from 'react';

export function CustomDropDown({ LIST, data, onChangeData }) {

  const [isShow, setIsShow] = useState(false);

  return (
    <div
      className="accordion-collapse" style={{ minWidth: 150, }}>
      <div className="row ">
        <div className='dropdownSelect one cursor'>
          <div
            id="SelectFilter"
            onClick={() => setIsShow(!isShow)}
          >
            <div>{data}</div>
            {
              isShow && <div id="optionFilter">
                {
                  LIST.map(item => {
                    return <div
                      className="dropOption"
                      onClick={() => onChangeData(item.value)}
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
  );
}
