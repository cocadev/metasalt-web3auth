import React from 'react';
import styled from 'styled-components';
import { Title } from '../../constants/globalCss';

const Description = styled.div`
  font-size: 15px;
  color: #fff;
  margin-top: 16px;
  @media only screen and (max-width: 600px) {
    margin-left: 12px;
    margin-right: 12px;
  }
`

const LayoutScreen = (props) => {

  const { title, description, children, content } = props;

  return (
    <div>
      {/* {!content && <div className='gradient-bar'></div>} */}
      <section
        className='jumbotron breadcumb no-bg relative jumbotron-height-360'
        style={{ backgroundImage: `url(${'/img/background.png'})`, }}
      >
        <div className='mainbreadcumb text-center'>
          <Title>{title}</Title>
          <Description>{description}</Description>
          {content}
        </div>
      </section>

      <div style={{ minHeight: 500 }}>
        {children}
      </div>

    </div>
  );
};

export default LayoutScreen;