import React, { useState } from "react";
import "./AdminLayout.scss";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

function AdminLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSidebarToggle = (collapsed, mobileOpen) => {
    setIsSidebarCollapsed(collapsed);
    setIsMobileOpen(mobileOpen);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar onToggle={handleSidebarToggle} />
      <div
        className={`admin-content ${isSidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
          } ${isMobileOpen ? "mobile-open" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;