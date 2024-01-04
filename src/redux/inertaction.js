import CrowdFunding from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';
import Project from '../artifacts/contracts/Project.sol/Project.json';

import {
  amountContributor,
  crowdFundingContractLoaded,
  newProjectContractsLoaded,
  newProjectsLoaded,
  projectContractsLoaded,
  projectsLoaded,
} from './actions/web3Action';
import { projectDataFormatter } from '../helper/helper';
const crowdFundingContractAddress =
  '0xB3Cb80b84E898B221Bee4deFd746DEC0D1324081';
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
  onError
) => {
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
    })
    .on('error', function (error) {
      onError(error.message);
    });
};
