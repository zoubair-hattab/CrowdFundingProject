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
        `735b0026534570975c7d2f3a54d45e622123d57f472336f65043df74d6feebeb`,
      ],
    },
  },
};
