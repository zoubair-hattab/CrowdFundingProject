import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  HomePage,
  CreatePage,
  ContributionPage,
  MyCompaignPage,
} from './routes/route.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addNeworkListener,
  addWalletListener,
  currentWalletConnected,
  switchNework,
} from './helper/helper.js';
import { getAllFunding } from './redux/inertaction.js';
function App() {
  const dispatch = useDispatch();
  const { network, connection } = useSelector((state) => state.web3Reducer);
  useEffect(() => {
    const loadBlockchain = async () => {
      const { provider, contract } = await currentWalletConnected(dispatch);
      await addWalletListener(dispatch);
      await addNeworkListener(dispatch);
      await getAllFunding(contract, provider, dispatch);
    };
    loadBlockchain();
  }, [dispatch]);
  return (
    <BrowserRouter>
      {connection && network !== 80001 && (
        <p className="w-full bg-primary text-center py-2 font-medium text-white fixed top-[80px] left-0 z-50">
          Please Switch network
          <span
            className="text-blue-600 cursor-pointer font-bold text-lg"
            onClick={() => switchNework()}
          >
            Click
          </span>
        </p>
      )}
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="my_compaigns" element={<MyCompaignPage />} />
          <Route path="my_contribution" element={<ContributionPage />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
