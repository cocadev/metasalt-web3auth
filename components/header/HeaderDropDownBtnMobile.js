import Link from 'next/link';
import React, { memo, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

const HeaderDropDownBtnMobile = ({ title, contents, custom, onClose }) => {

  const [openMenu, setOpenMenu] = useState(false);

  const handleBtnClick = () => {
    setOpenMenu(!openMenu);
  };

  const closeMenu = () => {
    setOpenMenu(false);
  };

  const ref = useOnclickOutside(() => {
    closeMenu();
  });

  return (

    <div className='navbar-item'>
      <div ref={ref}>
        <div 
          className="dropdown-custom dropdown-toggle btn "
          onClick={handleBtnClick}
        >
          {title}
        </div>
        {openMenu && (
          <div className='item-dropdown'>
            <div className="dropdown" onClick={closeMenu}>
              {
                contents.map((item, index) => 
                <Link key={index} href={item.link} onClick={onClose} prefetch={false}>
                  {item.title}
                </Link>)
              }
              {custom}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(HeaderDropDownBtnMobile);        