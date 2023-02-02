import bigInt from 'big-integer';
import _ from 'underscore';
import * as actionTypes from '../actionTypes';
import { PROD } from '../../../keys';

export const get721Data = (data) => ({
  type: actionTypes.GET_NFT721_DATA,
  payload: data || []
});

export const getLazyCollectionData = (data) => ({
  type: actionTypes.GET_LAZY_COLLECTION_DATA,
  payload: data
});

export const isLoading = (data) => ({
  type: actionTypes.UPDATE_IS_LOADING,
  payload: data
});

export const onUpdateCreator = (data) => ({
  type: actionTypes.UPDATE_CREATOR_NFT,
  payload: data
});

export const onRemoveCreator = () => ({
  type: actionTypes.EMPTY_CREATOR_NFT,
});

export const onUpdateGated = (data) => ({
  type: actionTypes.UPDATE_GATED_NFT,
  payload: data
});

export const onRemoveGated = () => ({
  type: actionTypes.EMPTY_GATED_NFT,
});

export const onUpdateSearch = (data) => ({
  type: actionTypes.UPDATE_SEARCH,
  payload: data
});

export const onEmptySearch = (data) => ({
  type: actionTypes.EMPTY_SEARCH,
  payload: data
});

export const onGetData = (Moralis, page, account) => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    await Moralis.Cloud.run('GetAllNFTs', {
      page: page || 0,
      step: 20,
      prod: PROD,
      hidden: account
    })
      .then(res => {
        // console.log('res', res)
        dispatch(get721Data(res));
      })
      .catch(e => console.log('e: ', e))
    dispatch(isLoading(false));
  }
};
