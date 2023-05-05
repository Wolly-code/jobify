import { Outlet, Link } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";
import { Navbar, BigSidebar, SmallSideBar } from "../../components/index";
const SharedLayout = () => {
  return (
    <Wrapper>
      <main className="dashboard">
        <SmallSideBar></SmallSideBar>
        <BigSidebar></BigSidebar>
        <div>
          <Navbar></Navbar>
          <div>
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default SharedLayout;
