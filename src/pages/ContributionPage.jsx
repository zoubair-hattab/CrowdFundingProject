import React from 'react';
import NavBar from '../components/layout/NavBar';
import Hero from '../components/hero/Hero';
import SubNavBar from '../components/hero/SubNavBar';
import { compaigns } from '../static/data';
import Compaign from '../components/compaign/Compaign';

const ContributionPage = () => {
  return (
    <div>
      <NavBar />

      <div className="container py-24">
        <div className="grid gap-7 md:gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {compaigns?.map((item) => (
            <Compaign data={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributionPage;
