import React from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import styled from "styled-components";
import { Title } from "../../constants/globalCss";

const CTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`

const Box = styled.div`
  width: 320px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  margin-top: 10px;
`

const AnalysisProjects = ({  }) => {

  const { account } = useMoralis();
  const { data: brands } = useMoralisQuery("RealBrands");
  const { data: collections } = useMoralisQuery("Brands");

  return (
    <div className="color-b">
      <Title>Metasalt Projects</Title>
      <br/><br/>
      <Box>
        <CTitle>Total Brands</CTitle>
        <div>{brands.length}</div>
      </Box>
      <Box>
        <CTitle>Total Collections</CTitle>
        <div>{collections.length}</div>
      </Box>

      <Box>
        <CTitle>Total My Brands</CTitle>
        <div>{brands.filter(item => item.attributes.creatorId === account).length}</div>
      </Box>
      <Box>
        <CTitle>Total My Collections</CTitle>
        <div>{collections.filter(item => item.attributes.creatorId === account).length}</div>
      </Box>
    </div>
  );
};

export default AnalysisProjects;