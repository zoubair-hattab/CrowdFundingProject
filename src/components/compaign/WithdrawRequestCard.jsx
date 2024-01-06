import React from 'react';
import { toast } from 'react-toastify';
import { voteWithdrawRequest } from '../../redux/inertaction';
import { useSelector } from 'react-redux';

const WithdrawRequestCard = ({
  props,
  withdrawReq,
  setWithdrawReq,
  contractAddress,
}) => {
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const { account } = useSelector((state) => state.web3Reducer);
  const vote = (reqId) => {
    var data = {
      contractAddress: contractAddress,
      reqId: reqId,
      account: account,
    };
    const onSuccess = () => {
      const filteredReq = withdrawReq.filter(
        (data) => data.requestId === props.requestId
      );
      var filteredVal = filteredReq[0];
      filteredVal.totalVote = Number(filteredVal.totalVote) + 1;
      setWithdrawReq([...withdrawReq, filteredVal]);
      toast.success(`Vote successfully added for request id ${reqId}`);
    };

    voteWithdrawRequest(web3, data, onSuccess);
  };
  return (
    <div className="bg-gray-50 w-full shadow-md rounded-md py-2 ">
      <h2 className="text-lg font-medium text-blue-600">
        The owner of this project requested to withdraw the capital.
      </h2>
      {withdrawReq?.map((item) => (
        <div className="sapce-y-2">
          <p className="text-lg capitalize">
            description :<span className="text-blue-600">{props?.desc}</span>
          </p>
          <p className="text-lg capitalize">
            Resquest Id :
            <span className="text-blue-600">{props?.requestId}</span>
          </p>
          <p className="text-lg capitalize">
            amount :<span className="text-blue-600">{props?.amount}</span>
          </p>
        </div>
      ))}
      <button
        className="w-full py-2 shadow-md px-2 text-white border bg-primary hover:bg-traaa
           hover:text-primary hover:bg-transparent hover:border-primary"
        onClick={() => vote(props.requestId)}
      >
        Vote
      </button>
    </div>
  );
};

export default WithdrawRequestCard;
