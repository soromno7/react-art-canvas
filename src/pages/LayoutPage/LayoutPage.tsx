import { TbBrush } from "react-icons/tb";
import { FaRegMoon } from "react-icons/fa";
import { FaRegSun } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { GoPlus } from "react-icons/go";

import { Outlet } from "react-router-dom";
import "./layout.scss";

const LayoutPage = () => {
  return (
    <>
      <header className="header">
        <div className="create">
          <GoPlus size="30px" />
          <span className="create__text">Create</span>
        </div>
        <div className="logo">
          <TbBrush size="40px" />
          <span>ArtCanvas</span>
        </div>
        <div className="user">
          <div className="user__theme">
            <FaRegMoon size="20px" />
          </div>
          <div className="user__data">
            <div className="user__icon">
              <FaUserCircle size="40px" />
            </div>
            <span className="user__name">Jegosh Jegjajovski</span>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default LayoutPage;
