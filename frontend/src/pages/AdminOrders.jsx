import React, { useEffect, useState } from "react";
import orderApi from "../api/orderApi";
import AdminOrderCard from "../components/admin/orders/AdminOrderCard";
import AdminOrderEditModal from "../components/admin/orders/AdminOrderEditModal";
import "../styles/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    pickupDate: "",
    status: true,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderApi.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this order?");

    if (!confirmDelete) {
      return;
    }

    try {
      await orderApi.deleteOrder(id);
      alert("Order Deleted");
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to delete");
    }
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setFormData({
      pickupDate: order.pickupDate?.slice(0, 16),
      status: order.status,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...editingOrder,
        pickupDate: formData.pickupDate,
        status: formData.status,
      };

      await orderApi.updateOrder(editingOrder.id, payload);
      alert("Order Updated");
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="admin-orders">
      <h1>Orders Management</h1>

      <div className="orders-grid">
        {orders.map((order) => (
          <AdminOrderCard
            key={order.id}
            order={order}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingOrder ? (
        <AdminOrderEditModal
          formData={formData}
          onChange={handleChange}
          onCancel={() => setEditingOrder(null)}
          onSave={handleUpdate}
        />
      ) : null}
    </div>
  );
};

export default AdminOrders;
