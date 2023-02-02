import bigInt from 'big-integer';
import _ from 'underscore';
import UtilService from '../sip/utilService';
import { Alchemy, Network } from 'alchemy-sdk';
import { ALCHEMY_KEY, GOERLI_MINT1155_ADDRESS, GOERLI_MINT721_ADDRESS, MAIN_MINT1155_ADDRESS, MAIN_MINT721_ADDRESS, MUMBAI_MINT1155_ADDRESS, MUMBAI_MINT721_ADDRESS, POLYGON_MINT1155_ADDRESS, POLYGON_MINT721_ADDRESS, PROD } from '../keys';
import { getAllLazyMints } from './api';

const onGetNFTByAddress = (account, cb) => { // account means that enable global calls

  return async () => {

    // lazy mints
    // const resMetasalt = await Moralis.Cloud.run('GetAllNFTs', request);
    const resMetasalt = await getAllLazyMints()

    // global mints
    let globalNFTs = [];
    if (account) {

      const ethAlchemy = new Alchemy({
        apiKey: ALCHEMY_KEY,
        network: PROD ? Network.ETH_MAINNET : Network.ETH_GOERLI,
      });

      const polygonAlchemy = new Alchemy({
        apiKey: ALCHEMY_KEY,
        network: PROD ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI,
      });

      const ethNfts = await ethAlchemy.nft.getNftsForOwner(account);
      const polygonNfts = await polygonAlchemy.nft.getNftsForOwner(account);

      const eth = ethNfts.ownedNfts?.map(x => {
        const hextokenId = UtilService.checkHexa(x.tokenId) ? x.tokenId : '0x' + bigInt(x.tokenId).toString(16);
        return {
          token_id: hextokenId,
          amount: x.balance,
          contract_type: x.tokenType,
          last_metadata_sync: x.timeLastUpdated,
          last_token_uri_sync: x.timeLastUpdated,
          metadata: JSON.stringify(x.rawMetadata),
          owner_of: account,
          symbol: x.contract.symbol,
          token_address: x.contract.address,
          net: PROD ? 'eth' : 'goerli'
        }
      })

      const polygon = polygonNfts.ownedNfts?.map(x => {
        const hextokenId = UtilService.checkHexa(x.tokenId) ? x.tokenId : '0x' + bigInt(x.tokenId).toString(16);
        return {
          token_id: hextokenId,
          amount: x.balance,
          contract_type: x.tokenType,
          last_metadata_sync: x.timeLastUpdated,
          last_token_uri_sync: x.timeLastUpdated,
          metadata: JSON.stringify(x.rawMetadata),
          owner_of: account,
          symbol: x.contract.symbol,
          token_address: x.contract.address,
          net: PROD ? 'polygon' : 'mumbai'
        }
      })

      globalNFTs = [...eth, ...polygon]
    }

    // uniq nft
    const allFiltered = _.uniq([...resMetasalt?.data, ...(globalNFTs || [])], c => c.token_id)

    // filter created Date
    const filtered = allFiltered?.sort(function (a, b) {
      return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
    });

    cb({
      data: filtered,
      count: resMetasalt.count
    })
  }
};

const onGetSearchData = (cb) => { // account means that enable global calls

  return async () => {

    // lazy mints
    const resMetasalt = await getAllLazyMints()

    const ethAlchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: PROD ? Network.ETH_MAINNET : Network.ETH_GOERLI,
    });

    const polygonAlchemy = new Alchemy({
      apiKey: ALCHEMY_KEY,
      network: PROD ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI,
    });

    const ethNfts721 = await ethAlchemy.nft.getNftsForContract(PROD ? MAIN_MINT721_ADDRESS : GOERLI_MINT721_ADDRESS);
    const ethNfts1155 = await ethAlchemy.nft.getNftsForContract(PROD ? MAIN_MINT1155_ADDRESS : GOERLI_MINT1155_ADDRESS);
    const polygonNfts721 = await polygonAlchemy.nft.getNftsForContract(PROD ? POLYGON_MINT721_ADDRESS : MUMBAI_MINT721_ADDRESS);
    const polygonNfts1155 = await polygonAlchemy.nft.getNftsForContract(PROD ? POLYGON_MINT1155_ADDRESS : MUMBAI_MINT1155_ADDRESS);

    const globalNFTs = [...ethNfts721?.nfts, ...ethNfts1155?.nfts, ...polygonNfts721?.nfts, ...polygonNfts1155?.nfts]

    const all = globalNFTs?.map(x => {
      const hextokenId = UtilService.checkHexa(x.tokenId) ? x.tokenId : '0x' + bigInt(x.tokenId).toString(16);
      return {
        token_id: hextokenId,
        contract_type: x.tokenType,
        last_metadata_sync: x.rawMetadata.date,
        last_token_uri_sync: x.rawMetadata.date,
        metadata: JSON.stringify(x.rawMetadata),
        token_address: x.contract.address,
        net: UtilService.checkNet(x.contract.address)
      }
    })

    // uniq nft
    const allFiltered = _.uniq([...resMetasalt.data, ...(all || [])], c => c.token_id)

    // filter created Date
    const filtered = allFiltered?.sort(function (a, b) {
      return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
    });

    cb({
      data: filtered,
      count: resMetasalt.count
    })
  }
};

const onLikes = (request, callback) => {

  const { Moralis, itemId, user, type, router, follow } = request;
  const userId = user?.id;

  if (!userId) {
    router.push('/login', undefined, { shallow: true });
    return () => callback()
  } else {
    return async () => {

      const AllLikes = Moralis.Object.extend('AllLikes');
      const allLikes = new AllLikes();
      const AllLikesQuery = new Moralis.Query('AllLikes');
      AllLikesQuery.equalTo('itemId', itemId).equalTo('userId', userId).equalTo('follow', follow);

      const object = await AllLikesQuery.first();

      let link = ''
      switch (type) {
        case 'community':
          link = `https://www.metasalt.io/nftcommunities/${itemId}`
          break;
        case 'video':
          link = `https://www.metasalt.io/videos/${itemId}`
          break;
        case 'music':
          link = `https://www.metasalt.io/musics/${itemId}`
          break;
      }
      console.log('onLikes =====>', link)

      if (object) {
        object.destroy().then(() => {

          callback();

          const RealTimeHistory = Moralis.Object.extend('RealTimeHistory');
          const realTimeHistory = new RealTimeHistory();
          realTimeHistory.save({
            account: userId,
            date: new Date(),
            itemId,
            type,
            tag: 'unlike ' + type
          });
        }, () => { });

        try {
          if (['community', 'video', 'music'].includes(type)) {
            await Moralis.Cloud.run('SendEmailAndSMSToUser', {
              user: userId,
              item: itemId,
              type,
              tag: 'dislike',
              link,
            })
          }
        } catch (e) {
        }
      } else {

        allLikes.save({ userId, itemId, type, follow }).then(() => {

          callback();

          const RealTimeHistory = Moralis.Object.extend('RealTimeHistory');
          const realTimeHistory = new RealTimeHistory();
          realTimeHistory.save({
            account: userId,
            date: new Date(),
            itemId,
            tag: 'like ' + type
          });
        }, () => { });

        try {
          if (['community', 'video', 'music'].includes(type)) {
            await Moralis.Cloud.run('SendEmailAndSMSToUser', {
              user: userId,
              item: itemId,
              type,
              tag: 'like',
              link
            })
          }
        } catch (e) {
        }
      }
    }
  }
}

const onSaveRewards = (request, cb) => {

  const { Moralis, account, chainId, counts } = request;

  return async () => {

    if (!account) {
      return false;
    }

    const RewardsQuery = new Moralis.Query('Rewards');
    RewardsQuery.equalTo('owner', account);
    const object1 = await RewardsQuery.first();

    if (!object1) {

      const Rewards = Moralis.Object.extend('Rewards');
      const rewards = new Rewards();
      if (chainId === '0x13881') {
        rewards.save({
          owner: account,
          MUMBAI: Number(counts)
        })
      }
      if (chainId === '0x89') {
        rewards.save({
          owner: account,
          POLYGON: Number(counts)
        })
      }
      if (chainId === '0x5') {
        rewards.save({
          owner: account,
          GOERLI: Number(counts)
        })
      }
      if (chainId === '0x1') {
        rewards.save({
          owner: account,
          ETH: Number(counts)
        })
      }
      cb();
    } else {
      object1.save().then((object) => {
        object.set('owner', account);
        if (chainId === '0x13881') {
          object.set('MUMBAI', (object1.attributes.MUMBAI || 0) + Number(counts));
        }
        if (chainId === '0x89') {
          object.set('POLYGON', (object1.attributes.POLYGON || 0) + Number(counts));
        }
        if (chainId === '0x5') {
          object.set('GOERLI', (object1.attributes.GOERLI || 0) + Number(counts));
        }
        if (chainId === '0x1') {
          object.set('ETH', (object1.attributes.ETH || 0) + Number(counts));
        }
        return object.save();
      });
      cb();
    }
  }
}

export {
  onGetSearchData,
  onLikes,
  onSaveRewards
}