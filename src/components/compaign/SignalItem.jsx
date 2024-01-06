/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Compaign from './Compaign';
import {
  contribute,
  createWithdrawRequest,
  getAllWithdrawRequest,
  getContributors,
  withdrawAmount,
} from '../../redux/inertaction';
import { toast } from 'react-toastify';
import { etherToWei } from '../../helper/helper';
import { useDispatch, useSelector } from 'react-redux';
import CountDown from '../counter/CountDown';
import WithdrawRequestCard from './WithdrawRequestCard';

const SignalItem = ({ data }) => {
  const [days, hours, minutes, seconds] = CountDown(data?.deadline);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);
  const crowdFundingContract = useSelector(
    (state) => state.fundingReducer.contract
  );
  const contributor = useSelector((state) => state.projectReducer.contributor);
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

    contribute(crowdFundingContract, data, dispatch, onSuccess, web3);
  };

  const requestForWithdraw = (projectId) => {
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
    if (web3 && data?.address) {
      const onError = (error) => {
        console.log(error);
      };

      getContributors(web3, data?.address, onError, dispatch);

      const loadWithdrawRequests = (data) => {
        setWithdrawReq(data);
      };
      getAllWithdrawRequest(web3, data?.address, loadWithdrawRequests);
    }
  }, [data?.address, dispatch]);

  const withdrawBalance = (reqId) => {
    var datas = {
      contractAddress: data?.address,
      reqId: reqId,
      account: account,
      amount: 0.05,
    };
    const onSuccess = () => {
      const filteredReq = withdrawReq.filter(
        (data) => data.requestId === reqId
      );
      var filteredVal = filteredReq[0];
      filteredVal.status = 'Completed';
      setWithdrawReq([...withdrawReq, filteredVal]);
      toast.success(`Vote successfully added for request id ${reqId}`);
    };

    withdrawAmount(web3, dispatch, datas, onSuccess);
  };
  return (
    <div className="container py-24">
      <div className="flex items-center justify-between flex-wrap lg:gap-4">
        <div className="w-full lg:w-3/12">
          <img
            src={data?.image}
            alt={data?.title}
            className="w-full object-cover"
          />
        </div>
        <div className="w-full lg:w-[72%] space-y-2">
          <h2 className="text-2xl font-bold text-blue-600">{data?.title}</h2>
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
                  {(contributor && contributor.length) || 0}{' '}
                </td>
              </tr>
              <tr className="border  border-gray-200">
                <th className="bg-gray-50 border border-gray-200 text-left py-2 px-2   text-sm tracking-wide">
                  DeadLine
                </th>
                <td className="text-sm text-blue-600 text-center">
                  {days + hours + minutes + seconds > 0 ? (
                    <>
                      {days}d:{hours}h:{minutes}m:{seconds}s
                    </>
                  ) : (
                    'Expired'
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {data?.state === 'Successful' && data?.creator === account ? (
            <>
              <button
                className="w-full py-2 shadow-md px-2 text-white border bg-primary hover:bg-traaa
             hover:text-primary hover:bg-transparent hover:border-primary"
                onClick={() => withdrawBalance(0)}
              >
                Withdraw
              </button>

              <button
                className="w-full py-2 shadow-md px-2 text-white border bg-primary hover:bg-traaa
hover:text-primary hover:bg-transparent hover:border-primary"
                onClick={() => requestForWithdraw(data?.address)}
              >
                Withdraw Request
              </button>
            </>
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
            data?.creator !== account &&
            withdrawReq?.length > 0 &&
            withdrawReq.map((datas) => (
              <WithdrawRequestCard
                props={datas}
                withdrawReq={withdrawReq}
                setWithdrawReq={setWithdrawReq}
                contractAddress={data?.address}
                key={data?.address}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SignalItem;
