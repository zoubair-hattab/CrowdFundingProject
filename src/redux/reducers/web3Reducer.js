import * as types from '../type/types';
const initialState = {};

export const web3Reducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case types.WEB3_LOADED:
      return {
        ...state,
        connection: action.payload,
      };
    case types.WALLET_ADDRESS_LOADED:
      return {
        ...state,
        account: action.payload,
      };
    case types.WALLET_NETWORK_LOADED:
      return {
        ...state,
        network: action.payload,
      };
    default:
      return state;
  }
};
