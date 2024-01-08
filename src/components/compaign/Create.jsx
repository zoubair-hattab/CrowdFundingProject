import moment from 'moment';
import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { etherToWei } from '../../helper/helper';
import { startFundRaising } from '../../redux/inertaction';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Create = () => {
  const [comaignInfo, setCompaignInfo] = useState({});
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crowdFundingContract = useSelector(
    (state) => state.fundingReducer.contract
  );
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setCompaignInfo({
      ...comaignInfo,
      [name]: value,
    });
  };

  const startProject = async (e) => {
    e.preventDefault();
    if (
      !comaignInfo?.title ||
      !comaignInfo?.description ||
      !comaignInfo?.minprice ||
      !comaignInfo?.price ||
      !comaignInfo?.deadline ||
      !file
    ) {
      return toast.error('Please fill in the fields.');
    }
    if (comaignInfo?.description.length < 60) {
      return toast.error(
        'Please provide a description longer than 60 characters.'
      );
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: ' 840b37c1b53ca87c08f0',
          pinata_secret_api_key:
            '7b9ec6401fac3f416c83136ee701757506f7050fb855696491ef7435773d60e9',
        },
      }
    );

    const unixDate = moment(comaignInfo?.deadline).valueOf();

    const onSuccess = () => {
      setCompaignInfo({});
      toast.success('Fund rising started 🎉');
      navigate('/');
      window.location.reload();
    };
    const onError = (error) => {
      toast.error(error);
    };
    const data = {
      minimumContribution: etherToWei(comaignInfo?.minprice),
      deadline: Math.floor(unixDate / 1000),
      targetContribution: etherToWei(comaignInfo?.price),
      projectTitle: comaignInfo?.title,
      projectDesc: comaignInfo?.description,
      account: account,
      image: `https://gateway.pinata.cloud/ipfs/${response?.data.IpfsHash}`,
    };
    startFundRaising(
      web3,
      crowdFundingContract,
      data,
      onSuccess,
      onError,
      dispatch
    );
  };
  return (
    <div className="container py-28 flex items-center justify-center">
      <div className="shadow-md py-4 px-2 max-w-lg w-full bg-gray-50">
        <form onSubmit={startProject}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm text-gray-600 capitalize mb-1"
              >
                title
                <span className="text-primary text-sm font-medium">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title compaign here...."
                className="block w-full py-2 px-3 placeholder:text-gray-300 border border-gray-200 focus:outline-none focus:ring-0 focus:border-primary rounded-md"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm text-gray-600 capitalize mb-1"
              >
                description
                <span className="text-primary text-sm font-medium">*</span>
              </label>
              <textarea
                type="text"
                id="description"
                name="description"
                placeholder="Description compaign here...."
                className="block w-full py-2 px-3 placeholder:text-gray-300 resize-none h-32 border border-gray-200 focus:outline-none focus:ring-0 focus:border-primary rounded-md"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm text-gray-600 capitalize mb-1"
              >
                Target Amount
                <span className="text-primary text-sm font-medium">*</span>
              </label>
              <input
                type="text"
                id="price"
                name="price"
                placeholder="Price compaign here...."
                className="block w-full py-2 px-3 placeholder:text-gray-300 border border-gray-200 focus:outline-none focus:ring-0 focus:border-primary rounded-md"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label
                htmlFor="minprice"
                className="block text-sm text-gray-600 capitalize mb-1"
              >
                Minimum Amount
                <span className="text-primary text-sm font-medium">*</span>
              </label>
              <input
                type="text"
                id="minprice"
                name="minprice"
                placeholder="Price compaign here...."
                className="block w-full py-2 px-3 placeholder:text-gray-300 border border-gray-200 focus:outline-none focus:ring-0 focus:border-primary rounded-md"
                onChange={handleChangeInput}
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="block text-sm text-gray-600 capitalize mb-1"
              >
                DeadLine
                <span className="text-primary text-sm font-medium">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                placeholder="deadline compaign here...."
                className="block w-full py-2 px-3 placeholder:text-gray-300 border border-gray-200 focus:outline-none focus:ring-0 focus:border-primary rounded-md"
                onChange={handleChangeInput}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <label
                htmlFor="file"
                className="flex items-center gap-2 text-sm text-gray-600 capitalize mb-1"
              >
                Compaign Image
                <span className="text-primary text-sm font-medium">*</span>
                {!file && <FaCloudUploadAlt size={30} color="gray" />}
              </label>
              <input
                hidden
                type="file"
                id="file"
                name="file"
                className=""
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-16 h-16 rounded-full "
                />
              )}
            </div>
            <button className="px-1 py-2 text-base font-medium bg-primary text-white w-full shadow-md rounded-md hover:bg-white border hover:text-primary hover:border-primary transition divide-purple-200">
              Create Compaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
