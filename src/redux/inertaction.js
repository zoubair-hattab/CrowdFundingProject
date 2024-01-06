import CrowdFunding from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';
import Project from '../artifacts/contracts/Project.sol/Project.json';

import {
  amountContributor,
  crowdFundingContractLoaded,
  newProjectContractsLoaded,
  newProjectsLoaded,
  numberOfContributor,
  projectContractsLoaded,
  projectsLoaded,
  withdrawContractBalance,
} from './actions/web3Action';
import {
  groupContributors,
  projectDataFormatter,
  withdrawRequestDataFormatter,
} from '../helper/helper';
import { toast } from 'react-toastify';
const crowdFundingContractAddress =
  '0xDCC820f15d0867f5c3aa73Dd92FF416D6BECB685';
export const loadCrowdFundingContract = async (web3, dispatch) => {
  try {
    if (web3) {
      const crowdFunding = new web3.eth.Contract(
        CrowdFunding.abi,
        crowdFundingContractAddress
      );
      await dispatch(crowdFundingContractLoaded(crowdFunding));
      return crowdFunding;
    }
  } catch (error) {
    console.log(error);
  }
};

// Start fund raising project
export const startFundRaising = async (
  web3,
  CrowdFundingContract,
  data,
  onSuccess,
  onError,
  dispatch
) => {
  const {
    minimumContribution,
    deadline,
    targetContribution,
    projectTitle,
    projectDesc,
    account,
    image,
  } = data;

  await CrowdFundingContract.methods
    .createProject(
      minimumContribution,
      deadline,
      targetContribution,
      projectTitle,
      projectDesc,
      image
    )
    .send({ from: account })
    .on('receipt', function (receipt) {
      const projectsReceipt = receipt.events.ProjectStarted.returnValues;
      const contractAddress = projectsReceipt.projectContractAddress;

      const formattedProjectData = projectDataFormatter(
        projectsReceipt,
        contractAddress
      );
      var projectConnector = new web3.eth.Contract(
        Project.abi,
        contractAddress
      );

      dispatch(newProjectContractsLoaded(projectConnector));
      dispatch(newProjectsLoaded(formattedProjectData));

      onSuccess();
    })
    .on('error', function (error) {
      onError(error.message);
    });
};
export const getAllFunding = async (CrowdFundingContract, web3, dispatch) => {
  try {
    const fundingProjectList = await CrowdFundingContract.methods
      .returnAllProjects()
      .call();
    const projectContracts = [];
    const projects = [];

    await Promise.all(
      fundingProjectList.map(async (data) => {
        var projectConnector = new web3.eth.Contract(Project.abi, data);
        const details = await projectConnector.methods
          .getProjectDetails()
          .call();
        projectContracts.push(projectConnector);
        const formattedProjectData = projectDataFormatter(details, data);
        projects.push(formattedProjectData);
      })
    );
    await dispatch(projectContractsLoaded(projectContracts));
    await dispatch(projectsLoaded(projects));
  } catch (error) {
    console.log(error.message);
  }
};
export const contribute = async (
  crowdFundingContract,
  data,
  dispatch,
  onSuccess,
  web3
) => {
  try {
    const { contractAddress, amount, account } = data;
    await crowdFundingContract.methods
      .contribute(contractAddress)
      .send({ from: account, value: amount })
      .on('receipt', function (receipt) {
        dispatch(
          amountContributor({
            projectId: contractAddress,
            amount: amount,
          })
        );

        onSuccess();
      });

    var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
    const getContributions = await projectConnector.methods
      .returnAllContributor()
      .call();
    groupContributors(getContributions, dispatch);
  } catch (error) {
    toast.error(error.message);
  }
};
// Request for withdraw amount
export const createWithdrawRequest = async (
  web3,
  contractAddress,
  data,
  onSuccess,
  onError
) => {
  try {
    const { description, amount, recipient, account } = data;
    var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
    await projectConnector.methods
      .createWithdrawRequest(description, amount, recipient)
      .send({ from: account })
      .on('receipt', function (receipt) {
        const withdrawReqReceipt =
          receipt.events.WithdrawRequestCreated.returnValues;
        console.log(withdrawReqReceipt);

        const formattedReqData = withdrawRequestDataFormatter(
          withdrawReqReceipt,
          withdrawReqReceipt.requestId
        );
        onSuccess(formattedReqData);
      });
  } catch (error) {
    toast.error(error.message);
  }
};
// Get all contributors by contract address
export const getContributors = async (
  web3,
  contractAddress,

  onError,
  dispatch
) => {
  try {
    var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);

    const getContributions = await projectConnector.methods
      .returnAllContributor()
      .call();
    groupContributors(getContributions, dispatch);
  } catch (error) {
    onError(error);
  }
};
// Get all withdraw request
export const getAllWithdrawRequest = async (
  web3,
  contractAddress,
  onLoadRequest
) => {
  var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
  var withdrawRequestCount = await projectConnector.methods
    .numOfWithdrawRequests()
    .call();
  var withdrawRequests = [];

  if (withdrawRequestCount <= 0) {
    onLoadRequest(withdrawRequests);
    return;
  }

  for (var i = 1; i <= withdrawRequestCount; i++) {
    const req = await projectConnector.methods.withdrawRequests(i - 1).call();
    withdrawRequests.push(
      withdrawRequestDataFormatter({ ...req, requestId: i - 1 })
    );
  }
  onLoadRequest(withdrawRequests);
};

// Vote for withdraw request
export const voteWithdrawRequest = async (web3, data, onSuccess) => {
  try {
    const { contractAddress, reqId, account } = data;
    var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
    await projectConnector.methods
      .voteWithdrawRequest(reqId)
      .send({ from: account })
      .on('receipt', function (receipt) {
        console.log(receipt);
        onSuccess();
      });
  } catch (error) {
    toast.error(error.message);
  }
};

// Withdraw requested amount
export const withdrawAmount = async (web3, dispatch, data, onSuccess) => {
  try {
    const { contractAddress, reqId, account, amount } = data;
    var projectConnector = new web3.eth.Contract(Project.abi, contractAddress);
    await projectConnector.methods
      .withdrawRequestedAmount(reqId)
      .send({ from: account })
      .on('receipt', function (receipt) {
        console.log(receipt);
        dispatch(
          withdrawContractBalance({
            contractAddress: contractAddress,
            withdrawAmount: amount,
          })
        );
        onSuccess();
      });
  } catch (error) {
    toast.error(error.message);
  }
};
