import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
// import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <ToastContainer /> */}
      <div className="flex-grow background-image-class">
        <Outlet />
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default MainLayout;
