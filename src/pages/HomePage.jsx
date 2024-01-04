import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Hero from '../components/hero/Hero';
import SubNavBar from '../components/hero/SubNavBar';
import Compaign from '../components/compaign/Compaign';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import animation from '../assests/waiting.json';
import Lottie from 'react-lottie-player';

const HomePage = () => {
  const projectsList = useSelector((state) => state.projectReducer.projects);
  const params = useSearchParams()[0].get('type');

  const [projectsData, setProjectsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  useEffect(() => {
    if (params === 'fundraising' || params == null) {
      const myCompaign = projectsList?.filter(
        (compaign) => compaign?.state?.toLowerCase() === 'fundraising'
      );
      setProjectsData(myCompaign);
    } else {
      const myCompaign = projectsList?.filter(
        (compaign) => compaign?.state?.toLowerCase() === params
      );
      setProjectsData(myCompaign);
    }
  }, [params, projectsList]);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = projectsData?.slice(firstPostIndex, lastPostIndex);
  return (
    <div>
      <NavBar />
      <Hero />
      <SubNavBar type="flex-row" />
      <div className="container py-8">
        {!projectsData || projectsData.length === 0 ? (
          <div className="flex items-center justify-center w-full ">
            <Lottie
              loop
              animationData={animation}
              play
              speed={0.8}
              style={{ width: 300, height: 300 }}
            />
          </div>
        ) : (
          <div className="grid gap-7 md:gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {projectsData?.map((item, index) => (
              <Compaign data={item} key={item.address} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
