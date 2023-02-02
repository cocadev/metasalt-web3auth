import dynamic from 'next/dynamic';
import styled from 'styled-components';

const Popover = dynamic(() => import('@idui/react-popover'), { ssr: false });

const CustomPopover = styled(Popover).attrs({ arrowColor: '#1c1c26' })`
  background-color: #1c1c26 !important;
  border-radius: 4px;
  padding: 5px 12px !important;
  color: #bbb;
  max-width: 200px;
  text-align: center;
  @media only screen and (max-width: 600px) {
    display: none;
  }
  .idui-popover__arrow {
    box-shadow: none;
  }
`

export default CustomPopover;
