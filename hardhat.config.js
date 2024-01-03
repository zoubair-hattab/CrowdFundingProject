require('@nomicfoundation/hardhat-toolbox');
module.exports = {
  solidity: '0.8.9',
  // defaultNetwork: "rinkeby",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    polygon_mumbai: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
      accounts: [
        `0e732ee3048e0dddf4572c0f02a270bae041da444d0717afa993cc6fb8da630a`,
      ],
    },
  },
};
