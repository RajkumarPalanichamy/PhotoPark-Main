import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";

const StyledNavLink = ({ to, children, className }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 ${
        isActive ? "text-gray-900 font-semibold" : "text-gray-700"
      } ${className || ""}`
    }
  >
    {children}
    <div className="h-[2px] w-0 bg-gray-900 transition-all duration-300 group-hover:w-full" />
  </NavLink>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileDropdownVisible, setMobileDropdownVisible] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const navRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const loadAuthFromLocalStorage = () => {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(user);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "admin");
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    loadAuthFromLocalStorage();
    window.addEventListener("storage", loadAuthFromLocalStorage);
    return () =>
      window.removeEventListener("storage", loadAuthFromLocalStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setProfileDropdown(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
    setProfileDropdown(false);
  };

  return (
    <nav className="py-5 px-4 md:px-6 z-10 font-medium relative" ref={navRef}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-gray-900 tracking-wide uppercase">
            PHOTO PARKK
          </span>
          <span className="text-[14px] font-medium text-center text-gray-500 tracking-wider uppercase">
            (since 1986)
          </span>
        </div>

        <ul className="hidden sm:flex gap-5 text-sm">
          <li className="group">
            <StyledNavLink to="/">HOME</StyledNavLink>
          </li>
          <li
            className="group relative"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900">
              <span>SHOP</span>
              <ChevronDown size={14} />
            </div>
            {dropdownVisible && (
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 w-48 bg-white shadow-md rounded-md z-50 py-1 border">
                <NavLink
                  to="/shop/acrylic"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Acrylic
                </NavLink>
                <NavLink
                  to="/shop/canvas"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Canvas
                </NavLink>
                <NavLink
                  to="/shop/backlight-frames"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Backlight Photo Frames
                </NavLink>
              </div>
            )}
          </li>
          <li className="group">
            <StyledNavLink to="/frames">FRAMES</StyledNavLink>
          </li>
          <li className="group">
            <StyledNavLink to="/customize">CUSTOMIZE</StyledNavLink>
          </li>
          <li className="group">
            <StyledNavLink to="/about">ABOUT</StyledNavLink>
          </li>
          <li className="group">
            <StyledNavLink to="/contact">CONTACT</StyledNavLink>
          </li>

          {isAdmin && (
            <li className="group">
              <StyledNavLink to="/adminpanel">ADMIN PANEL</StyledNavLink>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-6">
          <Search size={20} strokeWidth={1.5} className="text-gray-800" />
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileDropdown(!profileDropdown)}>
              <User size={20} strokeWidth={1.5} className="text-gray-800" />
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border z-50 py-1">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                    <NavLink
                      to="/my-orders"
                      onClick={() => setProfileDropdown(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </NavLink>
                    {isAdmin && (
                      <NavLink
                        to="/adminpanel"
                        onClick={() => setProfileDropdown(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        ADMIN PANEL
                      </NavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setProfileDropdown(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            )}
          </div>
          <NavLink to="/cart" className="relative">
            <ShoppingCart
              size={20}
              strokeWidth={1.5}
              className="text-gray-800"
            />
            <span className="absolute -right-1.5 -bottom-1.5 w-4 h-4 flex items-center justify-center bg-gray-900 text-white text-[10px] rounded-full">
              12
            </span>
          </NavLink>
          <button onClick={() => setMobileMenuOpen(true)} className="sm:hidden">
            <Menu size={20} strokeWidth={1.5} className="text-gray-800" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Menu</h3>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="py-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 border-b"
          >
            HOME
          </NavLink>
          <button
            onClick={() => setMobileDropdownVisible(!mobileDropdownVisible)}
            className="w-full text-left px-4 py-2 border-b flex justify-between items-center"
          >
            <span>SHOP</span>
            <ChevronDown
              size={16}
              className={`${mobileDropdownVisible ? "rotate-180" : ""}`}
            />
          </button>
          {mobileDropdownVisible && (
            <div className="pl-6 bg-gray-50">
              <NavLink
                to="/shop/acrylic"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2"
              >
                Acrylic
              </NavLink>
              <NavLink
                to="/shop/canvas"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2"
              >
                Canvas
              </NavLink>
              <NavLink
                to="/shop/backlight-frames"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2"
              >
                Backlight
              </NavLink>
            </div>
          )}
          <NavLink
            to="/frames"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 border-b"
          >
            FRAMES
          </NavLink>
          <NavLink
            to="/customize"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 border-b"
          >
            CUSTOMIZE
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 border-b"
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 border-b"
          >
            CONTACT
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/adminpanel"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 border-b"
            >
              ADMIN PANEL
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
