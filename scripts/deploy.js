const hre = require('hardhat');

async function main() {
  const Crowdfunding = await hre.ethers.deployContract('Crowdfunding');

  await Crowdfunding.waitForDeployment();

  console.log(`deployed to ${Crowdfunding.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
