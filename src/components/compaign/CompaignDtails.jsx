import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import CountDown from '../counter/CountDown';
import { amountContributor } from '../../redux/actions/web3Action';
import { toast } from 'react-toastify';
import { etherToWei } from '../../helper/helper';
import { useDispatch, useSelector } from 'react-redux';
import {
  contribute,
  createWithdrawRequest,
  getAllWithdrawRequest,
  getContributors,
} from '../../redux/inertaction';
const CompaignDtails = ({ data, setPoPup }) => {
  const [days, hours, minutes, seconds] = CountDown(data?.deadline);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);
  const crowdFundingContract = useSelector(
    (state) => state.fundingReducer.contract
  );
  const [contributors, setContributors] = useState(null);
  const [withdrawReq, setWithdrawReq] = useState(null);
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const { account } = useSelector((state) => state.web3Reducer);
  const contributeAmount = (projectId, minContribution) => {
    if (!account) {
      return toast.error(`Please Connect to your walet first !`);
    }
    if (amount < minContribution) {
      toast.error(`Minimum contribution amount is ${minContribution}`);
      return;
    }

    const contributionAmount = etherToWei(amount);

    const data = {
      contractAddress: projectId,
      amount: contributionAmount,
      account: account,
    };
    const onSuccess = async () => {
      setAmount(0);
      toast.success(`Successfully contributed ${amount} ETH`);
    };
    const onError = (message) => {
      toast.error(message);
    };
    contribute(crowdFundingContract, data, dispatch, onSuccess, onError);
  };

  const requestForWithdraw = (projectId) => {
    console.log(data?.goalAmount);
    const contributionAmount = etherToWei(data?.goalAmount);
    const datas = {
      description: `${data?.goalAmount} ETH requested for withdraw`,
      amount: contributionAmount,
      recipient: account,
      account: account,
    };
    const onSuccess = (datas) => {
      toast.success(
        `Successfully requested for withdraw ${data?.goalAmount} ETH`
      );
    };
    const onError = (message) => {
      toast.error(message);
    };
    createWithdrawRequest(web3, projectId, datas, onSuccess, onError);
  };

  useEffect(() => {
    const onSuccess = (data) => {
      setContributors(data);
    };
    const onError = (error) => {
      console.log(error);
    };

    getContributors(web3, data?.address, onSuccess, onError);

    const loadWithdrawRequests = (data) => {
      setWithdrawReq(data);
    };
    getAllWithdrawRequest(web3, data?.address, loadWithdrawRequests);
  }, [data?.address]);
  console.log(withdrawReq);
  return (
    <div className="bg-white">
      <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
        <div className="w-[90%] md:w-[60%] h-[90vh] overflow-y-scroll md:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
          <IoMdClose
            size={30}
            className="absolute right-3 top-3 z-50"
            onClick={() => setPoPup(false)}
          />
          <div className="lg:flex items-center lg:gap-8 ">
            <div className="w-full lg:w-[45%]">
              <img src={data?.image} alt="" className="w-full " />
            </div>
            <div className="w-full lg:w-[50%] space-y-2">
              <h2 className="text-2xl font-bold text-blue-600">
                {data?.title}
              </h2>
              <p className="text-sm leading-6 text-gray-600 md:text-lg">
                {data?.description}
              </p>
              <table className="w-full">
                <tbody>
                  <tr className="border  border-gray-200">
                    <th className="bg-gray-50 border border-gray-200 text-left py-2 px-2   text-sm tracking-wide ">
                      Target Amount
                    </th>
                    <td className="text-sm text-blue-600 text-center">
                      {data?.goalAmount} ETH
                    </td>
                  </tr>
                  <tr className="border  border-gray-200">
                    <th className="bg-gray-50 border border-gray-200 text-left py-2 px-2">
                      Minimum Contribution
                    </th>
                    <td className="text-sm text-blue-600 text-center">
                      {data?.minContribution} ETH
                    </td>
                  </tr>

                  <tr className="border  border-gray-200">
                    <th className="bg-gray-50 border border-gray-200 text-left py-2 px-2">
                      Current Amount
                    </th>
                    <td className="text-sm text-blue-600 text-center">
                      {data?.currentAmount} ETH
                    </td>
                  </tr>
                  <tr className="border  border-gray-200">
                    <th className="bg-gray-50 border border-gray-200 text-left py-2 px-2   text-sm tracking-wide">
                      Number Of Contributor
                    </th>
                    <td className="text-sm text-blue-600 text-center">
                      {contributors?.length}
                    </td>
                  </tr>
                  <tr className="border  border-gray-200">
                    <th className="bg-gray-50 border border-gray-200 text-left py-2 px-2   text-sm tracking-wide">
                      DeadLine
                    </th>
                    <td className="text-sm text-blue-600 text-center">
                      {days}d:{hours}h:{minutes}m:{seconds}s
                    </td>
                  </tr>
                </tbody>
              </table>

              {data?.state === 'Successful' && data?.creator === account ? (
                <button
                  className="w-full py-2 shadow-md px-2 text-white border bg-primary hover:bg-traaa
             hover:text-primary hover:bg-transparent hover:border-primary"
                  onClick={() => requestForWithdraw(data?.address)}
                >
                  Withdraw Request
                </button>
              ) : data?.state === 'Expired' ? (
                <button
                  className="w-full py-2 shadow-md px-2 text-white border bg-primary hover:bg-traaa
             hover:text-primary hover:bg-transparent hover:border-primary"
                  onClick={() => requestForWithdraw(data?.address)}
                >
                  Refund Amount
                </button>
              ) : data?.state === 'Fundraising' ? (
                <>
                  <div>
                    <label
                      htmlFor="contribute"
                      className="block my-1 md:text-base lg:text-lg font-bold text-gray-600"
                    >
                      Contribute
                    </label>
                    <input
                      type="text"
                      className="block w-full py-2 placeholder:text-gray-500 border focus:outline-none focus:border-primary focus:ring-0"
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                  </div>

                  <button
                    className="w-full py-2 shadow-md px-2 text-white border bg-primary hover:bg-traaa
                          hover:text-primary hover:bg-transparent hover:border-primary"
                    onClick={() =>
                      contributeAmount(data?.address, data?.minContribution)
                    }
                  >
                    Contribute
                  </button>
                </>
              ) : (
                data?.state === 'Successful' &&
                data?.creator !== account && (
                  <button
                    className="w-full py-2 shadow-md px-2 text-white border bg-primary hover:bg-traaa
                       hover:text-primary hover:bg-transparent hover:border-primary"
                    onClick={() =>
                      contributeAmount(data?.address, data?.minContribution)
                    }
                  >
                    Vote
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaignDtails;
