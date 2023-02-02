import { GET_NFT721_DATA, UPDATE_CREATOR_NFT, EMPTY_CREATOR_NFT, UPDATE_GATED_NFT, EMPTY_GATED_NFT, UPDATE_IS_LOADING, GET_LAZY_COLLECTION_DATA, UPDATE_SEARCH, EMPTY_SEARCH } from "../../actions/actionTypes";
import { updateObject } from "../utility";
import _ from 'underscore';
import bigInt from "big-integer";

const initialState = {
  nfts: [],
  nftsCollection: [],
  loading: false,
  total: 0,
  nft: {
    file: null,
    baseFile: null,
    isVideo: false,
    rate: 1,
    captcha: false,
    code: null,
    collection: null,
    brand: null,
    title: null,
    description: null,
    tokenPrice: null,
    isLazyMint: true,
    royalties: null,
    counts: 1,
    step: 0,
    note: null,
    erc1155: false,
    privateSale: false,
    tags: [],
    attributes: [],
    thumbnail: null,
  },
  gated: {
    file: null,
    baseFile: null,
    gateType: '',
    showGateTypeFilter: false,
    gateStatus: '',
    gateBrand: '',
    gateCollection: '',
    step: 0, // Details-0, Image-1,   NFTs-2, Content-3
    title: '',
    description: '',
    image: '',
    addedNFT: [],
    addedGlobalNFT: [],
    addedContent: [],
    startDate: null,
    andOrList: []
  },
  search: {
    lazyMint: false,
    normalMint: false,
    searchKey: null,
    erc721: false,
    erc1155: false,
    collection: false,
    category: false,
    buynow: false,
    cols: [],
    brands: [],
    eth: false,
    matic: false,
  }
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case GET_NFT721_DATA:
      const hexIdData = action.payload.data.map(x => {
        const hextokenId = '0x' + bigInt(x.token_id).toString(16);
        return { ...x, token_id: hextokenId }
      })
      const sortData = [...state.nfts, ...hexIdData].sort(function (a, b) {
        return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
      })
      const uniqueData1 = _.uniq(sortData, function (item) {
        return item.token_id;
      });

      return updateObject(state, {
        nfts: uniqueData1,
        total: action.payload.count
      });

    case GET_LAZY_COLLECTION_DATA:
      const myData3 = [...state.nftsCollection, ...action.payload]?.sort(function (a, b) {
        return new Date(b.last_token_uri_sync) - new Date(a.last_token_uri_sync)
      })
      const uniqueData3 = _.uniq(myData3, function (item) {
        return item.token_id;
      });
      return updateObject(state, {
        nftsCollection: uniqueData3
      });

    case UPDATE_CREATOR_NFT:
      return updateObject(state, {
        nft: { ...state.nft, ...action.payload }
      });

    case UPDATE_SEARCH:
      return updateObject(state, {
        search: { ...state.search, ...action.payload }
      });

    case EMPTY_CREATOR_NFT:
      return updateObject(state, {
        nft: {
          file: null,
          baseFile: null,
          captcha: false,
          code: null,
          collection: null,
          brand: null,
          title: null,
          description: null,
          tokenPrice: null,
          isLazyMint: true,
          royalties: null,
          counts: 1,
          step: 0,
          note: null,
          erc1155: false,
          privateSale: false,
          tags: [],
          attributes: [],
          thumbnail: null,
        }
      });

    case EMPTY_SEARCH:
      return updateObject(state, {
        search: {
          lazyMint: false,
          normalMint: false,
          searchKey: null,
          erc721: false,
          erc1155: false,
          collection: false,
          category: false,
          buynow: false,
          cols: [],
          brands: [],
          eth: false,
          matic: false,
        }
      });
    case UPDATE_GATED_NFT:
      return updateObject(state, {
        gated: { ...state.gated, ...action.payload }
      });

    case EMPTY_GATED_NFT:
      return updateObject(state, {
        gated: {
          file: null,
          baseFile: null,
          gateType: '',
          showGateTypeFilter: false,
          gateStatus: '',
          gateBrand: '',
          gateCollection: '',
          step: 0, // Details-0, Image-1,   NFTs-2, Content-3
          title: '',
          description: '',
          image: '',
          addedNFT: [],
          addedGlobalNFT: [],
          addedContent: [],
          startDate: null,
          andOrList: []
        }
      });
    case UPDATE_IS_LOADING:
      return updateObject(state, {
        loading: action.payload
      });
    default:
      return state;
  }
}

export default reducer;