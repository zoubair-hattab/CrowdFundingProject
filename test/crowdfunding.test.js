/* eslint-disable jest/valid-expect */
const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const etherToWei = (n) => {
  return ethers.parseUnits(n, 'ether');
};
const dateToUNIX = (date) => {
  return Math.round(new Date(date).getTime() / 1000).toString();
};
describe('Crowdfunding', () => {
  async function deployProjectFixture() {
    const [address1, address2] = await ethers.getSigners();

    const Crowdfunding = await ethers.getContractFactory('Crowdfunding');
    const crowdfundingContract = await Crowdfunding.deploy();

    return { crowdfundingContract, address1, address2 };
  }
  it('Start a project', async function () {
    const { crowdfundingContract, address1 } = await loadFixture(
      deployProjectFixture
    );
    const minimumContribution = etherToWei('1');
    const deadline = dateToUNIX('2024-04-25');
    const targetContribution = etherToWei('100');
    const projectTitle = 'Testing title';
    const projectDesc = 'Testing description';
    const imageHash = 'www.imgae.com';

    const project = await crowdfundingContract
      .connect(address1)
      .createProject(
        minimumContribution,
        deadline,
        targetContribution,
        projectTitle,
        projectDesc,
        imageHash
      );
    await project.wait();

    const projectList = await crowdfundingContract.returnAllProjects();
    await expect(project)
      .to.emit(crowdfundingContract, 'ProjectStarted')
      .withArgs(
        projectList[0],
        address1.address,
        minimumContribution,
        deadline,
        targetContribution,
        0,
        0,
        projectTitle,
        projectDesc,
        0,
        imageHash
      );
  });

  it('Get data', async function () {
    const { crowdfundingContract, address1 } = await loadFixture(
      deployProjectFixture
    );
    const minimumContribution = etherToWei('1');
    const deadline = dateToUNIX('2024-04-25');
    const targetContribution = etherToWei('100');
    const projectTitle = 'Testing title';
    const projectDesc = 'Testing description';
    const imageHash = 'www.imgae.com';

    await crowdfundingContract
      .connect(address1)
      .createProject(
        minimumContribution,
        deadline,
        targetContribution,
        projectTitle,
        projectDesc,
        imageHash
      );
    const projectList = await crowdfundingContract.returnAllProjects();
    await expect(
      crowdfundingContract
        .connect(address1)
        .contribute(projectList[0], { value: etherToWei('4') })
    )
      .to.emit(crowdfundingContract, 'ContributionReceived')
      .withArgs(projectList[0], etherToWei('4'), address1.address);
  });
});
