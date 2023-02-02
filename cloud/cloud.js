Moralis.settings.setAPIRateLimit({ anonymous: 3500, authenticated: 3500, windowMs: 60000 });

Moralis.Cloud.define('setAPIRateLimit_Max', async function (request) {
  await Moralis.settings.setAPIRateLimit({ anonymous: 3500, authenticated: 3500, windowMs: 60000 });
  return 'setAPIRateLimit called'
});

Moralis.Cloud.define('loadUsers', async (request) => {
  const query = new Moralis.Query('User');
  query.limit(1000);
  return await query.find({ useMasterKey: true });
});

Moralis.Cloud.define('getAllLiveStreamRooms', async () => {

  const liveStreamQuery = new Moralis.Query('LiveStream');
  liveStreamQuery.descending('createdAt');
  const allRooms = await liveStreamQuery.find();

  const userQuery = new Moralis.Query('User');
  userQuery.limit(1000);
  const users = await userQuery.find({ useMasterKey: true });

  const roomsList = [];
  await Promise.all(allRooms.map(room => {
    const filtered = users.filter(user => user.id === room.attributes.userId);
    roomsList.push({
      roomId: room.attributes.roomId,
      name: room.attributes.name,
      description: room.attributes.description,
      type: room.attributes.type,
      image: room.attributes.image,
      userId: room.attributes.userId,
      userAvatar: filtered[0].attributes.avatar || room.attributes.userAvatar || '',
    })
  }))

  return roomsList;
});

Moralis.Cloud.define('getMyLiveStreamRooms', async (request) => {

  const userId = request.params.userId;

  const liveStreamQuery = new Moralis.Query('LiveStream');
  liveStreamQuery.equalTo('deleted', false).equalTo('userId', userId).descending('createdAt');
  const myRooms = await liveStreamQuery.find();

  const userQuery = new Moralis.Query('User');
  userQuery.limit(1000);
  const users = await userQuery.find({ useMasterKey: true });

  const roomsList = [];
  await Promise.all(myRooms.map(room => {
    const filtered = users.filter(user => user.id === room.attributes.userId);
    roomsList.push({
      roomId: room.attributes.roomId,
      name: room.attributes.name,
      description: room.attributes.description,
      type: room.attributes.type,
      image: room.attributes.image,
      userId: room.attributes.userId,
      userAvatar: filtered[0].attributes.avatar || room.attributes.userAvatar || '',
    })
  }))

  return roomsList;
});

Moralis.Cloud.define('getLiveStreamRoomById', async (request) => {

  const roomId = request.params.roomId;

  const liveStreamQuery = new Moralis.Query('LiveStream');
  liveStreamQuery.equalTo('roomId', roomId);
  return await liveStreamQuery.first();
});

Moralis.Cloud.define('updateLiveStreamRoomById', async (request) => {

  const roomId = request.params.roomId;

  const liveStreamQuery = new Moralis.Query('LiveStream');
  liveStreamQuery.equalTo('roomId', roomId);
  const room = await liveStreamQuery.first();
  room.set({ name: request.params.name })
  room.set({ description: request.params.description })
  room.set({ type: request.params.type })
  room.set({ image: request.params.image })
  room.save()

  return { success: true, status: 200 };
});

Moralis.Cloud.define('deleteLiveStreamRoomById', async (request) => {

  const roomId = request.params.roomId;

  const liveStreamQuery = new Moralis.Query('LiveStream');
  liveStreamQuery.equalTo('roomId', roomId);
  const room = await liveStreamQuery.first();
  room.set({ deleted: true })
  room.save()

  return { success: true, status: 200 };
});

Moralis.Cloud.define('SendEmailAndSMSToUser', async (request) => {

  const userId = request.params.user;
  const itemId = request.params.item;

  const userQuery = new Moralis.Query('_User');
  userQuery.equalTo('objectId', userId);
  const user = await userQuery.first({ useMasterKey: true });

  let item;
  switch (request.params.type) {
    case 'community':
      const NFTGatesQuery = new Moralis.Query('NFTGates');
      NFTGatesQuery.equalTo('objectId', itemId);
      item = await NFTGatesQuery.first({ useMasterKey: true });
      break;
    case 'video':
      const VideosQuery = new Moralis.Query('Videos');
      VideosQuery.equalTo('objectId', itemId);
      item = await VideosQuery.first({ useMasterKey: true });
      break;
    case 'music':
      const MusicsQuery = new Moralis.Query('Musics');
      MusicsQuery.equalTo('objectId', itemId);
      item = await MusicsQuery.first({ useMasterKey: true });
      break;
  }

  const itemUserQuery = new Moralis.Query('_User');
  itemUserQuery.equalTo('objectId', item.attributes.owner);
  const itemUser = await itemUserQuery.first({ useMasterKey: true });

  const notificationRes = await Moralis.Cloud.httpRequest({
    method: 'POST',
    url: 'https://us-central1-metasaltnotifications.cloudfunctions.net/notification/sendNotificationFromMoralis',
    body: {
      userId: itemUser.id,
      account: user.attributes.accounts ? user.attributes.accounts[0] : '',
      username: user.attributes.username,
      avatar: user.attributes.avatar || '',
      type: request.params.type,
      tag: request.params.tag,
      link: request.params.link,
    },
    headers: { 'Content-Type': 'application/json' }
  })
  const notificationResData = notificationRes.data.data;

  if (notificationResData.service.email && notificationResData.service.email === 'on' && itemUser.attributes.email) {
    await Moralis.Cloud.sendEmail({
      to: itemUser.attributes.email,
      subject: capitalize(`${request.params.tag} ${request.params.type}`),
      html: notificationResData.emailBody,
    });
  }

  if (notificationResData.service.sms && notificationResData.service.sms === 'on' && itemUser.attributes.phone) {
    const basicAuth = Buffer.from('ACe02f60580111c9706d7fc9cab75a8592:3c87d461a398e260efe6531854c11d7e').toString('base64');
    await Moralis.Cloud.httpRequest({
      method: 'POST',
      url: 'https://api.twilio.com/2010-04-01/Accounts/ACe02f60580111c9706d7fc9cab75a8592/Messages.json',
      body: {
        Body: notificationResData.smsBody,
        From: '+19175408320',
        To: itemUser.attributes.phone,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
    })
  }

  return {
    success: true,
    status: 200,
    message: 'Email and SMS sent successfully',
    data: {
      notification: {
        userId: itemUser.id,
        username: user.attributes.username,
        avatar: user.attributes.avatar || '',
        type: request.params.type,
        tag: request.params.tag,
      },
      notificationRes,
      email: {
        to: itemUser.attributes.email,
        subject: capitalize(`${request.params.tag} ${request.params.type}`),
        html: notificationResData.emailBody,
      },
      sms: {
        Body: notificationResData.smsBody,
        From: '+19175408320',
        To: itemUser.attributes.phone,
      }
    }
  };
});

Moralis.Cloud.define('SendEmailAndSMSFromFirebase', async (request) => {

  const userId = request.params.userId;

  const userQuery = new Moralis.Query('_User');
  userQuery.equalTo('objectId', userId);
  const user = await userQuery.first({ useMasterKey: true });

  if (request.params.service.email && request.params.service.email === 'on' && user.attributes.email) {
    await Moralis.Cloud.sendEmail({
      to: user.attributes.email,
      subject: capitalize(request.params.type),
      html: request.params.emailBody,
    });
  }

  if (request.params.service.sms && request.params.service.sms === 'on' && user.attributes.phone) {
    const basicAuth = Buffer.from('ACe02f60580111c9706d7fc9cab75a8592:3c87d461a398e260efe6531854c11d7e').toString('base64');
    await Moralis.Cloud.httpRequest({
      method: 'POST',
      url: 'https://api.twilio.com/2010-04-01/Accounts/ACe02f60580111c9706d7fc9cab75a8592/Messages.json',
      body: {
        Body: request.params.smsBody,
        From: '+19175408320',
        To: user.attributes.phone,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
    })
  }

  return { success: true, status: 200, message: 'Email and SMS sent successfully' };
});

Moralis.Cloud.define('GetUserById', async (request) => {

  const userId = request.params.userId;

  const userQuery = new Moralis.Query('_User');
  userQuery.equalTo('objectId', userId);
  const user = await userQuery.first({ useMasterKey: true });

  return { success: true, status: 200, data: user };
});

Moralis.Cloud.define('GetAllNFTs', async (request) => {

  const page = request.params.page;
  const step = request.params.step;
  const PROD = request.params.prod;
  const token_id = request.params.token_id;
  const token_address = request.params.token_address;
  const owner_of = request.params.owner_of; // call nfts for one address
  const hidden = request.params.hidden; // call nfts except for hidden address
  const collection = request.params.collection; // call nfts
  const digital_tokenId = request.params.digital_tokenId;
  const multi = request.params.multi; // token_ids list
  const search = request.params.search; // normal mint

  const isIndividual = token_id && token_address && digital_tokenId; // call nft for one token_id 

  const erc721ETH = '0xf5c502a8c31a210eab6b7837e7c56d65d3af2f83';
  const erc1155ETH = '0xa8aba6bb110745e079ad90cbbaf62102c8ba80fe';
  const erc721POLYGON = '0x67e58df9f17bdef1245198d5565937fc42b5d217';
  const erc1155POLYGON = '0xee3a7c32b0e104ffa8e6384d0db1c9a21727aa9b';

  const erc721Goerli = '0x67e58df9f17bdef1245198d5565937fc42b5d217';
  const erc1155Goerli = '0xee3a7c32b0e104ffa8e6384d0db1c9a21727aa9b';
  const erc721Mumbai = '0x0a605283b727bc877b8d1953e34b297503c93614';
  const erc1155Mumbai = '0xbce1783109ca4b58833329cd9a59bb330f1b3296';

  const LazyMints = new Moralis.Query('LazyMints');
  LazyMints.notEqualTo('sold', true);
  const allLazyMints = await LazyMints.limit(500).find();
  const nftLazy = allLazyMints.map((item) => {

    const metadata = item.attributes.metadata ? JSON.parse(item.attributes.metadata) : null;
    const {category, brand} = (typeof metadata === 'object' ? metadata : JSON.parse(metadata))

    return {
      amount: item.attributes.supply || '1',
      contract_type: item.attributes.type || 'ERC721',
      is_valid: 0,
      metadata,
      name: 'MetaSaltNFT',
      owner_of: item.attributes.owner || item.attributes.creator,
      create_of: item.attributes.creator,
      token_address: item.attributes.token_address,
      token_id: item.attributes.tokenId,
      token_uri: item.attributes.tokenURI,
      lazyMint: true,
      last_metadata_sync: item.attributes.createdAt,      
      last_token_uri_sync: item.attributes.createdAt,
      synced_at: item.attributes.createdAt,
      type: item.attributes.type || 'ERC721',
      supply: item.attributes.supply || 1,
      royaltyFee: item.attributes.royaltyFee || 0,
      privateSale: item.attributes.privateSale || false,
      collection: category?.value,
      brand: brand?.value,
      thumbnail: item.attributes.thumbnail,
    }
  })

  let totalNFTs = []

  if(PROD){
    const nft721_eth = await Moralis.Web3API.token.getNFTOwners({ address: erc721ETH, chain: 'eth' })
    const nft1155_eth = await Moralis.Web3API.token.getNFTOwners({ address: erc1155ETH, chain: 'eth' })
    const nft721_polygon = await Moralis.Web3API.token.getNFTOwners({ address: erc721POLYGON, chain: 'polygon' })
    const nft1155_polygon = await Moralis.Web3API.token.getNFTOwners({ address: erc1155POLYGON, chain: 'polygon' })
    totalNFTs = [
      ...nftLazy, 
      ...nft721_eth?.result, 
      ...nft1155_eth?.result,
      ...nft721_polygon?.result,
      ...nft1155_polygon?.result
    ];
  }else {
    const nft721_goerli = await Moralis.Web3API.token.getNFTOwners({ address: erc721Goerli, chain: 'Goerli' })
    const nft1155_goerli = await Moralis.Web3API.token.getNFTOwners({ address: erc1155Goerli, chain: 'Goerli' })
    const nft721_mumbai = await Moralis.Web3API.token.getNFTOwners({ address: erc721Mumbai, chain: 'Mumbai' })
    const nft1155_mumbai = await Moralis.Web3API.token.getNFTOwners({ address: erc1155Mumbai, chain: 'Mumbai' })
    totalNFTs = [
      ...nftLazy, 
      ...nft721_goerli?.result, 
      ...nft1155_goerli?.result,
      ...nft721_mumbai?.result, 
      ...nft1155_mumbai?.result
    ];
  }

  //hidden
  const HideNFTs = new Moralis.Query('HideNFTs');
  if(hidden){
    HideNFTs.notEqualTo('owner', hidden);
  }
  const hideNFT = await HideNFTs.find(); // limit 100 as default
  const hideNFTs = hideNFT.map(item => { return item.attributes.token_id + item.attributes.token_address + item.attributes.owner})


  // buynow
  const OrderData = new Moralis.Query('OrderData');
  OrderData.notEqualTo('completed', true);
  const buynowData = await OrderData.limit(100).find();
  const buynowIDList = buynowData.map((item => item.attributes.tokenId))

  const filterNFTs = isIndividual 
    ? totalNFTs.filter(item => (item.token_id === token_id || item.token_id === digital_tokenId) && item.token_address.toLowerCase() === token_address.toLowerCase())
    : multi 
      ? totalNFTs.filter(item => multi.includes(item.token_id))
      : owner_of 
        ? totalNFTs.filter(item => item.owner_of === owner_of)
        : collection 
          ? totalNFTs.filter(item => item?.collection === collection)
          : search
            ? totalNFTs.filter(item => {
              const address = item.token_address?.toLowerCase();
              if(!item.metadata) return true
              const { lazyMint, type, searchKey, buynow, cols, brands, net } = search;
              const {name} = (typeof item.metadata === 'object' ? item.metadata : JSON.parse(item.metadata))
              return (lazyMint === "All" ? true : item.lazyMint === lazyMint) && 
              (item.contract_type.includes(type)) && 
              name?.toLowerCase()?.includes(searchKey?.toLowerCase()) &&
              (buynow ? buynowIDList.includes(item.token_id) : true) &&
              (cols?.length > 0 ? cols.includes(item.collection) : true) &&
              (brands?.length > 0 ? brands.includes(item.brand) : true) &&
              net === 'All' ? true : net === 'matic' 
              ? ( address === erc721POLYGON || address === erc1155POLYGON) : net === 'eth' 
              ? ( address === erc721ETH || address === erc1155ETH) : true
            })
            : totalNFTs

  const uniqTokenIdData = isIndividual ? filterNFTs : [...new Map(filterNFTs.map(item => [item['token_id'], item])).values()];
  const sortData = uniqTokenIdData.sort(function (a, b) {
    return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
  })
  const pagedData = sortData.slice(page * step, (page + 1) * step)

  function checkHexa(num) {
    return Boolean(num.match(/^0x[0-9a-f]+$/i))
  }

  function DecimalToHex(s) {
    if (!s) return null;
    function add(x, y) {
      let c = 0, r = [];
      var x = x.split('').map(Number);
      var y = y.split('').map(Number);
      while (x.length || y.length) {
        const s = (x.pop() || 0) + (y.pop() || 0) + c;
        r.unshift(s < 10 ? s : s - 10);
        c = s < 10 ? 0 : 1;
      }
      if (c) r.unshift(c);
      return r.join('');
    }

    let dec = '0';
    s.split('').forEach(function (chr) {
      const n = parseInt(chr, 16);
      for (let t = 8; t; t >>= 1) {
        dec = add(dec, dec);
        if (n & t) dec = add(dec, '1');
      }
    });
    return dec;
  }

  function filterItem(x) {
    if (!x) return null
    if (!x?.metadata) return null
    const { name } = JSON.parse(x?.metadata);
    if (!name) return null
    if(hideNFTs.includes(x?.token_id + x?.token_address + x?.owner_of)) return null
    const hextokenId = !checkHexa(x.token_id) ? x.token_id : DecimalToHex(x.token_id);
    if (x) {
      return { ...x, token_id: hextokenId }
    }
    return null
  }

  const filterData = await Promise.all(pagedData
    .map(async (item, ) => {
      return filterItem(item)
    }))

  return {
    success: true,
    status: 200,
    total: totalNFTs?.length,
    data: filterData.filter(u => u !== null),
    count: filterNFTs?.length,
    cols: 'test'
  };
});

const capitalize = (str, lower = false) => (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());