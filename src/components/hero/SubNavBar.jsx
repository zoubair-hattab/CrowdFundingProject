import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const SubNavBar = ({ type }) => {
  const subNav = [
    { name: 'fundraising' },
    { name: 'successful' },
    { name: 'expired' },
  ];
  const [active, setActive] = useState(1);
  const params = useSearchParams()[0].get('type');
  console.log(params);
  return (
    <div className="shadow-md col-span-3">
      <div className="container">
        <ul
          className={`flex ${type} items-center justify-center gap-2 transition divide-purple-200`}
        >
          {subNav?.map((item, index) => (
            <li
              key={item.name}
              onClick={() => setActive(index + 1)}
              className={`py-1 rounded-md px-2 capitalize ${
                params === item.name
                  ? 'bg-black text-gray-200'
                  : params == null &&
                    index + 1 === active &&
                    'bg-black text-gray-200'
              }`}
            >
              <Link to={`?type=${item.name}`} className="block py-2">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubNavBar;
