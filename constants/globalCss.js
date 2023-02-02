import styled from 'styled-components'

const Title = styled.h1`
  font-size: 50px;
  font-weight: 500;
  color: #fff;

  @media only screen and (max-width: 1000px) {
    font-size: 36px;
  }

  @media only screen and (max-width: 600px) {
    font-size: 25px;
  }
`

const Description = styled.div`
  font-size: 18px;
  color: #fff;
  text-align: center;
`


export {
  Title,
  Description,
}
