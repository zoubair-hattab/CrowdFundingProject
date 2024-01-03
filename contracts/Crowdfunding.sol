// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import './Project.sol';

contract Crowdfunding{

// [X] Anyone can start a funding project .
// [X] Get All project list
// [X]  contribute amount

event ProjectStarted(
    address projectContractAddress ,
    address creator,
    uint256 minContribution,
    uint256 projectDeadline,
    uint256 goalAmount,
    uint256 currentAmount,
    uint256 noOfContributors,
    string title,
    string desc,
    uint256 currentState,
    string imageHash
);

event ContributionReceived(
   address projectAddress,
   uint256 contributedAmount,
   address indexed contributor
);

 Project[] private projects;
 mapping(address=>bool) isRegister;
  // @dev Anyone can start a fund rising
 // @return null

 function createProject(
    uint256 minimumContribution,
    uint256 deadline,
    uint256 targetContribution,
    string memory projectTitle,
    string memory projectDesc,
    string memory imageHash
 ) public {

   deadline = deadline;
  require(block.timestamp<deadline,'State of this project is expired!');
  require(!isRegister[msg.sender],'You have a Project here!');

   Project newProject = new Project(msg.sender,minimumContribution,deadline,targetContribution,projectTitle,projectDesc,imageHash);
   projects.push(newProject);
   isRegister[msg.sender]=true;
 emit ProjectStarted(
    address(newProject) ,
    msg.sender,
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

 }

 // @dev Get projects list
// @return array

function returnAllProjects() external view returns(Project[] memory){
   return projects;
}

// @dev User can contribute
// @return null

function contribute(address _projectAddress) public payable{

   uint256 minContributionAmount = Project(_projectAddress).minimumContribution();
   Project.State projectState = Project(_projectAddress).state();
   require(projectState == Project.State.Fundraising,'Invalid state');
   require(msg.value >= minContributionAmount,'Contribution amount is too low !');
   // Call function
   Project(_projectAddress).contribute{value:msg.value}(msg.sender);
   // Trigger event 
   emit ContributionReceived(_projectAddress,msg.value,msg.sender);
}

}

