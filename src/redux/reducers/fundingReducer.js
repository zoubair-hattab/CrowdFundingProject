import * as types from '../type/types';
const initialState = {};
export const fundingReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case types.CROWD_FUNDING_CONTRACT_LOADED:
      return {
        ...state,
        contract: action.payload,
      };
    default:
      return state;
  }
};
