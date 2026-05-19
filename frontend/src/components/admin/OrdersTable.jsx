import React from "react";
import { formatDateTime, formatValue, getAddressSummary, getCategoryName } from "../../utils/adminDashboard";

const OrdersTable = ({ orders, categories }) => {
  const getOrderCategoryPath = (order) => {
    const category = categories.find((item) => String(item.id) === String(order.categoryID));
    const subCategory = category?.subCategories?.find(
      (item) => String(item.id) === String(order.subCategoryID)
    );
    const categoryName = category ? getCategoryName(category) : `Category ${formatValue(order.categoryID)}`;
    const subCategoryName = subCategory?.subCategory || `Subcategory ${formatValue(order.subCategoryID)}`;
    const price = subCategory?.price ? ` - Rs ${subCategory.price}/kg` : "";

    if (!order.categoryID && !order.subCategoryID) {
      return "-";
    }

    if (!order.subCategoryID) {
      return categoryName;
    }

    return `${categoryName} -> ${subCategoryName}${price}`;
  };

  return (
    <section className="admin-card table-card">
      <h2>Orders</h2>
      <div className="admin-table-wrap">
        <table className="admin-table orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Pickup Date</th>
              <th>Category -> Subcategory</th>
              <th>Full Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5">No Orders Found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{formatValue(order.id)}</td>
                  <td><span className="active-pill">{order.status ? "Completed" : "Scheduled"}</span></td>
                  <td>{formatDateTime(order.pickupDate)}</td>
                  <td>{getOrderCategoryPath(order)}</td>
                  <td>{getAddressSummary(order.address || {})}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrdersTable;
