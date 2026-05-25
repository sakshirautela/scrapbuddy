import React from "react";
import AddressesTable from "./AddressesTable";
import AdminOverview from "./dashboard/AdminOverview";
import CategoriesManager from "./CategoriesManager";
import CitiesManager from "./CitiesManager";
import OrdersTable from "./OrdersTable";
import { menuItems } from "../../utils/adminDashboard";

const AdminDashboardContent = ({
  activeTab,
  loading,
  error,
  categoriesProps,
  ordersProps,
  citiesProps,
  addresses,
  admins,
  categories,
  cities,
  onSelectTab,
}) => {
  if (loading) {
    return <section className="admin-card loading-card">Loading admin data...</section>;
  }

  if (error) {
    return <section className="admin-card error-card">{error}</section>;
  }

  if (activeTab === "dashboard") {
    return (
      <AdminOverview
        orders={ordersProps.orders}
        categories={categories}
        admins={admins}
        addresses={addresses}
        cities={cities}
        onManageRates={() => onSelectTab("categories")}
      />
    );
  }

  if (activeTab === "categories" || activeTab === "price-management") {
    return <CategoriesManager {...categoriesProps} />;
  }

  if (activeTab === "orders") {
    return <OrdersTable {...ordersProps} />;
  }

  if (activeTab === "cities") {
    return <CitiesManager {...citiesProps} />;
  }

  if (activeTab === "addresses") {
    return (
      <AddressesTable
        addresses={addresses}
        orders={ordersProps.orders}
        currentAdminId={ordersProps.currentAdminId}
      />
    );
  }

  return (
    <section className="admin-card empty-panel">
      <h2>{menuItems.find((item) => item.key === activeTab)?.label}</h2>
      <p>This section is ready for backend data.</p>
    </section>
  );
};

export default AdminDashboardContent;
