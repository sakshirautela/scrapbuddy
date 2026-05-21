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
  onRefreshOrders,
}) => {
  const [assignmentByOrder, setAssignmentByOrder] = useState({});
  const [scheduleByOrder, setScheduleByOrder] = useState({});
  const [deliveryOtpByOrder, setDeliveryOtpByOrder] = useState({});
  const [deliveryAmountByOrder, setDeliveryAmountByOrder] = useState({});
  const [selectedOrderKey, setSelectedOrderKey] = useState(null);

  const getOrderId = (order) => order?.id ?? order?.orderId ?? order?.orderID;

  const getOrderKey = (order, index) => {
    const orderId = getOrderId(order);

    if (orderId) {
      return `id-${orderId}`;
    }

    return `row-${index}`;
  };

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
    const orderId = getOrderId(order);

    return scheduleByOrder[orderId] || {
      pickupDate: toDateInputValue(order.pickupDate),
      startRange: toTimeInputValue(order.startRange),
      endRange: toTimeInputValue(order.endRange),
    };
  };

  const updateScheduleDraft = (order, name, value) => {
    const orderId = getOrderId(order);

    if (!orderId) {
      return;
    }

    const currentDraft = getScheduleDraft(order);

    setScheduleByOrder((current) => ({
      ...current,
      [orderId]: {
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

  const selectedOrder = orders.find(
    (order, index) => getOrderKey(order, index) === selectedOrderKey
  );

  if (selectedOrder) {
    const selectedOrderRecordId = getOrderId(selectedOrder);
    const scheduleDraft = getScheduleDraft(selectedOrder);
    const selectedAdminId = assignmentByOrder[selectedOrderRecordId] || selectedOrder.pickscheduleById || "";
    const deliveryOtp = deliveryOtpByOrder[selectedOrderRecordId] || "";
    const deliveryAmount =
      deliveryAmountByOrder[selectedOrderRecordId] ?? selectedOrder.amount ?? "";
    const isDelivered = String(selectedOrder.status || "").toLowerCase() === "delivered";

    return (
      <section className="admin-card order-detail-page">
        <header className="order-detail-admin-header">
          <button className="admin-secondary" type="button" onClick={() => setSelectedOrderKey(null)}>
            Back to Orders
          </button>
          <div>
            <span>Order Details</span>
            <h2>Order #{formatValue(selectedOrderRecordId)}</h2>
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
            <span>Estimated Weight</span>
            <strong>{formatValue(selectedOrder.estimateWeight)} kg</strong>
          </article>
          <article>
            <span>Final Amount</span>
            <strong>Rs {formatValue(selectedOrder.amount)}</strong>
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
              {isDelivered ? (
                <p className="assignment-summary">
                  Final pickup time <strong>{formatDateTime(selectedOrder.pickupDate)}</strong>
                  <span>{formatTimeRange(selectedOrder)}</span>
                </p>
              ) : (
                <>
                  <input
                    type="date"
                    value={scheduleDraft.pickupDate}
                    onChange={(event) => updateScheduleDraft(selectedOrder, "pickupDate", event.target.value)}
                    aria-label={`Pickup date for order ${selectedOrderRecordId || "unknown"}`}
                  />
                  <input
                    type="time"
                    value={scheduleDraft.startRange}
                    onChange={(event) => updateScheduleDraft(selectedOrder, "startRange", event.target.value)}
                    aria-label={`Pickup start time for order ${selectedOrderRecordId || "unknown"}`}
                  />
                  <input
                    type="time"
                    value={scheduleDraft.endRange}
                    onChange={(event) => updateScheduleDraft(selectedOrder, "endRange", event.target.value)}
                    aria-label={`Pickup end time for order ${selectedOrderRecordId || "unknown"}`}
                  />
                  <button
                    className="table-action-btn"
                    type="button"
                    disabled={!selectedOrderRecordId}
                    onClick={() => onRescheduleOrder(selectedOrderRecordId, scheduleDraft)}
                  >
                    Save Schedule
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="order-detail-admin-panel">
            <h3>Assignment</h3>
            <div className="order-detail-form-grid">
              {isDelivered ? (
                <p className="assignment-summary">
                  Assigned to <strong>{getAssignedAdminText(selectedOrder)}</strong>
                </p>
              ) : (
                <>
                  {!selectedOrder.pickscheduleById && (
                    <button
                      className="table-action-btn"
                      type="button"
                      disabled={!selectedOrderRecordId}
                      onClick={() => onAcceptOrder(selectedOrderRecordId)}
                    >
                      Accept Myself
                    </button>
                  )}
                  <select
                    value={selectedAdminId}
                    onChange={(event) =>
                      setAssignmentByOrder((current) => ({
                        ...current,
                        [selectedOrderRecordId]: event.target.value,
                      }))
                    }
                    aria-label={`Assign order ${selectedOrderRecordId || "unknown"}`}
                  >
                    <option value="">Select admin</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {getAdminName(admin)}
                      </option>
                    ))}
                  </select>
                  <button
                    className="table-action-btn"
                    type="button"
                    disabled={!selectedOrderRecordId}
                    onClick={() => onAssignOrder(selectedOrderRecordId, selectedAdminId)}
                  >
                    Assign
                  </button>
                  {selectedOrder.pickscheduleById && (
                    <button
                      className="table-action-btn table-action-danger"
                      type="button"
                      disabled={!selectedOrderRecordId}
                      onClick={() => onUnassignOrder(selectedOrderRecordId)}
                    >
                      Remove Assignment
                    </button>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="order-detail-admin-panel">
            <h3>Delivery OTP</h3>
            <div className="order-detail-form-grid">
              <button
                className="table-action-btn"
                type="button"
                disabled={isDelivered || !selectedOrderRecordId}
                onClick={() => onSendDeliveryOtp(selectedOrderRecordId)}
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
                    [selectedOrderRecordId]: event.target.value,
                  }))
                }
                aria-label={`Delivery OTP for order ${selectedOrderRecordId || "unknown"}`}
              />
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Final amount"
                value={deliveryAmount}
                disabled={isDelivered}
                onChange={(event) =>
                  setDeliveryAmountByOrder((current) => ({
                    ...current,
                    [selectedOrderRecordId]: event.target.value,
                  }))
                }
                aria-label={`Final amount for order ${selectedOrderRecordId || "unknown"}`}
              />
              <button
                className="table-action-btn"
                type="button"
                disabled={isDelivered || !selectedOrderRecordId}
                onClick={() =>
                  onDeliverOrder(selectedOrderRecordId, {
                    otp: deliveryOtp,
                    amount: deliveryAmount,
                  })
                }
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
      <div className="table-title-row">
        <div>
          <h2>Orders</h2>
          <p>{orders.length} {orders.length === 1 ? "order" : "orders"} loaded</p>
        </div>
        {onRefreshOrders ? (
          <button className="admin-outline" type="button" onClick={onRefreshOrders}>
            Refresh
          </button>
        ) : null}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Pickup Date</th>
              <th>Time Range</th>
              <th>Estimated Weight</th>
              <th>Amount</th>
              <th>Category - Subcategory</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="9">No Orders Found</td></tr>
            ) : (
              orders.map((order, index) => {
                const orderId = getOrderId(order);

                return (
                  <tr key={getOrderKey(order, index)}>
                    <td>{formatValue(orderId)}</td>
                    <td><span className="active-pill">{order.status || "Scheduled"}</span></td>
                    <td>{formatDateTime(order.pickupDate)}</td>
                    <td>{formatTimeRange(order)}</td>
                    <td>{formatValue(order.estimateWeight)} kg</td>
                    <td>Rs {formatValue(order.amount)}</td>
                    <td>{getOrderCategoryPath(order)}</td>
                    <td>{getAssignedAdminText(order)}</td>
                    <td>
                      <button
                        className="table-action-btn"
                        type="button"
                        onClick={() => setSelectedOrderKey(getOrderKey(order, index))}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrdersTable;
