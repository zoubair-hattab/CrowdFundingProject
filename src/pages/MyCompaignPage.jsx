import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Compaign from '../components/compaign/Compaign';
import { useSelector } from 'react-redux';

const MyCompaignPage = () => {
  const projectsList = useSelector((state) => state.projectReducer.projects);
  const account = useSelector((state) => state.web3Reducer.account);

  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    const myCompaign = projectsList?.filter(
      (compaign) => compaign.creator === account
    );
    setProjectsData(myCompaign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsList]);
  return (
    <div>
      <NavBar />

      <div className="container py-24">
        <div className="grid gap-7 md:gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {projectsData?.map((item) => (
            <Compaign data={item} key={item.address} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCompaignPage;
