// @ts-nocheck
import React, { useState } from "react";
import { formatDateTime, formatValue, getAddressSummary, getCategoryName } from "../../utils/adminDashboard";
import { formatOrderCategoryPairs } from "../../utils/orderCategories";

const OrdersTable = ({
  orders = [],
  admins = [],
  addresses = [],
  categories = [],
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
  const [assignmentSavingByOrder, setAssignmentSavingByOrder] = useState({});
  const [selectedOrderKey, setSelectedOrderKey] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    assignment: "all",
    city: "all",
    category: "all",
    date: "",
  });

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
    const categoryPairsText = formatOrderCategoryPairs(order.categorySubcategoryPairs, categories, {
      includePrice: true,
    });

    if (categoryPairsText !== "-") {
      return categoryPairsText;
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

    return `${subCategoryName}${price}`;
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

    if (String(order.pickscheduleById) === String(currentAdminId)) {
      return "Me";
    }

    const assignedAdmin = admins.find((admin) => String(admin.id) === String(order.pickscheduleById));

    return assignedAdmin
      ? getAdminName(assignedAdmin)
      : `Admin ${formatValue(order.pickscheduleById)}`;
  };

  const setAssignmentSaving = (orderId, isSaving) => {
    setAssignmentSavingByOrder((current) => ({
      ...current,
      [orderId]: isSaving,
    }));
  };

  const handleAccept = async (orderId) => {
    if (!orderId || assignmentSavingByOrder[orderId]) {
      return;
    }

    setAssignmentSaving(orderId, true);

    try {
      await onAcceptOrder(orderId);
      setAssignmentByOrder((current) => {
        const next = { ...current };
        delete next[orderId];
        return next;
      });
    } finally {
      setAssignmentSaving(orderId, false);
    }
  };

  const handleAssign = async (orderId, adminId) => {
    if (!orderId || assignmentSavingByOrder[orderId]) {
      return;
    }

    setAssignmentSaving(orderId, true);

    try {
      await onAssignOrder(orderId, adminId);
      setAssignmentByOrder((current) => {
        const next = { ...current };
        delete next[orderId];
        return next;
      });
    } finally {
      setAssignmentSaving(orderId, false);
    }
  };

  const handleUnassign = async (orderId) => {
    if (!orderId || assignmentSavingByOrder[orderId]) {
      return;
    }

    setAssignmentSaving(orderId, true);

    try {
      await onUnassignOrder(orderId);
      setAssignmentByOrder((current) => {
        const next = { ...current };
        delete next[orderId];
        return next;
      });
    } finally {
      setAssignmentSaving(orderId, false);
    }
  };

  const getAssignmentButtonText = (orderId, fallback) =>
    assignmentSavingByOrder[orderId]
      ? "Saving..."
      : fallback;

  const selectedOrder = orders.find(
    (order, index) => getOrderKey(order, index) === selectedOrderKey
  );

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const normalizedSearch = filters.search.trim().toLowerCase();

  const statusOptions = Array.from(
    new Set(orders.map((order) => getStatusLabel(order.status)).filter(Boolean))
  ).sort();

  const cityOptions = Array.from(
    new Set(orders.map((order) => order.address?.city).filter(Boolean))
  ).sort();

  const categoryOptions = categories
    .map((category) => ({
      id: String(category.id),
      name: getCategoryName(category),
    }))
    .filter((category) => category.id && category.name)
    .sort((first, second) => first.name.localeCompare(second.name));

  const isOrderInCategory = (order, categoryId) => {
    if (!categoryId || categoryId === "all") {
      return true;
    }

    if (String(order.categoryID || "") === String(categoryId)) {
      return true;
    }

    const pairs = order.categorySubcategoryPairs;

    if (Array.isArray(pairs)) {
      return pairs.some((category) => String(category.id || category.categoryId || "") === String(categoryId));
    }

    if (pairs && typeof pairs === "object") {
      return Object.keys(pairs).some((id) => String(id) === String(categoryId));
    }

    return false;
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = getOrderId(order);
    const status = getStatusLabel(order.status);
    const assignedTo = getAssignedAdminText(order);
    const category = getOrderCategoryPath(order);
    const address = order.address || {};
    const searchableText = [
      orderId,
      status,
      assignedTo,
      category,
      getCreatedByText(order),
      address.receiverFirstName,
      address.receiverLastName,
      address.receiverPhone,
      address.receiverEmail,
      address.apartment,
      address.city,
      address.state,
      address.zip,
      address.country,
    ].filter(Boolean).join(" ").toLowerCase();

    if (normalizedSearch && !searchableText.includes(normalizedSearch)) {
      return false;
    }

    if (filters.status !== "all" && status !== filters.status) {
      return false;
    }

    if (filters.assignment === "assigned" && !order.pickscheduleById) {
      return false;
    }

    if (filters.assignment === "unassigned" && order.pickscheduleById) {
      return false;
    }

    if (filters.assignment === "mine" && String(order.pickscheduleById || "") !== String(currentAdminId || "")) {
      return false;
    }

    if (filters.city !== "all" && address.city !== filters.city) {
      return false;
    }

    if (filters.category !== "all" && !isOrderInCategory(order, filters.category)) {
      return false;
    }

    if (filters.date && toDateInputValue(order.pickupDate) !== filters.date) {
      return false;
    }

    return true;
  });

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
                      disabled={!selectedOrderRecordId || assignmentSavingByOrder[selectedOrderRecordId]}
                      onClick={() => handleAccept(selectedOrderRecordId)}
                    >
                      {getAssignmentButtonText(selectedOrderRecordId, "Accept Myself")}
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
                    <option value="">Select Field Executive</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {getAdminName(admin)}
                      </option>
                    ))}
                  </select>
                  <button
                    className="table-action-btn"
                    type="button"
                    disabled={!selectedOrderRecordId || assignmentSavingByOrder[selectedOrderRecordId]}
                    onClick={() => handleAssign(selectedOrderRecordId, selectedAdminId)}
                  >
                    {getAssignmentButtonText(selectedOrderRecordId, "Assign")}
                  </button>
                  {selectedOrder.pickscheduleById && (
                    <button
                      className="table-action-btn table-action-danger"
                      type="button"
                      disabled={!selectedOrderRecordId || assignmentSavingByOrder[selectedOrderRecordId]}
                      onClick={() => handleUnassign(selectedOrderRecordId)}
                    >
                      {getAssignmentButtonText(selectedOrderRecordId, "Remove Assignment")}
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
          <p>
            Showing {filteredOrders.length} of {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>
        {onRefreshOrders ? (
          <button className="admin-outline" type="button" onClick={onRefreshOrders}>
            Refresh
          </button>
        ) : null}
      </div>
      <div className="admin-filter-panel">
        <label className="admin-filter-field admin-filter-search">
          <span>Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Order, customer, phone, address"
          />
        </label>
        <label className="admin-filter-field">
          <span>Status</span>
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter-field">
          <span>Assignment</span>
          <select value={filters.assignment} onChange={(event) => updateFilter("assignment", event.target.value)}>
            <option value="all">All orders</option>
            <option value="mine">Assigned to me</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </label>
        <label className="admin-filter-field">
          <span>City</span>
          <select value={filters.city} onChange={(event) => updateFilter("city", event.target.value)}>
            <option value="all">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter-field">
          <span>Category</span>
          <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
            <option value="all">All categories</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter-field">
          <span>Pickup Date</span>
          <input
            type="date"
            value={filters.date}
            onChange={(event) => updateFilter("date", event.target.value)}
          />
        </label>
        <button
          className="admin-secondary admin-filter-clear"
          type="button"
          onClick={() => setFilters({
            search: "",
            status: "all",
            assignment: "all",
            city: "all",
            category: "all",
            date: "",
          })}
        >
          Clear
        </button>
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
              <th>Category</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="10">No Orders Found</td></tr>
            ) : (
              filteredOrders.map((order, index) => {
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
