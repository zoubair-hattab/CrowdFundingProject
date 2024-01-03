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
describe('Project', () => {
  async function deployProjectFixture() {
    const [address1, address2] = await ethers.getSigners();
    const creator = address1.address;
    const minimumContribution = etherToWei('1');
    const deadline = dateToUNIX('2024-02-02');
    const targetContribution = etherToWei('10');
    const projectTitle = 'Testing project';
    const projectDes = 'Testing project description';
    const Project = await ethers.getContractFactory('Project');
    const imageHash = 'www.imgae.com';

    const projectContract = await Project.deploy(
      creator,
      minimumContribution,
      deadline,
      targetContribution,
      projectTitle,
      projectDes,
      imageHash
    );

    return { projectContract, address1, address2 };
  }
  it('Check project variable && Contribute', async () => {
    const { projectContract, address1 } = await loadFixture(
      deployProjectFixture
    );
    expect(await projectContract.creator()).to.equal(address1.address);
    expect(await projectContract.minimumContribution()).to.equal(
      etherToWei('1')
    );
    expect(Number(await projectContract.deadline())).to.greaterThan(0);
    expect(await projectContract.targetContribution()).to.equal(
      etherToWei('10')
    );
    expect(await projectContract.projectTitle()).to.equal('Testing project');
    expect(await projectContract.projectDes()).to.equal(
      'Testing project description'
    );
    expect(await projectContract.state()).to.equal(+0);
    expect(await projectContract.noOfContributers()).to.equal(0);
  });
  it('Contribute', async () => {
    const { projectContract, address1 } = await loadFixture(
      deployProjectFixture
    );
    await expect(
      projectContract.contribute(address1.address, {
        value: etherToWei('4'),
      })
    )
      .to.emit(projectContract, 'FundingReceived')
      .withArgs(address1.address, etherToWei('4'), etherToWei('4'));
    expect(await projectContract.noOfContributers()).to.equal(1);
    expect(await projectContract.getContractBalance()).to.equal(
      etherToWei('4')
    );
  });
  it('fail if contribution amount less than the minimumContribution', async () => {
    const { projectContract, address1 } = await loadFixture(
      deployProjectFixture
    );
    await expect(
      projectContract
        .connect(address1)
        .contribute(address1.address, { value: etherToWei('0.5') })
    ).to.be.revertedWith('Contribution amount is too low !');
  });
  it('State change when the raiseAmount hit to targetContribution', async () => {
    const { projectContract, address1 } = await loadFixture(
      deployProjectFixture
    );

    await projectContract.contribute(address1.address, {
      value: etherToWei('10'),
    });
    expect(Number(await projectContract.completeAt())).to.greaterThan(0);
    expect(await projectContract.state()).to.equal(+2);
  });

  it('Should fail if someone else try to request (Only owner can make request)', async () => {
    const { projectContract, address2 } = await loadFixture(
      deployProjectFixture
    );
    await expect(
      projectContract
        .connect(address2)
        .createWithdrawRequest(
          'Testing description',
          etherToWei('2'),
          address2.address
        )
    ).to.be.revertedWith('You dont have access to perform this operation !');
  });

  it('Withdraw request Should fail if status not equal to Successful', async () => {
    const { projectContract, address1 } = await loadFixture(
      deployProjectFixture
    );
    await expect(
      projectContract
        .connect(address1)
        .createWithdrawRequest(
          'Testing description',
          etherToWei('2'),
          address1.address
        )
    ).to.be.revertedWith('Invalid state');
  });

  it('Request for withdraw', async () => {
    const { projectContract, address1 } = await loadFixture(
      deployProjectFixture
    );
    await projectContract.contribute(address1.address, {
      value: etherToWei('10'),
    });
    await expect(
      projectContract
        .connect(address1)
        .createWithdrawRequest(
          'Testing description',
          etherToWei('2'),
          address1.address
        )
    )
      .to.emit(projectContract, 'WithdrawRequestCreated')
      .withArgs(
        1,
        'Testing description',
        etherToWei('2'),
        0,
        false,
        address1.address
      );
  });
  it('Only contributor can vote', async () => {
    const { projectContract, address1, address2 } = await loadFixture(
      deployProjectFixture
    );
    await projectContract.contribute(address1.address, {
      value: etherToWei('10'),
    });
    await projectContract
      .connect(address1)
      .createWithdrawRequest(
        'Testing description',
        etherToWei('2'),
        address1.address
      );
    await expect(
      projectContract.connect(address2).voteWithdrawRequest(0)
    ).to.be.revertedWith('Only contributor can vote !');
  });

  it('Vote withdraw request', async () => {
    const { projectContract, address1, address2 } = await loadFixture(
      deployProjectFixture
    );
    await projectContract.contribute(address1.address, {
      value: etherToWei('6'),
    });
    await projectContract.contribute(address2.address, {
      value: etherToWei('4'),
    });

    await projectContract
      .connect(address1)
      .createWithdrawRequest(
        'Testing description',
        etherToWei('2'),
        address1.address
      );
    await expect(projectContract.connect(address2).voteWithdrawRequest(0))
      .to.emit(projectContract, 'WithdrawVote')
      .withArgs(address2.address, 1);
  });

  it('Should fail if request already vote', async () => {
    const { projectContract, address1, address2 } = await loadFixture(
      deployProjectFixture
    );
    await projectContract.contribute(address1.address, {
      value: etherToWei('6'),
    });
    await projectContract.contribute(address2.address, {
      value: etherToWei('4'),
    });

    await projectContract
      .connect(address1)
      .createWithdrawRequest(
        'Testing description',
        etherToWei('2'),
        address1.address
      );
    await projectContract.connect(address2).voteWithdrawRequest(0);

    await expect(
      projectContract.connect(address2).voteWithdrawRequest(0)
    ).to.be.revertedWith('You already voted !');
  });

  it('Should fail if 50% contributor need to voted', async () => {
    const { projectContract, address1, address2 } = await loadFixture(
      deployProjectFixture
    );
    await projectContract.contribute(address1.address, {
      value: etherToWei('6'),
    });
    await projectContract.contribute(address2.address, {
      value: etherToWei('4'),
    });

    await projectContract
      .connect(address1)
      .createWithdrawRequest(
        'Testing description',
        etherToWei('2'),
        address1.address
      );

    await expect(
      projectContract.connect(address1).withdrawRequestedAmount(0)
    ).to.be.revertedWith(
      'At least 50% contributor need to vote for this request'
    );
  });

  it('Withdraw requested balance', async () => {
    const { projectContract, address1, address2 } = await loadFixture(
      deployProjectFixture
    );
    await projectContract.contribute(address1.address, {
      value: etherToWei('6'),
    });
    await projectContract.contribute(address2.address, {
      value: etherToWei('4'),
    });

    await projectContract
      .connect(address1)
      .createWithdrawRequest(
        'Testing description',
        etherToWei('2'),
        address1.address
      );
    await projectContract.connect(address1).voteWithdrawRequest(0);
    await projectContract.connect(address2).voteWithdrawRequest(0);

    await expect(projectContract.connect(address1).withdrawRequestedAmount(0))
      .to.emit(projectContract, 'AmountWithdrawSuccessful')
      .withArgs(
        0,
        'Testing description',
        etherToWei('2'),
        2,
        true,
        address1.address
      );
  });

  it('Should fail if request already completed', async () => {
    const { projectContract, address1, address2 } = await loadFixture(
      deployProjectFixture
    );
    await projectContract.contribute(address1.address, {
      value: etherToWei('6'),
    });
    await projectContract.contribute(address2.address, {
      value: etherToWei('4'),
    });

    await projectContract
      .connect(address1)
      .createWithdrawRequest(
        'Testing description',
        etherToWei('2'),
        address1.address
      );
    await projectContract.connect(address1).voteWithdrawRequest(0);
    await projectContract.connect(address2).voteWithdrawRequest(0);
    await projectContract.connect(address1).withdrawRequestedAmount(0);

    await expect(
      projectContract.connect(address1).withdrawRequestedAmount(0)
    ).to.be.revertedWith('Request already completed');
  });
});
