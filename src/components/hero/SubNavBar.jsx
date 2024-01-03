import React from 'react';
import { Link } from 'react-router-dom';

const SubNavBar = () => {
  const subNav = [
    { title: 'upcomming' },
    { title: 'ongoing' },
    { title: 'past' },
  ];
  return (
    <div className="shadow-md ">
      <div className="container">
        <ul className="flex  items-center justify-center gap-2 transition divide-purple-200">
          {subNav?.map((item, index) => (
            <li
              key={index}
              className="capitalize text-gray-800 text-base hover:bg-black py-4 px-2 hover:text-gray-200"
            >
              <Link to={`?type=${item.title}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubNavBar;
