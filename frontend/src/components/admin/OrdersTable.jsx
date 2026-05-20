import React, { useState } from "react";
import { formatDateTime, formatValue, getAddressSummary, getCategoryName } from "../../utils/adminDashboard";

const OrdersTable = ({
  orders,
  admins,
  categories,
  currentAdminId,
  onAcceptOrder,
  onAssignOrder,
  onUnassignOrder,
  onRescheduleOrder,
  onSendDeliveryOtp,
  onDeliverOrder,
}) => {
  const [assignmentByOrder, setAssignmentByOrder] = useState({});
  const [scheduleByOrder, setScheduleByOrder] = useState({});
  const [deliveryOtpByOrder, setDeliveryOtpByOrder] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const formatTimeRange = (order) => {
    if (!order.startRange && !order.endRange) {
      return "-";
    }

    return `${order.startRange || "-"} - ${order.endRange || "-"}`;
  };

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

  const toDateInputValue = (value) => {
    if (!value) {
      return "";
    }

    return String(value).slice(0, 10);
  };

  const toTimeInputValue = (value) => {
    if (!value) {
      return "";
    }

    return String(value).slice(0, 5);
  };

  const getScheduleDraft = (order) => {
    return scheduleByOrder[order.id] || {
      pickupDate: toDateInputValue(order.pickupDate),
      startRange: toTimeInputValue(order.startRange),
      endRange: toTimeInputValue(order.endRange),
    };
  };

  const updateScheduleDraft = (order, name, value) => {
    const currentDraft = getScheduleDraft(order);

    setScheduleByOrder((current) => ({
      ...current,
      [order.id]: {
        ...currentDraft,
        [name]: value,
      },
    }));
  };

  const getAdminName = (admin) => {
    return [admin.firstName, admin.lastName].filter(Boolean).join(" ")
      || admin.username
      || admin.email
      || `Admin ${admin.id}`;
  };

  const getAssignedAdminText = (order) => {
    if (!order.pickscheduleById) {
      return "Unassigned";
    }

    return order.pickscheduleById === currentAdminId
      ? "Me"
      : `Admin ${formatValue(order.pickscheduleById)}`;
  };

  const selectedOrder = orders.find((order) => String(order.id) === String(selectedOrderId));

  if (selectedOrder) {
    const scheduleDraft = getScheduleDraft(selectedOrder);
    const selectedAdminId = assignmentByOrder[selectedOrder.id] || selectedOrder.pickscheduleById || "";
    const deliveryOtp = deliveryOtpByOrder[selectedOrder.id] || "";
    const isDelivered = String(selectedOrder.status || "").toLowerCase() === "delivered";

    return (
      <section className="admin-card order-detail-page">
        <header className="order-detail-admin-header">
          <button className="admin-secondary" type="button" onClick={() => setSelectedOrderId(null)}>
            Back to Orders
          </button>
          <div>
            <span>Order Details</span>
            <h2>Order #{formatValue(selectedOrder.id)}</h2>
            <p>{selectedOrder.status || "Scheduled"}</p>
          </div>
        </header>

        <div className="order-detail-admin-grid">
          <article>
            <span>Status</span>
            <strong>{selectedOrder.status || "Scheduled"}</strong>
          </article>
          <article>
            <span>Pickup Date</span>
            <strong>{formatDateTime(selectedOrder.pickupDate)}</strong>
          </article>
          <article>
            <span>Time Range</span>
            <strong>{formatTimeRange(selectedOrder)}</strong>
          </article>
          <article>
            <span>Assigned To</span>
            <strong>{getAssignedAdminText(selectedOrder)}</strong>
          </article>
          <article>
            <span>Category</span>
            <strong>{getOrderCategoryPath(selectedOrder)}</strong>
          </article>
          <article>
            <span>Created By</span>
            <strong>{selectedOrder.createdByUserID === 0 ? "Guest" : formatValue(selectedOrder.createdByUserID)}</strong>
          </article>
          <article>
            <span>Created At</span>
            <strong>{formatDateTime(selectedOrder.createdDateTime)}</strong>
          </article>
          <article>
            <span>Updated At</span>
            <strong>{formatDateTime(selectedOrder.updatedDateTime)}</strong>
          </article>
        </div>

        <div className="order-detail-admin-layout">
          <section className="order-detail-admin-panel">
            <h3>Pickup Address</h3>
            <p>{getAddressSummary(selectedOrder.address || {})}</p>
          </section>

          <section className="order-detail-admin-panel">
            <h3>Reschedule</h3>
            <div className="order-detail-form-grid">
              <input
                type="date"
                value={scheduleDraft.pickupDate}
                onChange={(event) => updateScheduleDraft(selectedOrder, "pickupDate", event.target.value)}
                aria-label={`Pickup date for order ${selectedOrder.id}`}
              />
              <input
                type="time"
                value={scheduleDraft.startRange}
                onChange={(event) => updateScheduleDraft(selectedOrder, "startRange", event.target.value)}
                aria-label={`Pickup start time for order ${selectedOrder.id}`}
              />
              <input
                type="time"
                value={scheduleDraft.endRange}
                onChange={(event) => updateScheduleDraft(selectedOrder, "endRange", event.target.value)}
                aria-label={`Pickup end time for order ${selectedOrder.id}`}
              />
              <button
                className="table-action-btn"
                type="button"
                onClick={() => onRescheduleOrder(selectedOrder.id, scheduleDraft)}
              >
                Save Schedule
              </button>
            </div>
          </section>

          <section className="order-detail-admin-panel">
            <h3>Assignment</h3>
            <div className="order-detail-form-grid">
              {!selectedOrder.pickscheduleById && (
                <button className="table-action-btn" type="button" onClick={() => onAcceptOrder(selectedOrder.id)}>
                  Accept Myself
                </button>
              )}
              <select
                value={selectedAdminId}
                onChange={(event) =>
                  setAssignmentByOrder((current) => ({
                    ...current,
                    [selectedOrder.id]: event.target.value,
                  }))
                }
                aria-label={`Assign order ${selectedOrder.id}`}
              >
                <option value="">Select admin</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {getAdminName(admin)}
                  </option>
                ))}
              </select>
              <button className="table-action-btn" type="button" onClick={() => onAssignOrder(selectedOrder.id, selectedAdminId)}>
                Assign
              </button>
              {selectedOrder.pickscheduleById && (
                <button
                  className="table-action-btn table-action-danger"
                  type="button"
                  onClick={() => onUnassignOrder(selectedOrder.id)}
                >
                  Remove Assignment
                </button>
              )}
            </div>
          </section>

          <section className="order-detail-admin-panel">
            <h3>Delivery OTP</h3>
            <div className="order-detail-form-grid">
              <button
                className="table-action-btn"
                type="button"
                disabled={isDelivered}
                onClick={() => onSendDeliveryOtp(selectedOrder.id)}
              >
                Send OTP
              </button>
              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter OTP"
                value={deliveryOtp}
                disabled={isDelivered}
                onChange={(event) =>
                  setDeliveryOtpByOrder((current) => ({
                    ...current,
                    [selectedOrder.id]: event.target.value,
                  }))
                }
                aria-label={`Delivery OTP for order ${selectedOrder.id}`}
              />
              <button
                className="table-action-btn"
                type="button"
                disabled={isDelivered}
                onClick={() => onDeliverOrder(selectedOrder.id, deliveryOtp)}
              >
                Mark Delivered
              </button>
            </div>
          </section>
        </div>
      </section>
    );
  }

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
              <th>Time Range</th>
              <th>Category -> Subcategory</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="7">No Orders Found</td></tr>
            ) : (
              orders.map((order) => (
                  <tr key={order.id}>
                    <td>{formatValue(order.id)}</td>
                    <td><span className="active-pill">{order.status || "Scheduled"}</span></td>
                    <td>{formatDateTime(order.pickupDate)}</td>
                    <td>{formatTimeRange(order)}</td>
                    <td>{getOrderCategoryPath(order)}</td>
                    <td>{getAssignedAdminText(order)}</td>
                    <td>
                      <button className="table-action-btn" type="button" onClick={() => setSelectedOrderId(order.id)}>
                        Details
                      </button>
                    </td>
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
