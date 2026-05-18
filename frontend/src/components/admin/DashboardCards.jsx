import React from "react";

const DashboardCards = ({
  orders,
  users,
  categories,
  cities,
}) => {

  return (

    <div className="cards-container">

      <div className="dashboard-card">
        <h3>Orders</h3>
        <p>{orders.length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Users</h3>
        <p>{users.length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Categories</h3>
        <p>{categories.length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Cities</h3>
        <p>{cities.length}</p>
      </div>

    </div>
  );
};

export default DashboardCards;