import "./layout.scss";
import { TbBrush } from "react-icons/tb";
import { FaRegMoon } from "react-icons/fa";
import { FaRegSun } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabase/config";
import { useAuth } from "../../supabase/useAuth";

const LayoutPage = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDataRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        userDataRef.current &&
        !userDataRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header className="header">
        <div className="create" onClick={() => navigate("/paint")}>
          <GoPlus size="30px" />
          <span className="create__text">Create</span>
        </div>
        <div className="logo" onClick={() => navigate("/")}>
          <TbBrush size="40px" />
          <span>ArtCanvas</span>
        </div>
        <div className="user">
          <div className="user__theme">
            {isDarkTheme ? <FaRegSun size="20px" /> : <FaRegMoon size="20px" />}
          </div>
          <div
            className="user__data"
            ref={userDataRef}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="user__icon">
              <FaUserCircle size="40px" />
            </div>
            <span className="user__name">{user?.email}</span>
          </div>
          {isOpen && (
            <div className="user__dropdown" ref={dropdownRef}>
              <button className="dropdown__item logout" onClick={handleLogout}>
                <FiLogOut className="dropdown__icon" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default LayoutPage;
