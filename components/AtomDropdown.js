// The forwardRef is important!!

import { useRouter } from 'next/router';
import React, { useState, forwardRef } from 'react';
import { Dropdown } from 'react-bootstrap';
import ModalDeleteGated from './modalDeleteGated';

// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <img src="img/icons/menu.png" alt="menu_verticial" style={{ width: 20 }}/>
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

export const AtomDropdown = ({ data, editable, onTrigger }) => {

  const router = useRouter();
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  return(
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        
      </Dropdown.Toggle>

      <Dropdown.Menu as={CustomMenu}>
        <Dropdown.Item eventKey="1" onClick={()=>router.push(`/nftcommunities/${data.id}`, undefined, { shallow: true })}>View</Dropdown.Item>
        {editable && <Dropdown.Item eventKey="2">Edit</Dropdown.Item>}
        <Dropdown.Item eventKey="3">Copy URL</Dropdown.Item>
        {editable && <Dropdown.Item eventKey="5" onClick={()=>setIsDeleteModal(true)}>Delete</Dropdown.Item>}
      </Dropdown.Menu>

      {isDeleteModal && <ModalDeleteGated 
        GatedId={data.id}
        onSuccess={onTrigger}
        onClose={()=>setIsDeleteModal(false)}
      />}
    </Dropdown>
  )
};