import { weiToEther } from '../../helper/helper';
import * as types from '../type/types';
const initialState = {};
export const projectReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case types.PROJECT_CONTRACTS_LOADED:
      return {
        ...state,
        projectContracts: action.payload,
      };
    case types.PROJECTS_LOADED:
      return {
        ...state,
        projects: action.payload,
      };
    case types.NEW_PROJECT_CONTRACT_LOADED:
      return {
        ...state,
        projectContracts: [...state.projectContracts, action.payload],
      };
    case types.NEW_PROJECT_LOADED:
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case types.INCREASE_PROGRESS:
      const { projectId, amount } = action.payload;
      var updatedState = state.projects.map((data) => {
        if (data.address === projectId) {
          data['currentAmount'] =
            parseFloat(data.currentAmount) + parseFloat(weiToEther(amount));
        }
        return data;
      });
      return {
        ...state,
        projects: updatedState,
      };
    case types.WITHDRAW_BALANCE:
      const { contractAddress, withdrawAmount } = action.payload;
      var updatedState = state.projects.map((data) => {
        if (data.address === contractAddress) {
          data['contractBalance'] =
            Number(data.contractBalance) - Number(withdrawAmount);
        }
        return data;
      });
      return {
        ...state,
        projects: updatedState,
      };
    default:
      return state;
  }
};
