const DOMAIN_TYPE = [
  {
    type: "string",
    name: "name"
  },
  {
    type: "string",
    name: "version"
  },
  {
    type: "uint256",
    name: "chainId"
  },
  {
    type: "address",
    name: "verifyingContract"
  }
];

export const createTypeData = (domainData, primaryType, message, types) => {
  return {
    types: Object.assign({
      EIP712Domain: DOMAIN_TYPE,
    }, types),
    domain: domainData,
    primaryType: primaryType,
    message: message
  };
};

export const signTypedData = (web3, from, data) => {
  return new Promise(async (resolve, reject) => {
    function cb(err, result) {
      console.log('cb', err, result);
      if (err) {
        return reject(err);
      }
      if (result.error) {
        return reject(result.error);
      }

      const sig = result.result;
      const sig0 = sig.substring(2);
      const r = "0x" + sig0.substring(0, 64);
      const s = "0x" + sig0.substring(64, 128);
      const v = parseInt(sig0.substring(128, 130), 16);

      resolve({
        data,
        sig,
        v, r, s
      });
    }
    if (web3.currentProvider.isMetaMask) {
      console.log('c c')

      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "eth_signTypedData_v3",
        params: [from, JSON.stringify(data)],
        id: new Date().getTime()
      }, cb);
    } else {

      let send = web3.currentProvider.sendAsync;
      send = web3.currentProvider.send;
      // console.log('send send', send)

      // if (!send) send = web3.currentProvider.send;
      
      console.log('from from', from)
      console.log('data data', data)

      // send.bind(web3.currentProvider)({
      //   jsonrpc: "2.0",
      //   method: "eth_signTypedData",
      //   params: [from, data],
      //   id: new Date().getTime()
      // }, cb);

      try {
        const res = await web3.currentProvider.sendAsync({        
          method: "eth_signTypedData_v3",
          params: [from, data],
          id: new Date().getTime(),
          fromAddress: from
        });
        cb(null, {result:res});
      } catch (err){
        console.log('err', err);
        cb(err, null);
      }
    }
  });
}
