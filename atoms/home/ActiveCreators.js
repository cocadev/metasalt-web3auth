import { useRouter } from 'next/router';
import React, { memo } from 'react';
import styled from 'styled-components';
import { useMoralisCloudFunction } from 'react-moralis';
import { useSelector } from 'react-redux';
import useWindowSize from '../../hooks/useWindowSize';
import { DEMO_AVATAR } from '../../keys';

const Container = styled.div`
  @media only screen and (max-width: 600px) {
    margin: 0 2px;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`
const Box = styled.span`
  @media only screen and (max-width: 600px) {
    width: 110px;
    overflow: hidden;
  }
`

const SPAN = styled.span`
  font-size: 16px;
  color: #777;
  @media only screen and (max-width: 600px) {
    font-size: 11px;
    text-align: center;
  }
`

const ActiveCreators = () => {

  const { data: users } = useMoralisCloudFunction('loadUsers')
  const { nfts } = useSelector(state => state.nfts)
  const { width } = useWindowSize();
  const isDesktop = width > 600;
  const router = useRouter();

  const mySortedUsers = users?.map(item => {
    const userAccount = (item?.attributes?.accounts && item?.attributes?.accounts[0]) || '---';
    const nft = nfts.filter(x => x.owner_of === userAccount)
    return {
      username: item?.attributes?.username?.substr(0, 16) || 'Unnamed',
      updatedAt: item.updatedAt,
      createdAt: item.createdAt,
      avatar: item?.attributes?.avatar,
      nftCount: nft.length,
      userAccount
    }
  }).sort(function (a, b) {
    return b.nftCount - a.nftCount
  })
    .filter((item, index) => (item.nftCount > 0) && (index < 8))

  return (
    <Container>
      <div className="d-flex flew-wrap flex-row d-center">
        {mySortedUsers?.map((user, index) => (
          <Box
            key={index}
            className={`${isDesktop && 'd-flex'} cursor mt-4`}
            style={{ minWidth: isDesktop ? 315 : 'auto' }}
          >
            <div onClick={() => router.push(`/sales/${user.userAccount}`, undefined, { shallow: true })}>
              <div className="profile-avatar-s">
                <img src={user.avatar || DEMO_AVATAR} alt="me" />
              </div>
            </div>
            <div className="flex-col d-flex">
              <SPAN>{user.username}</SPAN>
              <SPAN>{user.nftCount} METASALT</SPAN>
            </div>
          </Box>
        ))}
      </div>
      <br />
      <br />
    </Container>
  );
};

export default memo(ActiveCreators);
