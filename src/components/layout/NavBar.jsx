import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assests/logo.jpg';
import wallet from '../../assests/wallet.png';
import { HiTemplate } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import { FaSitemap } from 'react-icons/fa6';
import { IoMdLogOut } from 'react-icons/io';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet } from '../../helper/helper';
import { walletAddressLoaded } from '../../redux/actions/web3Action';
const NavBar = () => {
  const NavLink = [
    { title: 'Home', url: '/' },
    { title: 'Services', url: '/services' },
    { title: 'About', url: '/about' },
    { title: 'Contact', url: '/contact' },
  ];
  const [menu, setMenu] = useState(false);
  const [nav, setNav] = useState(false);
  const dispatch = useDispatch();
  const { account } = useSelector((state) => state.web3Reducer);
  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-20">
        <div className="container py-5">
          <nav className="flex items-center justify-between ">
            <div>
              <Link to="/">
                <img src={logo} alt="" className="object-contain h-8" />
              </Link>
            </div>
            <div className="hidden items-center space-x-6 text-lg capitalize md:flex">
              {NavLink?.map((item, index) => (
                <Link
                  to={item.url}
                  key={index}
                  className="text-gray-800 hover:text-gray-400 transition duration-200"
                >
                  {item.title}
                </Link>
              ))}
              <div className="relative">
                {account ? (
                  <p
                    className="text-gray-600 text-base font-bold"
                    onClick={() => setMenu(!menu)}
                  >
                    Connected
                  </p>
                ) : (
                  <img
                    src={wallet}
                    alt="wallet"
                    className="h-8 object-contain"
                    onClick={() => connectWallet(dispatch)}
                  />
                )}
                {menu && (
                  <ul className="absolute top-[48px] bg-white space-y-1 right-0 shadow-md py-2  w-[185px] z-50">
                    <li
                      className="text-sm capitalize text-gray-600 px-4 py-2   hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link className="flex items-center py-2 gap-1">
                        <IoMdWallet size={22} />
                        <span
                          className="text-primary font-medium"
                          title={account && account}
                        >
                          {account?.slice(0, 10) + ' ...'}
                        </span>
                      </Link>
                    </li>
                    <li
                      className="text-sm capitalize text-gray-600 px-4 py-2  hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link
                        to="/create"
                        className="flex items-center py-2  gap-1"
                      >
                        <HiTemplate size={22} />
                        Create Compaign
                      </Link>
                    </li>
                    <li
                      className="text-sm capitalize text-gray-600 px-4 py-2 hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link
                        to="/my_compaigns"
                        className="flex items-center py-2 gap-1"
                      >
                        <FaSitemap size={22} />
                        My Compaigns
                      </Link>
                    </li>
                    <li
                      className="text-sm capitalize text-gray-600 px-4  hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link
                        to="/my_contribution"
                        className="flex items-center py-2 gap-1"
                      >
                        <FaSitemap size={22} />
                        Contribution
                      </Link>
                    </li>
                    <li
                      className="text-sm capitalize text-gray-600 px-4  hover:bg-slate-100 hover:px-6 transition duration-200  "
                      onClick={() =>
                        dispatch(walletAddressLoaded(null)) && setMenu(false)
                      }
                    >
                      <Link className="flex items-center py-2 gap-1">
                        <IoMdLogOut size={22} />
                        Disconnect
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {nav ? (
              <IoMdClose
                size={30}
                className="md:hidden"
                onClick={() => setNav(false)}
              />
            ) : (
              <HiOutlineMenuAlt3
                size={30}
                className="md:hidden"
                onClick={() => setNav(true)}
              />
            )}
          </nav>
        </div>
      </header>
      {nav && (
        <div className="fixed top-[72px] overflow-auto  md:hidden left-0 w-[320px] bg-white shadow-md h-screen z-50">
          <ul className="space-y-1">
            <li className="hover:bg-slate-100 hover:px-2 transition duration-200">
              <Link className="py-2 px-4 text-gray-600 block">Home</Link>
            </li>
            <li className="hover:bg-slate-100 hover:px-2 transition duration-200">
              <Link className="py-2 px-4 text-gray-600 block">About</Link>
            </li>
            <li className="hover:bg-slate-100 hover:px-2 transition duration-200">
              <Link className="py-2 px-4 text-gray-600 block">Seriver</Link>
            </li>
            <li className="hover:bg-slate-100 hover:px-2 transition duration-200">
              <Link className="py-2 px-4 text-gray-600 block">Contact</Link>
            </li>
            <li>
              <Link className="relative py-2 px-4 text-gray-600 flex  gap-2 items-center">
                <span className="capitalize">Connect To Wallet</span>
                <img
                  src={wallet}
                  alt="wallet"
                  className="h-8 object-contain"
                  onClick={() => setMenu(!menu)}
                />
                {menu && (
                  <ul className="absolute top-full  space-y-1 left-0 px-5 py-2 w-full z-50">
                    <li
                      className="text-sm capitalize text-gray-600 px-4   hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link className="flex items-center py-2 gap-1">
                        <IoMdWallet size={22} />
                        0x00000000000
                      </Link>
                    </li>
                    <li
                      className="text-sm capitalize text-gray-600 px-4   hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link
                        to="/create"
                        className="flex items-center py-2  gap-1"
                      >
                        <HiTemplate size={22} />
                        Create Compaign
                      </Link>
                    </li>
                    <li
                      className="text-sm capitalize text-gray-600 px-4  hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link
                        to="/my_compaigns"
                        className="flex items-center py-2 gap-1"
                      >
                        <FaSitemap size={22} />
                        My Compaigns
                      </Link>
                    </li>
                    <li
                      className="text-sm capitalize text-gray-600 px-4  hover:bg-slate-100 hover:px-6 transition duration-200"
                      onClick={() => setMenu(false)}
                    >
                      <Link
                        to="/my_contribution"
                        className="flex items-center py-2 gap-1"
                      >
                        <FaSitemap size={22} />
                        Contribution
                      </Link>
                    </li>
                    <li className="text-sm capitalize text-gray-600 px-4  hover:bg-slate-100 hover:px-6 transition duration-200  ">
                      <Link className="flex items-center py-2 gap-1">
                        <IoMdLogOut size={22} />
                        Disconnect
                      </Link>
                    </li>
                  </ul>
                )}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default NavBar;
