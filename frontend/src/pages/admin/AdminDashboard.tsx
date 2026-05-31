import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardContent from "../../components/admin/AdminDashboardContent";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAdminDashboard } from "../../hooks/admin/useAdminDashboard";
import "../../styles/AdminOverviewDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    activeTab,
    addresses,
    adminInitial,
    adminName,
    admins,
    categories,
    categoriesProps,
    cities,
    citiesProps,
    error,
    fetchAdmins,
    handleLogout,
    loading,
    ordersProps,
    setActiveTab,
    setShowProfile,
    showProfile,
    user,
  } = useAdminDashboard(navigate);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div
      className={`shop-admin-layout admin-control-layout${
        isSidebarCollapsed ? " sidebar-collapsed" : ""
      }${isMobileSidebarOpen ? " mobile-sidebar-open" : ""}`}
    >
      <AdminSidebar
        activeTab={activeTab}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSelectTab={setActiveTab}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />
      {isMobileSidebarOpen ? (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      <section className="shop-main">
        <AdminTopbar
          activeTab={activeTab}
          adminInitial={adminInitial}
          adminName={adminName}
          showProfile={showProfile}
          user={user}
          onToggleMenu={() => setIsMobileSidebarOpen(true)}
          onToggleProfile={() => setShowProfile((current) => !current)}
          onOpenProfile={() => navigate("/user")}
          onLogout={handleLogout}
        />

        <main className="shop-content">
          <AdminDashboardContent
            activeTab={activeTab}
            loading={loading}
            error={error}
            categoriesProps={categoriesProps}
            ordersProps={ordersProps}
            citiesProps={citiesProps}
            addresses={addresses}
            admins={admins}
            categories={categories}
            cities={cities}
            onUsersChanged={fetchAdmins}
            onSelectTab={setActiveTab}
          />
        </main>
      </section>
    </div>
  );
};

export default AdminDashboard;
