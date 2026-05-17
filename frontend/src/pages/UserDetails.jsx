import React, { useEffect, useState } from "react";
import "../styles/ProfileDashboard.css";

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);

  // 🔥 Fetch orders from backend
  useEffect(() => {
    if (activeTab === "orders") {
      fetch("http://localhost:8080/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2>Profile Details</h2>
            <p>Name: John Doe</p>
            <p>Email: john@example.com</p>
          </div>
        );

      case "orders":
        return (
          <div>
            <h2>My Orders</h2>

            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <table border="1" cellPadding="10">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Pickup Date</th>
                    <th>Category</th>
                    <th>Address</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.status ? "Completed" : "Pending"}</td>
                      <td>{order.pickupDate}</td>
                      <td>{order.categoryID}</td>
                      <td>{order.addressID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "logout":
        return <h2>You have been logged out</h2>;

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidenav">
        <h3 className="logo">User</h3>

        <a onClick={() => setActiveTab("profile")}>Profile</a>
        <a onClick={() => setActiveTab("orders")}>Orders</a>
        <a onClick={() => setActiveTab("logout")}>Logout</a>
      </div>

      {/* Main */}
      <div className="main">{renderContent()}</div>
    </div>
  );
};

export default ProfileDashboard;