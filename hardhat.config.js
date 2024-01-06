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
      accounts: [`your private key`],
    },
  },
};
