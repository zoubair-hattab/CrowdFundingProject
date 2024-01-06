import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import SignalItem from '../components/compaign/SignalItem.jsx';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
const SingalCompaign = () => {
  const projectsList = useSelector((state) => state.projectReducer.projects);
  const [compaign, setCompaign] = useState();
  const { id } = useParams();
  useEffect(() => {
    const result = projectsList?.find((item) => item.address === id);
    setCompaign(result);
  }, [id, projectsList]);

  return (
    <>
      <NavBar />
      <SignalItem data={compaign} key={compaign?.address} />
    </>
  );
};

export default SingalCompaign;
