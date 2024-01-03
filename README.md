# Crowdfunding Project Update on Polygon Mumbai:

The present status of the project indicates that it is a work in progress, having achieved significant milestones thus far. The completion of a new campaign, coupled with the contribution step, is a noteworthy accomplishment. At this juncture, substantial improvements have been made to the front end and interactions with the smart contract.

All essential functionalities within the smart contract have been successfully implemented to meet the platform's requirements. Nevertheless, there is an ongoing effort to refine interactions with other functions. The primary areas that require attention are outlined below:

## Campaign States

The project involves three distinct states for each campaign – fundraising, successful, or expired.

## Fundraising

During the fundraising phase, contributors can actively participate, and upon reaching the target amount, the campaign transitions to a successful state.

## Successful

In the successful state, the campaign owner may initiate a withdrawal request. However, disbursement is contingent upon obtaining approval from contributors, who must vote on the request. If more than 50% of contributors endorse the withdrawal, the owner gains access to the funds; otherwise, access is denied.

## Expired

If a campaign fails to achieve its target amount by the deadline, the project state becomes expired. In such instances, contributors are entitled to withdraw their contributions.

## More Details

The platform is adeptly designed to manage these steps seamlessly. Furthermore, rigorous unit testing has been conducted on the smart contract using the latest versions of Chai and Hardhat. For real-time updates, please monitor the project repository diligently.

Presently, users can create campaigns and contribute, with additional features in the pipeline for swift implementation. To conduct tests, it is recommended to install the MetaMask extension on your browser. Alternatively, for local testing, download the provided code version and follow these steps:

## How to use locally

1.  npm install : to install all packages.
2.  npx hardhat node : to start the local Hardhat node.
3.  npx hardhat test : to perform smart contract testing.

Stay tuned for further developments and enhancements to the project.

# zoubair Hattab :))
