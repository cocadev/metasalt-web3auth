import React from "react";
import { useMoralisQuery } from "react-moralis";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Title } from "../../constants/globalCss";

const CTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
`

const Box = styled.div`
  width: 620px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  margin-top: 10px;
  @media only screen and (max-width: 700px) {
    width: 320px;
    flex-direction: column;
  }
`

const AnalysisMetasalt = ({  }) => {

  const { nfts } = useSelector(state => state.nfts);
  const { data: nFTGates } = useMoralisQuery("NFTGates");
  const { users } = useSelector(state => state.users)

  return (
    <div className="color-b">
      <Title>Metasalt Analysis</Title>

      <Box>
        <CTitle>Total ERC1155 NFTs</CTitle>
        <div>{nfts.length}</div>
      </Box>
      <Box>
        <CTitle>Total Lazy Mint NFTs</CTitle>
        <div>{nfts.filter(item => item.lazyMint).length}</div>
      </Box>
      <Box>
        <CTitle>Total Normal Mint NFTs</CTitle>
        <div>{nfts.filter(item => !item.lazyMint).length}</div>
      </Box>
      <Box>
        <CTitle>Total Users</CTitle>
        <div>{users.length}</div>
      </Box>
      <Box>
        <CTitle>Total NFT Communities</CTitle>
        <div>{nFTGates.length}</div>
      </Box>
    </div>
  );
};

export default AnalysisMetasalt;