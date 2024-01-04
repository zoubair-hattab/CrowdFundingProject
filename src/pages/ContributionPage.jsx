/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Hero from '../components/hero/Hero';
import SubNavBar from '../components/hero/SubNavBar';
import { compaigns } from '../static/data';
import Compaign from '../components/compaign/Compaign';
import { useSelector } from 'react-redux';

const ContributionPage = () => {
  const projectsList = useSelector((state) => state.projectReducer.projects);
  const { projectContracts } = useSelector((state) => state.projectReducer);

  const account = useSelector((state) => state.web3Reducer.account);
  const [projectsData, setProjectsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = async () => {
    try {
      let value = (
        await Promise.all(
          projectContracts &&
            projectContracts?.map(async (n) => ({
              value: n,
              include: (await n?.methods.contributiors(account).call()) > 0,
            }))
        )
      )
        .filter((v) => v.include)
        .map((data) => data.value._address);
      return value;
    } catch (err) {}
  };
  useEffect(() => {
    const load = async () => {
      const value = await data();

      const myCompaign = projectsList?.filter((element) =>
        value?.includes(element.address)
      );

      setProjectsData(myCompaign);
    };
    load();
  }, [account, projectsList]);
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

export default ContributionPage;
