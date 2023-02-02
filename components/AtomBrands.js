import React from 'react';
import { DEMO_AVATAR, DEMO_BACKGROUND } from '../../keys';
import CustomSlide from './custom/CustomSlide';

export const AtomBrands = ({ data, brand }) => (
  <div className='flex flex-wrap center mt-30' style={{ alignItems: 'center', justifyContent: 'center' }}>
    {data?.map((item, index) => (
      <div key={index} className="mt-10">
        <CustomSlide
          index={index + 1}
          avatar={item.attributes.avatar || DEMO_AVATAR}
          banner={item.attributes.banner || DEMO_BACKGROUND}
          username={item.attributes.title}
          uniqueId={item.attributes.description}
          collectionId={item.id}
          brand={brand}
        />
      </div>
    ))}
  </div>
);