import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Hero from '../components/hero/Hero';
import SubNavBar from '../components/hero/SubNavBar';
import { compaigns } from '../static/data';
import Compaign from '../components/compaign/Compaign';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const projectsList = useSelector((state) => state.projectReducer.projects);

  const [projectsData, setProjectsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  useEffect(() => {
    setProjectsData(projectsList);
  }, [projectsList]);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = projectsData?.slice(firstPostIndex, lastPostIndex);
  return (
    <div>
      <NavBar />
      <Hero />
      <SubNavBar />
      <div className="container py-8">
        <div className="grid gap-7 md:gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {currentPosts?.map((item, index) => (
            <Compaign data={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
