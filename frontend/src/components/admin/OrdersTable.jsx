import React, { useState } from "react";
import { formatDateTime, formatValue, getAddressSummary, getCategoryName } from "../../utils/adminDashboard";

const OrdersTable = ({
  orders,
  admins,
  addresses = [],
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
  const [deliveryWeightByOrder, setDeliveryWeightByOrder] = useState({});
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
    const pairs = order.categorySubcategoryPairs || {};
    const pairEntries = Object.entries(pairs);

    if (pairEntries.length > 0) {
      return pairEntries
        .flatMap(([categoryId, subCategoryIds]) => {
          const category = categories.find((item) => String(item.id) === String(categoryId));
          const categoryName = category ? getCategoryName(category) : `Category ${formatValue(categoryId)}`;
          const ids = Array.isArray(subCategoryIds) ? subCategoryIds : [subCategoryIds];

          return ids.map((subCategoryId) => {
            const subCategory = category?.subCategories?.find(
              (item) => String(item.id) === String(subCategoryId)
            );
            const subCategoryName = subCategory?.subCategory || `Subcategory ${formatValue(subCategoryId)}`;
            const price = subCategory?.price ? ` - Rs ${subCategory.price}/kg` : "";
            return `${categoryName} -> ${subCategoryName}${price}`;
          });
        })
        .join("; ");
    }

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

  const getCreatedByText = (order) => {
    if (!order.createdByUserID || Number(order.createdByUserID) === 0) {
      return "Guest";
    }

    if (order.createdByName || order.createdByEmail) {
      return order.createdByName || order.createdByEmail;
    }

    const createdByAdmin = admins.find((admin) => String(admin.id) === String(order.createdByUserID));

    if (createdByAdmin) {
      return getAdminName(createdByAdmin);
    }

    const matchingAddress = addresses.find((address) => {
      if (String(address.userId || address.userID || "") === String(order.createdByUserID)) {
        return true;
      }

      return order.address?.receiverEmail
        && address.receiverEmail
        && String(address.receiverEmail).toLowerCase() === String(order.address.receiverEmail).toLowerCase();
    });

    const address = matchingAddress || order.address || {};
    const addressName = [address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" ");

    return addressName || address.receiverEmail || "Customer";
  };

  const getStatusLabel = (status) => {
    const normalizedStatus = String(status || "").trim().toLowerCase();

    if (["cancellation", "cancelled", "canceled"].includes(normalizedStatus)) {
      return "Cancelled";
    }

    return status || "Scheduled";
  };

  const isCancelledOrder = (order) => {
    const normalizedStatus = String(order?.status || "").trim().toLowerCase();
    return ["cancellation", "cancelled", "canceled"].includes(normalizedStatus);
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
    const deliveryWeight =
      deliveryWeightByOrder[selectedOrderRecordId] ?? selectedOrder.weight ?? selectedOrder.estimateWeight ?? "";
    const isDelivered = String(selectedOrder.status || "").toLowerCase() === "delivered";
    const isCancelled = isCancelledOrder(selectedOrder);
    const isClosedOrder = isDelivered || isCancelled;

    return (
      <section className="admin-card order-detail-page">
        <header className="order-detail-admin-header">
          <button className="admin-secondary" type="button" onClick={() => setSelectedOrderKey(null)}>
            Back to Orders
          </button>
          <div>
            <span>Order Details</span>
            <h2>Order #{formatValue(selectedOrderRecordId)}</h2>
            <p>{getStatusLabel(selectedOrder.status)}</p>
          </div>
        </header>

        <div className="order-detail-admin-grid">
          <article>
            <span>Status</span>
            <strong>{getStatusLabel(selectedOrder.status)}</strong>
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
            <span>Final Weight</span>
            <strong>{formatValue(selectedOrder.weight)} kg</strong>
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
            <strong>{getCreatedByText(selectedOrder)}</strong>
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
              {isClosedOrder ? (
                <p className="assignment-summary">
                  {isCancelled ? (
                    "Order cancelled"
                  ) : (
                    <>
                      Final pickup time <strong>{formatDateTime(selectedOrder.pickupDate)}</strong>
                      <span>{formatTimeRange(selectedOrder)}</span>
                    </>
                  )}
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
              {isClosedOrder ? (
                <p className="assignment-summary">
                  {isCancelled ? (
                    "Order cancelled"
                  ) : (
                    <>
                      Assigned to <strong>{getAssignedAdminText(selectedOrder)}</strong>
                    </>
                  )}
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
                disabled={isClosedOrder || !selectedOrderRecordId}
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
                disabled={isClosedOrder}
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
                placeholder="Final weight (kg)"
                value={deliveryWeight}
                disabled={isClosedOrder}
                onChange={(event) =>
                  setDeliveryWeightByOrder((current) => ({
                    ...current,
                    [selectedOrderRecordId]: event.target.value,
                  }))
                }
                aria-label={`Final weight for order ${selectedOrderRecordId || "unknown"}`}
              />
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Final amount"
                value={deliveryAmount}
                disabled={isClosedOrder}
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
                disabled={isClosedOrder || !selectedOrderRecordId}
                onClick={() =>
                  onDeliverOrder(selectedOrderRecordId, {
                    otp: deliveryOtp,
                    amount: deliveryAmount,
                    weight: deliveryWeight,
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
              <th>Final Weight</th>
              <th>Amount</th>
              <th>Category - Subcategory</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="10">No Orders Found</td></tr>
            ) : (
              orders.map((order, index) => {
                const orderId = getOrderId(order);

                return (
                  <tr key={getOrderKey(order, index)}>
                    <td>{formatValue(orderId)}</td>
                    <td><span className="active-pill">{getStatusLabel(order.status)}</span></td>
                    <td>{formatDateTime(order.pickupDate)}</td>
                    <td>{formatTimeRange(order)}</td>
                    <td>{formatValue(order.estimateWeight)} kg</td>
                    <td>{formatValue(order.weight)} kg</td>
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
