import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdCategory,
  MdProductionQuantityLimits,
  MdMenu,
  MdClose,
  MdLocalOffer,
  MdShoppingCart
} from "react-icons/md";
import "./AdminSidebar.scss";

function AdminSidebar({ onToggle }) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Notify parent when sidebar state changes
  useEffect(() => {
    if (onToggle) {
      onToggle(!open, mobileOpen);
    }
  }, [open, mobileOpen, onToggle]);

  const menuItems = [
    {
      icon: <MdDashboard />,
      title: "Dashboard",
      path: "/admin/dashboard"
    },
    {
      icon: <MdProductionQuantityLimits />,
      title: "List Products",
      path: "/admin/products"
    },
    {
      icon: <MdShoppingCart />,
      title: "Manage Orders",
      path: "/admin/orders"
    },
    {
      icon: <MdCategory />,
      title: "Categories",
      path: "/admin/categories"
    },
    {
      icon: <MdInventory />,
      title: "Inventories",
      path: "/admin/inventories"
    },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button - Only show on mobile when sidebar is closed */}
      {isMobile && !mobileOpen && (
        <button
          className="admin-sidebar-mobile-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <MdMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar-container ${open ? "" : "admin-sidebar-container--collapsed"} ${mobileOpen ? "admin-sidebar-container--mobile-open" : ""}`}>
        {/* Logo/Toggle Area */}
        <div className="admin-sidebar-container__header">
          {open || mobileOpen ? (
            <div className="admin-sidebar-container__logo-area">
              <h2 className="admin-sidebar-container__logo-text">Admin Panel</h2>
              <button
                className="admin-sidebar-container__toggle-btn"
                onClick={toggleSidebar}
                title={isMobile ? "Close menu" : "Collapse sidebar"}
              >
                <MdClose />
              </button>
            </div>
          ) : (
            <button
              className="admin-sidebar-container__toggle-btn admin-sidebar-container__toggle-btn--collapsed"
              onClick={() => setOpen(true)}
              title="Expand sidebar"
            >
              <MdMenu />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <ul className="admin-sidebar-container__menu">
          {menuItems.map((item, index) => (
            <li key={index} onClick={closeMobileSidebar} className="admin-sidebar-container__menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "admin-sidebar-container__menu-link admin-sidebar-container__menu-link--active" : "admin-sidebar-container__menu-link"
                }
              >
                <span className="admin-sidebar-container__menu-icon">{item.icon}</span>
                {(open || mobileOpen) && <span className="admin-sidebar-container__menu-title">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {isMobile && mobileOpen && (
        <div
          className="admin-sidebar-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

export default AdminSidebar;