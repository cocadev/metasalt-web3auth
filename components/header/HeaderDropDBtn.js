import Link from 'next/link';
import React, { memo, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import styled from 'styled-components';

const ICON = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 10px;
`
const HeaderDropDBtn = ({ title, contents, custom }) => {

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
        <div className="dropdown-custom btn header-btn"
          onMouseEnter={handleBtnClick} onMouseLeave={closeMenu}>
          {title}
          {openMenu && (
            <div className='item-dropdown'>
              <div className="dropdown" onClick={closeMenu}>
                {
                  contents.map((item, index) =>
                    <Link key={index} href={item.link} onClick={item?.onAction} prefetch={false}>
                      {item.icon && <ICON src={item.icon} alt='icon' style={{ }}/>}
                      <span style={{ color: item.color }}>{item.title}</span>
                    </Link>)
                }
                {custom}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(HeaderDropDBtn);        