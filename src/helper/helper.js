import Web3 from 'web3';
import moment from 'moment';
import {
  numberOfContributor,
  walletAddressLoaded,
  walletNetworkLoaded,
  web3Loaded,
} from '../redux/actions/web3Action';
import { loadCrowdFundingContract } from '../redux/inertaction';
import { toast } from 'react-toastify';
import _ from 'lodash';

export const weiToEther = (num) => {
  return Web3.utils.fromWei(num, 'ether');
};
export const etherToWei = (num) => {
  const bigNumber = Web3.utils.toWei(num, 'ether');
  return bigNumber.toString();
};
export const unixToDate = (unixDate) => {
  return moment(unixDate).format('MM-DD-YYYY');
};

export const state = ['Fundraising', 'Expired', 'Successful'];
export const projectDataFormatter = (data, contractAddress) => {
  const formattedData = {
    address: contractAddress,
    creator: data?.projectStarter,
    contractBalance: data.balance ? weiToEther(data.balance) : 0,
    title: data.title,
    description: data.desc,
    minContribution: weiToEther(data?.minContribution),
    goalAmount: weiToEther(data?.goalAmount),
    currentAmount: weiToEther(data.currentAmount),
    state: state[Number(data?.currentState)],
    deadline: unixToDate(Number(data?.projectDeadline)),
    progress: weiToEther(data?.currentAmount),
    image: data?.image,
  };
  return formattedData;
};

export const withdrawRequestDataFormatter = (data) => {
  return {
    requestId: data.requestId,
    totalVote: data.noOfVotes,
    amount: weiToEther(data.amount),
    status: data.isCompleted ? 'Completed' : 'Pending',
    desc: data.description,
    reciptant: data.reciptent,
  };
};
const formatContribution = (contributions) => {
  const formattedData = contributions.map((data) => {
    return {
      contributor: data.contributorAddress,
      amount: Number(weiToEther(data.amount)),
    };
  });
  return formattedData;
};
export const groupContributors = (contributions, dispatch) => {
  const contributorList = formatContribution(contributions);
  const contributorGroup = _.map(
    _.groupBy(contributorList, 'contributor'),
    (o, address) => {
      return { contributor: address, amount: _.sumBy(o, 'amount') };
    }
  );
  dispatch(numberOfContributor(contributorGroup));

  return contributorGroup;
};
const hexToDecimal = (hex) => parseInt(hex, 16);

export const networks = {
  80001: {
    chainId: '0x13881',
    chainName: 'soplia Network',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc2.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
};
export const connectWallet = async (dispatch) => {
  if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    try {
      const provider = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const network = await provider.eth.net.getId();

      await dispatch(web3Loaded(provider));
      await dispatch(walletAddressLoaded(accounts[0]));
      await loadCrowdFundingContract(provider, dispatch);
      // await dispatch(projectContract(provider));
      await dispatch(walletNetworkLoaded(network));

      // onSuccess();
    } catch (err) {
      toast.error(err.message);
    }
  } else {
    /* MetaMask is not installed */
    toast.error('Please install MetaMask');
  }
};

export const currentWalletConnected = async (dispatch) => {
  if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    try {
      const provider = new Web3(window.ethereum);
      const accounts = await provider.eth.getAccounts();
      if (accounts.length > 0) {
        const network = await provider.eth.net.getId();
        /* get signer */
        await dispatch(web3Loaded(provider));
        await dispatch(walletAddressLoaded(accounts[0]));
        // await dispatch(projectContract(provider));
        await dispatch(walletNetworkLoaded(network));
        const contract = await loadCrowdFundingContract(provider, dispatch);
        return { provider, contract };
      } else {
        const contract = await loadCrowdFundingContract(provider, dispatch);
        return { provider, contract };
      }
    } catch (err) {
      toast.error(err.message);
      return { provider: null, contract: null };
    }
  } else {
    /* MetaMask is not installed */
    toast.error('Please install MetaMask');
    return { provider: null, contract: null };
  }
};

export const addWalletListener = async (dispatch) => {
  if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    window.ethereum.on('accountsChanged', async (accounts) => {
      await dispatch(walletAddressLoaded(accounts[0]));
    });
  } else {
    /* MetaMask is not installed */
    await dispatch(walletAddressLoaded(''));
    toast.error('Please install MetaMask');
  }
};
export const addNeworkListener = async (dispatch) => {
  if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
    window.ethereum.on('chainChanged', async (network) => {
      await dispatch(walletNetworkLoaded(hexToDecimal(network)));
      await currentWalletConnected(dispatch);
    });
  } else {
    toast.error('Please install MetaMask');
  }
};

export const switchNework = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networks[80001].chainId }],
    });
    window.location.reload();
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networks[80001]],
        });
        window.location.reload();
      } catch (addError) {
        if (addError.code === 4001) {
          toast.error('Please approve  network.');
        } else {
          toast.error(addError);
        }
      }
    } else {
      toast.error(switchError);
    }
  }
};
