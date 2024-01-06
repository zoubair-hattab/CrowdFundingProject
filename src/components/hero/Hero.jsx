import React from 'react';
const Hero = () => {
  return (
    <div
      className="bg-cover bg-no-repeat bg-center py-24 relative mt-22"
      style={{
        backgroundImage:
          'url(https://b2b.tn/files/2023/10/Forum-du-Crowdfunding.jpg)',
      }}
    >
      <div className="container">
        <h1 className="xl:text-6xl md:text-5xl text-4xl text-gray-800 font-medium mb-4">
          Best Platform For <br className="hidden sm:block" />
          CrowdFunding
        </h1>
        <p className="text-base text-gray-600 leading-6">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa
          <br className="hidden sm:block" />
          assumenda aliquid inventore nihil laboriosam odio
        </p>

        <div className="mt-12">
          <a
            href="shop.html"
            className="bg-primary border border-primary text-white px-8 py-3 font-medium rounded-md uppercase hover:bg-transparent hover:text-primary transition"
          >
            Help us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
