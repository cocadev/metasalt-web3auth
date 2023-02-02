const ethUtil = require('ethereumjs-util');
const EIP712 = require("../sip/EIP712");

const LazyMintTypes = {
    AssetType: [
        { name: 'assetClass', type: 'bytes4' },
        { name: 'data', type: 'bytes' }
    ],
    Asset: [
        { name: 'assetType', type: 'AssetType' },
        { name: 'value', type: 'uint256' }
    ],
    Order: [
        { name: 'maker', type: 'address' },
        { name: 'makeAsset', type: 'Asset' },
        { name: 'taker', type: 'address' },
        { name: 'takeAsset', type: 'Asset' },
        { name: 'data', type: 'bytes' },
    ]
};

const TypesERC721 = {
	Mint721: [
		{name: 'tokenId', type: 'uint256'},
		{name: 'tokenURI', type: 'string'},
		{name: 'creator', type: 'address'},
		{name: 'royaltyFee', type: 'uint'}		
	]
};

const TypesERC1155 = {
    Mint1155: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'supply', type: 'uint256' },
        { name: 'tokenURI', type: 'string' },
        { name: 'creator', type: 'address' },
        { name: 'royaltyFee', type: 'uint256' }
    ]
};
export const ZERO = "0x0000000000000000000000000000000000000000";

export function AssetType(assetClass, data) {
    return { assetClass, data }
}

export function Asset(assetClass, assetData, value) {
    return { assetType: AssetType(assetClass, assetData), value };
}

export function Order(maker, makeAsset, taker, takeAsset, data) {
    return { maker, makeAsset, taker, takeAsset, data };
}

function id(str) {
    return `0x${ethUtil.keccak256(str).toString("hex").substring(0, 8)}`;
}

export function EncLazyMint721Data(web3Api, token, tokenId, tokenUri, creator, royaltyFee, signature = "0x") {
    return web3Api.eth.abi.encodeParameters(["address", "tuple(uint256, string, address, uint, bytes)"], [token, [tokenId, tokenUri, creator, royaltyFee, signature]]);
}

export function EncLazyMint1155Data(web3Api, token, tokenId, tokenUri, supply, creator, royaltyFee, signature="0x") {
	return web3Api.eth.abi.encodeParameters(["address", "tuple(uint256, string, uint256, address, uint, bytes)"], [token, [tokenId, tokenUri, supply, creator, royaltyFee, signature]]);
}

export function Enc(web3Api, token, tokenId) {
    if (tokenId) {
        return web3Api.eth.abi.encodeParameters(["address", "uint256"], [token, tokenId]);
    } else {
        return web3Api.eth.abi.encodeParameter("address", token);
    }
}

export async function SignOrder(web3Api, order, accounti, verifyingContract) {
    const chainId = Number(await web3Api.eth.getChainId());
    const data = EIP712.createTypeData({
        name: "MetaSaltMarket",
        version: "1",
        chainId,
        verifyingContract
    }, 'Order', order, LazyMintTypes);
    return (await EIP712.signTypedData(web3Api, accounti, data)).sig;
}

export async function SignMint721(web3Api, account, tokenId, tokenURI, creator, royaltyFee, verifyingContract) {
    const chainId = Number(await web3Api.eth.getChainId());

    console.log('chainId chainId', chainId)

    const data = EIP712.createTypeData({
        name: "Mint721",
        chainId,
        version: "1",
        verifyingContract
    }, 'Mint721', { tokenId, tokenURI, creator, royaltyFee }, TypesERC721);

    console.log('data data', data)

    return (await EIP712.signTypedData(web3Api, account, data)).sig;
}

export async function SignMint1155(web3Api, tokenId, tokenURI, supply, creator, royaltyFee, account, verifyingContract) {
    const chainId = Number(await web3Api.eth.getChainId());
    const data = EIP712.createTypeData({
        name: "Mint1155",
        chainId,
        version: "1",
        verifyingContract
    }, 'Mint1155', { tokenId, supply, tokenURI, creator, royaltyFee }, TypesERC1155);
    return (await EIP712.signTypedData(web3Api, account, data)).sig;
}

export const ETH = id(Buffer.from("ETH", "utf-8"));
export const ERC721 = id(Buffer.from("ERC721", "utf-8"));
export const ERC1155 = id(Buffer.from("ERC1155", "utf-8"));
export const ERC721_LAZY = id(Buffer.from("ERC721_LAZY", "utf-8"));
export const ERC1155_LAZY = id(Buffer.from("ERC1155_LAZY", "utf-8"));
