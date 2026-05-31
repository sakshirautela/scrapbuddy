// @ts-nocheck
import React from "react";

const AdminOrderCard = ({ order, onEdit, onDelete }) => (
  <div className="order-card">
    <h3>Order #{order.id}</h3>

    <p>
      <strong>Status:</strong>
      {order.status ? " Active" : " Cancelled"}
    </p>

    <p>
      <strong>Pickup:</strong> {order.pickupDate}
    </p>

    <p>
      <strong>Category :</strong> {order.categoryID}
    </p>

    <p>
      <strong>SubCategory :</strong> {order.subCategoryID}
    </p>

    <div className="order-actions">
      <button className="edit-btn" type="button" onClick={() => onEdit(order)}>
        Edit
      </button>
      <button className="delete-btn" type="button" onClick={() => onDelete(order.id)}>
        Delete
      </button>
    </div>
  </div>
);

export default AdminOrderCard;
