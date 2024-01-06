/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import CountDown from '../counter/CountDown.jsx';
import { Link } from 'react-router-dom';
const Compaign = ({ data }) => {
  const [days, hours, minutes, seconds] = CountDown(data?.deadline);
  const colorMaker = (state) => {
    if (state === 'Fundraising') {
      return 'bg-blue-500';
    } else if (state === 'Expired') {
      return 'bg-red-500';
    } else {
      return 'bg-emerald-500';
    }
  };

  return (
    <div className="shadow-md rounded-md  hover:bg-slate-50">
      <div className="w-full h-[150px]">
        <img src={data?.image} alt="" className="w-full h-full object-fill" />
      </div>
      <div className="p-2 space-y-1">
        <div className="flex items-center justify-between">
          <h2 className=" text-lg font-medium text-blue-600">{data?.title}</h2>
          <p className={`text-white p-1 rounded-md ${colorMaker(data?.state)}`}>
            {data.state}
          </p>
        </div>
        <p className="text-gray-700 text-sm font-medium capitalize">
          description :
        </p>
        <p className="text-gray-500 text-xs leading-5">
          {data?.description.length > 80
            ? data?.description.slice(0, 80) + '...'
            : data?.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 text-sm font-medium capitalize">
              Target Amount :
            </p>
            <p className="text-primary font-bold text-sm">
              {data?.goalAmount} ETH
            </p>
          </div>
          <div>
            <p className="text-gray-700 text-sm font-medium capitalize">
              Minimum Amount :
            </p>
            <p className="text-primary font-bold text-sm">
              {data?.minContribution} ETH
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-gray-700 text-sm font-medium capitalize">
            DeadLine :
          </p>
          <p className="text-primary font-bold text-sm">
            {days + hours + minutes + seconds > 0 ? (
              <>
                {days}d:{hours}h:{minutes}m:{seconds}s
              </>
            ) : (
              'Expired'
            )}
          </p>
        </div>
      </div>

      <Link
        to={`/${data?.address}`}
        className="block py-2 text-center bg-primary  text-white font-medium w-full shadow-md border  hover:bg-transparent hover:border-primary hover:text-primary"
      >
        View Details
      </Link>
    </div>
  );
};

export default Compaign;
