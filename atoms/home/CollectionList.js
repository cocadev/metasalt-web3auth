import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useMoralisQuery } from "react-moralis";
import UtilService from "../../sip/utilService";

const Box = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  img {
    width: 64px;
    height: 64px;
    border-radius: 9px;
    margin: 0 12px;
  }
`

const Container = styled.div`
  padding: 0 20px;
`

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-conten: center;
`

const CollectionList = () => {

  const router = useRouter();
  const { data: collections } = useMoralisQuery("Brands", query => query.descending('volumn').limit(10), [], { autoFetch: true });

  return (
    <div className='row'>
      <div className="col-xs-12 col-md-6">
        <Container>
        {collections.slice(0, 5).map((item, index) => {
            const id = item.id;
            const { avatar, title, volumn } = item.attributes || '';
            return (
              <Box key={index} onClick={() => router.push(`/subCollection/${id}`)}>
                <Row>
                <div style={{ width: 20}}>{index + 1}</div>
                <img src={UtilService.ConvetImg(avatar)} alt="" />
                  <div style={{ fontWeight: 'bold' }}>{title}</div>
                </Row>
                <div>{volumn} volume</div>
              </Box>)
          })
          }
        </Container>
      </div>
      <div className="col-xs-12 col-md-6">
        <Container>
          {collections.slice(5, 10).map((item, index) => {
            const id = item.id;
            const { avatar, title, volumn } = item.attributes || '';
            return (
              <Box key={index} onClick={() => router.push(`/subCollection/${id}`)}>
                <Row>
                  <div style={{ width: 20}}>{index + 6}</div>
                  <img src={UtilService.ConvetImg(avatar)} alt="" />
                  <div style={{ fontWeight: 'bold' }}>{title}</div>
                </Row>
                <div>{volumn} volume</div>
              </Box>)
          })
          }
        </Container>
      </div>
    </div>
  );
}

export default CollectionList;

