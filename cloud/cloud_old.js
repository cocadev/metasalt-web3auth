Moralis.Cloud.beforeSave("TestLikes", async (request) => {
  const userId = request.object.get("userId");
  const address = request.object.get("nftId");

  let msg = `New donation of ${userId} MATIC, from ${address}!`;

  logger.info("msg A ====>" + msg);

  let data = {
    app_id: "707eb1db-0728-4b70-a82e-e88528cc578e",
    contents: { "en": "Notification" },
    included_segments: ["testgroup"],
    name: "Email",
    email_body: msg,
    email_subject: "New Donation Received"
  }

  Moralis.Cloud.httpRequest({
    method: "POST",
    url: "https://onesignal.com/api/v1/notifications",
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZTQ4ODNhZDctZmM5YS00OTNhLWFjZmItZDhkNzM5NDhlYWVh'
    }
  }).then((res) => logger.info("res====>" + JSON.stringify(res)))
    .catch((e) => logger.info("e====>" + JSON.stringify(e)))

})

Moralis.Cloud.define("loadLikes", async (request) => {
  const query = new Moralis.Query("TestLikes");
  const results = await query.find({ useMasterKey: true });
  return results;
});

Moralis.Cloud.define("loadBrands", async (request) => {
  const query = new Moralis.Query("Brands");
  query.equalTo("category", request.params.category);
  const results = await query.find();
  return results;
});

Moralis.Cloud.define("loadBrandsByCreatorId", async (request) => {
  const query = new Moralis.Query("Brands");
  query.equalTo("creatorId", request.params.creatorId);
  const results = await query.find();
  return results;
});

Moralis.Cloud.define("loadBrandsByObjectId", async (request) => {
  const query = new Moralis.Query("Brands");
  query.equalTo("objectId", request.params.objectId);
  const results = await query.find();
  return results;
});

Moralis.Cloud.define("loadUsers", async (request) => {
  const query = new Moralis.Query("User");
  query.limit(1000);
  const allusers = await query.find({ useMasterKey: true });
  return allusers;
});

Moralis.Cloud.define("loadComments", async (request) => {
  const query = new Moralis.Query("TestComments");
  query.equalTo("nftID", request.params.id);
  const results = await query.find();
  let sum = 0;
  for (let i = 0; i < results.length; ++i) {
    sum += results[i].get("stars");
  }
  return sum / results.length;
});

Moralis.Cloud.define("distinctLazyCollection", async () => {
  const query = new Moralis.Query("LazyCollections");
  query.distinct("token_address")
  .then(function (results) {
    return results
  }).catch(function (error) {
    return error
  });
});

// Catch the NFT transfer event when it is saved to the EthNFTTransfers by Moralis and use the request to store the latest owner of that NFT in our NftOwners table
Moralis.Cloud.afterSave("EthNFTTransfers", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  const query = new Moralis.Query("NftOwners");
  query.equalTo("token_id", request.object.get("token_id"));
  query.equalTo("token_address", request.object.get("token_address"));
  const row_object = await query.first({ useMasterKey: true });

  // If NFT already exists
  if (row_object) {
    // Update the owner to the laset owner
    row_object.set("owner_address", request.object.get("to_address"));
    // Save changes to the database
    try {
      await row_object.save({ useMasterKey: true });
    } catch (err) {
      logger.info(err);
    }
  }
  // If it's a new NFT.
  else {
    // Create and save it to the database
    let newNFT = new Moralis.Object("NftOwners");
    newNFT.set("token_id", request.object.get("token_id"));
    newNFT.set("token_address", request.object.get("token_address"));
    newNFT.set("owner_address", request.object.get("token_id"));
    newNFT.set("nft_name", "unnamed"); // TODO; not being used currently.
    await newNFT.save({ useMasterKey: true });
  }
});

Moralis.Cloud.define("getGatedContent", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  // To ensure user has logged in. TODO: There are better approaches to this; https://docs.moralis.io/moralis-server/cloud-code/cloud-functions#more-advanced-validation
  if (request.user) {

    // Collection used for testing in Opensea; Testingthisstuff. https://testnets.opensea.io/collection/testingthisstuff
    // nftToGatedContent used for mapping from NFT to gated content.
    // NFT is identified by <token_address>_<token_id>
    // Mapping: <token_address>_<token_id> -> <gated content string>
    let nftToGatedContent = {
      "0x174dea7e9e321aef1c17b23b94f30447b64dfd79_85231207006857958772524804224583390359793105799594100197748269429146658013236"
        : "Gated content for Tesst",

      "0x174dea7e9e321aef1c17b23b94f30447b64dfd79_99366986102998127194235417802329032456626366240667765614231417002418145067065"
        : "Gated content for Test 2"
    };

    // Get logged in user's ETH address.
    const userEthAddress = request.user.get("ethAddress"); // Ex: returns "0xc74a9803cc566535672028b90ea32a6cce5064f0"

    // NftOwners is a table that we store NFT tokens and who owns them currently. This table will automatically updated when a user makes an NFT transfer.
    const query = new Moralis.Query("NftOwners");
    // Get only the logged-in user's NFT's
    query.equalTo("owner_address", userEthAddress);

    const nftsOwnedByUser = await query.find({ useMasterKey: true }); // Ex: [{"owner_address":"0xc74a9803cc566535672028b90ea32a6cce5064f0","createdAt":"2022-02-11T11:39:20.404Z","updatedAt":"2022-02-11T15:26:19.608Z","token_address":"0x0ea82ca03aa355941271efbe1b0ee66ef3a74ea3","token_id":"112310352153202421499958867797769186319214905582065839985351320021994009788417","nft_name":"Tesst","objectId":"nuUo1uZB0GgMEDfgknfExZpu"},{"owner_address":"0xc74a9803cc566535672028b90ea32a6cce5064f0","token_address":"0x0ea82ca03aa355941271efbe1b0ee66ef3a74ea3","nft_name":"Test2","token_id":"112310352153202421499958867797769186319214905582065839985351320023093521416193","createdAt":"2022-02-11T15:11:59.156Z","updatedAt":"2022-02-11T15:11:59.156Z","objectId":"vm8rFd6xUDkvtJkbKv5I4YkF"},{"owner_address":"0xc74a9803cc566535672028b90ea32a6cce5064f0","nft_name":"Test3","token_address":"0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656","token_id":"112310352153202421499958867797769186319214905582065839985351320021994009788417","createdAt":"2022-02-11T15:12:15.943Z","updatedAt":"2022-02-11T15:12:15.943Z","objectId":"N8h3ezP4jZTWgesulpCg2dT7"},{"nft_name":"Unlock Key","token_address":"0xb75c36fdfdf6f38363719dd3b1dd8ffe1ebc172f","token_id":"1","owner_address":"0xc74a9803cc566535672028b90ea32a6cce5064f0","createdAt":"2022-02-11T15:12:30.235Z","updatedAt":"2022-02-11T15:12:35.191Z","objectId":"jZreskE1VfGX87DegyLWRI4T"}]

    // If user does not have any NFTs
    if (nftsOwnedByUser.length == 0) { return "NotEnoughNFTs" }

    // Result to return by this method.
    let gatedContentToReturn = {};

    // Iterate over NFTs and add gated content to response
    for (let nft of nftsOwnedByUser) {
      let nftKEy = nft.get("token_address") + "_" + nft.get("token_id");
      gatedContentToReturn[nft.get("nft_name")] = nftToGatedContent[nftKEy]
    }


    return gatedContentToReturn; // returns {"":"Gated content for Tesst"}
  }
  else {
    return "Not authorized";
  }

});

// In case you need to sync the NftOwners table manually.
// This can be called to initialize your NftOwners table.
// Goes throug the EthNFTTransfers table and pick the latest transfers to add into NftOwners table.
Moralis.Cloud.define("syncNftOwners", async (request) => {
  const logger = Moralis.Cloud.getLogger();

  const ethNFTTransfersQuery = new Moralis.Query("EthNFTTransfers");
  const ethNFTTransfers = await ethNFTTransfersQuery.find({ useMasterKey: true });

  // Sort Nft transactions by block_number ascending. Latest transaction is at the end.
  ethNFTTransfers.sort(function (a, b) {
    let x = a["block_number"]; let y = b["block_number"];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });

  // Iterate over each transfer starting from lowest block number (oldest transaction)
  for (let nftTransfer of ethNFTTransfers) {

    // Query NftOwners to find if NFT is already in the table.
    const getNFTQuery = new Moralis.Query("NftOwners");
    getNFTQuery.equalTo("token_id", nftTransfer.get("token_id"));
    getNFTQuery.equalTo("token_address", nftTransfer.get("token_address"));
    const row_object = await getNFTQuery.first({ useMasterKey: true });

    // If NFT already exists
    if (row_object) {
      // Update the owner to the laset owner
      row_object.set("owner_address", nftTransfer.get("to_address"));
      // Save changes in the database
      try {
        await row_object.save({ useMasterKey: true });
      } catch (err) {
        logger.info(err);
      }
    }
    // If it's a new NFT.
    else {
      // Create and save it to the database
      let newNFT = new Moralis.Object("NftOwners");
      newNFT.set("token_id", nftTransfer.get("token_id"));
      newNFT.set("token_address", nftTransfer.get("token_address"));
      newNFT.set("owner_address", nftTransfer.get("to_address"));
      newNFT.set("nft_name", "unnamed");
      await newNFT.save({ useMasterKey: true });
    }

  }

  return "success";
});

Moralis.Cloud.define("loadNFTs", async (request) => {
  const collectionAddress = request.params.collectionAddress;
  const chain = request.params.chainId;
  const account = request.params.account;
  const collection = request.params.collection;
  const brand = request.params.brand;
  const colName = request.params.colName;
  
  let cursor = null;
  let allNFTs = [];
  do {
    const NFTs = await Moralis.Web3API.token.getAllTokenIds({
      address: collectionAddress,
      limit: 100,
      cursor: cursor,
      chain,
    });
    // If results are found, save to master array
    if (
      NFTs.result !== undefined &&
      NFTs.result !== null &&
      NFTs.result.length !== 0
    ) {
      allNFTs = allNFTs.concat(NFTs.result);
      // Update cursor
      cursor = NFTs.cursor;
    } else {
      // Update cursor
      cursor = null;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  } while (cursor != "" && cursor != null);

  /* ...
   Manipulation on data that takes a rather long time
  ...
  */
  let nftArr = allNFTs;
  let arrayToWrite = [];
  for (let i = 0; i < nftArr.length; i++) {
    nftArr[i].metadata && 
    arrayToWrite.push({
      update: {
        name: nftArr[i].name,
        token_id: nftArr[i].token_id,
        token_address: nftArr[i].token_address,
        token_hash: nftArr[i].token_hash,
        token_uri: nftArr[i].token_uri,
        symbol: nftArr[i].symbol,
        contract_type: nftArr[i].contract_type,
        amount: nftArr[i].amount,
        image: nftArr[i].image,
        metadata: nftArr[i].metadata,
        synced_at: nftArr[i].synced_at,
        last_token_uri_sync: nftArr[i].last_token_uri_sync,
        last_metadata_sync: nftArr[i].last_metadata_sync,
        block_number_minted: nftArr[i].block_number_minted,
        creator: account,
        collection,
        brand
      },
    });
  }
  await Moralis.bulkWrite(
    colName,
    arrayToWrite
  );

  return nftArr.length
});

// cloud version 2