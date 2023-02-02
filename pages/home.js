import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useMoralis, } from 'react-moralis';
import { useSelector } from 'react-redux';
import LayoutPage from '../components/layouts/layoutPage';
import { MetaTag } from '../components/MetaTag';
import NFTSlide from '../atoms/home/NFTSlide';
import CollectionList from '../atoms/home/CollectionList';
import { DESCRIPTION } from '../keys';

const RealWorldNFTs = dynamic(() => import('../atoms/home/RealWorldNFTs'));
const Communities = dynamic(() => import('../atoms/home/Communities'));
const TopVideos = dynamic(() => import('../atoms/home/TopVideos'));
const TopMusics = dynamic(() => import('../atoms/home/TopMusics'));
const TopDiscourse = dynamic(() => import('../atoms/home/TopDiscourse'));

const HOMEATOMS = [
  {
    title: 'NFT Marketplace',
    description: 'Buy/Sell your favourite Artist, Project, and Brand Or create your own NFTs!',
    link: '/nftmarketplace',
    container: <NFTSlide />
  },
  {
    title: 'Trending Collections',
    description: 'Buy/Sell your favourite Artist, Project, and Brand Or create your own NFTs!',
    link: '/nftmarketplace',
    container: <CollectionList />
  },
  {
    title: 'Communities',
    description: 'Get VIP access to your favorite NFT Artists, Projects, or Brands Or create your own VIP community!',
    link: '/nftcommunities',
    container: <Communities />
  },
  {
    title: 'Top Videos',
    description: 'Stand out and help people find and connect with you by choosing a unique Video',
    link: '/videos',
    container: <TopVideos />
  },
  {
    title: 'Top Music',
    description: 'Stand out and help people find and connect with you by choosing a unique Music',
    link: '/music',
    container: <TopMusics />
  },
  {
    title: 'Top Channels',
    description: 'From gaming, to music, to learning, there\'s a place for you.',
    link: '/discourse',
    container: <TopDiscourse />
  },
  {
    title: 'Real World NFTs',
    description: 'Find NFTs of physical goods and items Or create your own',
    link: '/nftmarketplace',
    container: <RealWorldNFTs />
  }
]

const Box = styled.div`
  article {
    margin-top: 40px;
  }

  span {
    font-family: 'Ramabhadra', sans-serif;
    text-transform: uppercase;
    font-size: 50px;
    color: #bbb;
    text-align: center;
    cursor: pointer;
  }

  p {
    margin-bottom: 20px;
    font-size: 18px;
    text-align: center;
  }

  @media only screen and (max-width: 600px) {
    margin: 0 12px 0 0;
    text-align: center;

    article {
      margin-bottom: 15px;
    }

    span {
      font-size: 22px;
    }

    p {
      font-size: 12px;
      margin: -15px 12px 0 12px;
    }
  }
`

const Home = () => {

  const router = useRouter();
  const { account, Moralis, isAuthenticated } = useMoralis();
  const { left_sidebar, right_sidebar } = useSelector(state => state.settings);

  const handleRouters = (path) => {
    router.push(path, undefined, { shallow: true }).then()
  }

  useEffect(() => {
    if (account && isAuthenticated) {
      onUpdateOnlineInfo().then()
    }
  }, [isAuthenticated])

  const onUpdateOnlineInfo = async () => {

    const OnlineAccountsQuery = new Moralis.Query('OnlineAccounts');
    OnlineAccountsQuery.equalTo('account', account);
    const object = await OnlineAccountsQuery.first();

    if (object) {
      object.save().then((object) => {
        object.set('time', new Date());
        return object.save();
      });
    } else {
      const OnlineAccounts = Moralis.Object.extend('OnlineAccounts');
      const onlineAccounts = new OnlineAccounts();

      onlineAccounts.save({
        account,
        time: new Date(),
      });
    }
  }

  const AtomBox = (props) => {
    const { title, description, link, container } = props;
    return (
      <div className='row pt-100'>
        <div className='col-lg-12'>
          <Box>
            <article>
              <span onClick={() => handleRouters(link)}>{title}</span>
            </article>
            <p className='color-7'>{description}</p>
          </Box>
        </div>
        <div className='col-lg-12 color-b mb-5'>
          {container}
        </div>
      </div>
    )
  }

  return (
    <div>
      <MetaTag
        {...{
          title: 'Metasalt Homepage',
          description: DESCRIPTION,
          image: 'https://www.metasalt.io/img/bg.jpg',
        }}
      />
      <LayoutPage backHidden>
        <picture>
          <img src='img/bg.jpg' className='shadow w-full' alt='banner' />
        </picture>

        <div className={(!left_sidebar && !right_sidebar) ? 'home-container mt-4' : 'mt-4'}>
          {HOMEATOMS.map((item, index) => <div key={index}>{AtomBox(item)}</div>)}
        </div>
      </LayoutPage>
    </div>
  );
}

export default Home;
