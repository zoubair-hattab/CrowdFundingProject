import { combineReducers } from 'redux';
import { web3Reducer } from './web3Reducer';
import { fundingReducer } from './fundingReducer';
import { projectReducer } from './projectReducer';

export default combineReducers({
  web3Reducer,
  fundingReducer,
  projectReducer,
});
