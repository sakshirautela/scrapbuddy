import React, {
  useEffect,
  useState,
} from "react";

import orderApi
  from "../api/orderApi";

import "../../styles/AdminOrders.css";

const AdminOrders = () => {

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [editingOrder,
    setEditingOrder] =
    useState(null);

  const [formData,
    setFormData] =
    useState({

      pickupDate: "",

      status: true,

    });

  useEffect(() => {

    fetchOrders();

  }, []);

  // FETCH ORDERS
  const fetchOrders =
    async () => {

      try {

        const response =
          await orderApi.getAllOrders();

        setOrders(
          response.data
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

  // DELETE ORDER
  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this order?"
        );

      if (!confirmDelete)
        return;

      try {

        await orderApi.deleteOrder(
          id
        );

        alert(
          "Order Deleted"
        );

        fetchOrders();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to delete"
        );

      }
    };

  // EDIT CLICK
  const handleEditClick = (
    order
  ) => {

    setEditingOrder(order);

    setFormData({

      pickupDate:
        order.pickupDate
          ?.slice(0, 16),

      status:
        order.status,

    });

  };

  // INPUT CHANGE
  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;

    setFormData({

      ...formData,

      [name]:
        name === "status"
          ? value === "true"
          : value,

    });

  };

  // UPDATE ORDER
  const handleUpdate =
    async () => {

      try {

        const payload = {

          ...editingOrder,

          pickupDate:
            formData.pickupDate,

          status:
            formData.status,

        };

        await orderApi.updateOrder(
          editingOrder.id,
          payload
        );

        alert(
          "Order Updated"
        );

        setEditingOrder(null);

        fetchOrders();

      } catch (error) {

        console.error(error);

        alert(
          "Update Failed"
        );

      }
    };

  if (loading) {

    return (
      <h2>
        Loading...
      </h2>
    );

  }

  return (

    <div className="admin-orders">

      <h1>
        Orders Management
      </h1>

      <div className="orders-grid">

        {orders.map((order) => (

          <div
            key={order.id}
            className="order-card"
          >

            <h3>
              Order #
              {order.id}
            </h3>

            <p>

              <strong>
                Status:
              </strong>

              {order.status
                ? " Active"
                : " Cancelled"}

            </p>

            <p>

              <strong>
                Pickup:
              </strong>

              {" "}
              {
                order.pickupDate
              }

            </p>

            <p>

              <strong>
                Category ID:
              </strong>

              {" "}
              {
                order.categoryID
              }

            </p>

            <p>

              <strong>
                SubCategory ID:
              </strong>

              {" "}
              {
                order.subCategoryID
              }

            </p>

            <div className="order-actions">

              <button
                className="edit-btn"
                onClick={() =>
                  handleEditClick(
                    order
                  )
                }
              >

                Edit

              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(
                    order.id
                  )
                }
              >

                Delete

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* UPDATE MODAL */}
      {editingOrder && (

        <div className="modal-overlay">

          <div className="modal-box">

            <h2>
              Update Order
            </h2>

            <input
              type="datetime-local"
              name="pickupDate"
              value={
                formData.pickupDate
              }
              onChange={
                handleChange
              }
            />

            <select
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
            >

              <option value={true}>
                Active
              </option>

              <option value={false}>
                Cancelled
              </option>

            </select>

            <div className="modal-actions">

              <button
                className="save-btn"
                onClick={
                  handleUpdate
                }
              >

                Save

              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditingOrder(
                    null
                  )
                }
              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminOrders;