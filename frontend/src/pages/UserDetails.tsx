// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { formatOrderCategoryPairs } from "../utils/orderCategories";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import orderApi from "../api/orderApi";
import addressApi from "../api/addressApi";
import authApi from "../api/authApi";
import { updateUser } from "../api/userApi";
import AddressForm from "../components/input/Address";
import PublicFooter from "../components/common/PublicFooter/PublicFooter";
import SideNav from "../components/common/SideNav/SideNav";
import { formatIndianDateTime, formatValue, getAddressSummary } from "../utils/formatters";
import "../styles/ProfileDashboard.css";
const baseSidebarItems = [
  { key: "profile", label: "Overview", icon: "⌂" },
  { key: "orders", label: "My Pickups", icon: "▣" },
  { key: "addresses", label: "Saved Addresses", icon: "⌖" },
  { key: "earnings", label: "Earnings", icon: "□" },
  { key: "settings", label: "Profile Settings", icon: "⚙" },
];

const adminSidebarItem = [
  { key: "admin", label: "Admin Dashboard", icon: "⚙️" },
];

const formatTimeRange = (order) => {
  if (!order?.startRange && !order?.endRange) {
    return "-";
  }

  return `${order.startRange || "-"} - ${order.endRange || "-"}`;
};

const formatOrderItems = (order = {}) => {
  const categoryPairsText = formatOrderCategoryPairs(order.categorySubcategoryPairs);

  if (categoryPairsText !== "-") {
    return categoryPairsText;
  }

  if (order.categoryID || order.subCategoryID) {
    return `Category ${order.categoryID || "-"}, Item ${order.subCategoryID || "-"}`;
  }

  return "-";
};

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderDraft, setOrderDraft] = useState({});
  const [savingOrder, setSavingOrder] = useState(false);
  const [openOrderMenuId, setOpenOrderMenuId] = useState(null);
  const [actionMenuPosition, setActionMenuPosition] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressDraft, setAddressDraft] = useState({});
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [openAddressMenuId, setOpenAddressMenuId] = useState(null);
  const [profileDraft, setProfileDraft] = useState({});
  const [profileOtp, setProfileOtp] = useState({ email: "", phone: "" });
  const [profileVerified, setProfileVerified] = useState({ email: false, phone: false });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [sendingProfileOtp, setSendingProfileOtp] = useState({ email: false, phone: false });
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 980);

  const { user, logout, updateCurrentUser } = useAuth();
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    return (
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      "User"
    );
  }, [user]);

  const recentOrders = orders.slice(0, 5);
  const getOrderId = (order) => order?.id ?? order?.orderId ?? order?.orderID;
  const userRole = user?.role?.toLowerCase() || "";
  const isAdminUser = ["admin", "superadmin", "super_admin"].includes(userRole);
  const sidebarItems = isAdminUser ? [...baseSidebarItems, ...adminSidebarItem] : baseSidebarItems;
  const totalPickups = orders.length;
  const earningOrders = orders.filter((order) => Number(order.amount) > 0);
  const totalEarnings = earningOrders.reduce((total, order) => total + (Number(order.amount) || 0), 0);
  const totalWeight = orders.reduce((total, order) => total + (Number(order.estimateWeight) || 0), 0);
  const co2Saved = totalWeight * 2.4;
  // const rewardPoints = totalPickups * 40 + completedOrders.length * 60;
  // const walletBalance = totalEarnings;
  const treesEquivalent = Math.max(0, Math.round(co2Saved / 18));
  const dashboardStats = [
    { title: "Total Pickups", value: totalPickups, sub: "All time pickups", icon: "▣", action: "View all pickups" , onClick: () => setActiveTab("orders") },
    { title: "Total Earnings", value: `Rs ${totalEarnings.toLocaleString("en-IN")}`, sub: "All time earnings", icon: "₹", action: "View earnings" ,onClick: () => setActiveTab("earnings") },
    { title: "CO₂ Saved", value: `${co2Saved.toFixed(1)} kg`, sub: "CO₂ emissions reduced", icon: "♧", action: "See my impact" },
    // { title: "Reward Points", value: rewardPoints, sub: "Available points", icon: "□", action: "View rewards" },
  ];

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;

      setLoadingOrders(true);
      setOrderError("");

      try {
        const response = await orderApi.getMyOrders();

        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setOrderError(error.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user?.id]);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.id) return;

      setLoadingAddresses(true);
      setAddressError("");

      try {
        const savedAddresses = await addressApi.getMyAddresses();
        setAddresses(savedAddresses);
      } catch (error) {
        setAddressError(error.message || "Failed to load saved addresses");
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user?.id]);

  useEffect(() => {
    setProfileDraft({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setProfileOtp({ email: "", phone: "" });
    setProfileVerified({ email: false, phone: false });
    setProfileMessage("");
    setProfileError("");
  }, [user]);

  const isProfileEmailChanged =
    String(profileDraft.email || "").trim().toLowerCase() !== String(user?.email || "").trim().toLowerCase();
  const isProfilePhoneChanged =
    String(profileDraft.phone || "").trim() !== String(user?.phone || "").trim();

  const updateProfileDraft = (name, value) => {
    setProfileDraft((current) => ({
      ...current,
      [name]: value,
    }));
    setProfileMessage("");
    setProfileError("");

    if (name === "email") {
      setProfileVerified((current) => ({ ...current, email: false }));
      setProfileOtp((current) => ({ ...current, email: "" }));
    }

    if (name === "phone") {
      setProfileVerified((current) => ({ ...current, phone: false }));
      setProfileOtp((current) => ({ ...current, phone: "" }));
    }
  };

  const handleSendProfileOtp = async (type) => {
    const value = String(profileDraft[type] || "").trim();

    if (!value) {
      setProfileError(`Please enter ${type} before sending OTP.`);
      return;
    }

    setSendingProfileOtp((current) => ({ ...current, [type]: true }));
    setProfileError("");
    setProfileMessage("");

    try {
      if (type === "email") {
        await authApi.sendRegistrationOtp(value);
      } else {
        await authApi.sendPhoneVerificationOtp(value);
      }

      setProfileMessage(`OTP sent to your ${type}.`);
    } catch (error) {
      setProfileError(error.message || `Failed to send ${type} OTP`);
    } finally {
      setSendingProfileOtp((current) => ({ ...current, [type]: false }));
    }
  };

  const handleVerifyProfileOtp = async (type) => {
    const value = String(profileDraft[type] || "").trim();
    const otp = String(profileOtp[type] || "").trim();

    if (!value || !otp) {
      setProfileError(`Please enter ${type} and OTP.`);
      return;
    }

    setProfileError("");
    setProfileMessage("");

    try {
      if (type === "email") {
        await authApi.verifyRegistrationOtp(value, otp);
      } else {
        await authApi.verifyPhoneOtp(value, otp);
      }

      setProfileVerified((current) => ({ ...current, [type]: true }));
      setProfileMessage(`${type === "email" ? "Email" : "Phone"} verified.`);
    } catch (error) {
      setProfileError(error.message || `Failed to verify ${type} OTP`);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      return;
    }

    if (!String(profileDraft.firstName || "").trim()) {
      setProfileError("First name cannot be empty.");
      return;
    }

    if (!String(profileDraft.email || "").trim()) {
      setProfileError("Email cannot be empty.");
      return;
    }

    if (isProfileEmailChanged && !profileVerified.email) {
      setProfileError("Please verify the new email OTP before saving.");
      return;
    }

    if (isProfilePhoneChanged && !profileVerified.phone) {
      setProfileError("Please verify the new phone OTP before saving.");
      return;
    }

    setSavingProfile(true);
    setProfileError("");
    setProfileMessage("");

    try {
      const updatedUser = await updateUser(user.id, {
        ...user,
        firstName: profileDraft.firstName.trim(),
        lastName: String(profileDraft.lastName || "").trim(),
        email: profileDraft.email.trim().toLowerCase(),
        phone: String(profileDraft.phone || "").trim(),
        password: user?.password || "unchanged",
        emailOtp: profileOtp.email.trim(),
        phoneOtp: profileOtp.phone.trim(),
      });

      if (isProfileEmailChanged) {
        window.alert("Email updated. Please login again with your new email.");
        await logout();
        navigate("/login");
        return;
      }

      updateCurrentUser(updatedUser);
      setProfileMessage("Profile updated.");
    } catch (error) {
      setProfileError(error.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    const requiredFields = ["receiverFirstName", "receiverPhone", "city", "country"];
    const hasMissingField = requiredFields.some((field) => !String(addressDraft[field] || "").trim());

    if (hasMissingField) {
      setAddressError("Please fill first name, phone, city, and country.");
      return;
    }

    setSavingAddress(true);
    setAddressError("");

    try {
      const payload = {
        apartment: addressDraft.apartment || "",
        city: addressDraft.city || "",
        state: addressDraft.state || "",
        zip: addressDraft.zip || "",
        country: addressDraft.country || "India",
        receiverFirstName: addressDraft.receiverFirstName || "",
        receiverLastName: addressDraft.receiverLastName || "",
        receiverPhone: addressDraft.receiverPhone || "",
        receiverEmail: addressDraft.receiverEmail || "",
        countryCode: addressDraft.countryCode || "+91",
      };

      const savedAddress = editingAddressId
        ? await addressApi.updateAddress(editingAddressId, payload)
        : await addressApi.createAddress(payload);

      setAddresses((current) =>
        editingAddressId
          ? current.map((address) => String(address.id) === String(editingAddressId) ? savedAddress : address)
          : [savedAddress, ...current]
      );
      setAddressDraft({});
      setEditingAddressId(null);
      setShowAddressForm(false);
    } catch (error) {
      setAddressError(error.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (address) => {
    closeActionMenus();
    setAddressDraft(address);
    setEditingAddressId(address.id);
    setShowAddressForm(true);
    setAddressError("");
  };

  const handleCancelAddressForm = () => {
    setAddressDraft({});
    setEditingAddressId(null);
    setShowAddressForm(false);
    setAddressError("");
  };

  const handleDeleteAddress = async (address) => {
    if (!address?.id) {
      return;
    }

    const shouldDelete = window.confirm("Delete this saved address?");

    if (!shouldDelete) {
      return;
    }

    setAddressError("");

    try {
      await addressApi.deleteAddress(address.id);
      setAddresses((current) => current.filter((item) => String(item.id) !== String(address.id)));
      closeActionMenus();

      if (String(editingAddressId) === String(address.id)) {
        handleCancelAddressForm();
      }
    } catch (error) {
      setAddressError(error.message || "Failed to delete address");
    }
  };

  const toDateInputValue = (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
  };

  const toTimeInputValue = (value) => {
    if (!value) return "";
    return String(value).slice(0, 5);
  };

  const canModifyOrder = (order) => {
    const status = String(order?.status || "").toLowerCase();
    return !["delivered", "cancelled", "canceled", "cancellation"].includes(status);
  };

  const getActionMenuPosition = (trigger) => {
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 150;
    const viewportPadding = 12;

    return {
      top: rect.bottom + 6,
      left: Math.min(
        Math.max(viewportPadding, rect.right - menuWidth),
        window.innerWidth - menuWidth - viewportPadding
      ),
    };
  };

  const closeActionMenus = () => {
    setOpenOrderMenuId(null);
    setOpenAddressMenuId(null);
    setActionMenuPosition(null);
  };

  const toggleOrderMenu = (orderMenuId, event) => {
    if (String(openOrderMenuId) === String(orderMenuId)) {
      closeActionMenus();
      return;
    }

    setOpenAddressMenuId(null);
    setOpenOrderMenuId(orderMenuId);
    setActionMenuPosition(getActionMenuPosition(event.currentTarget));
  };

  const toggleAddressMenu = (addressMenuId, event) => {
    if (String(openAddressMenuId) === String(addressMenuId)) {
      closeActionMenus();
      return;
    }

    setOpenOrderMenuId(null);
    setOpenAddressMenuId(addressMenuId);
    setActionMenuPosition(getActionMenuPosition(event.currentTarget));
  };

  const openOrderEditor = (order) => {
    closeActionMenus();
    setEditingOrder(order);
    setOrderDraft({
      pickupDate: toDateInputValue(order.pickupDate),
      startRange: toTimeInputValue(order.startRange),
      endRange: toTimeInputValue(order.endRange),
      estimateWeight: order.estimateWeight || "",
    });
    setOrderError("");
  };

  const cancelOrderEditor = () => {
    setEditingOrder(null);
    setOrderDraft({});
  };

  const replaceOrder = (updatedOrder) => {
    setOrders((current) =>
      current.map((order) => String(getOrderId(order)) === String(getOrderId(updatedOrder)) ? updatedOrder : order)
    );
  };

  const handleSaveOrderChanges = async () => {
    const orderId = getOrderId(editingOrder);

    if (!orderId) return;

    if (!orderDraft.pickupDate || !orderDraft.startRange || !orderDraft.endRange) {
      setOrderError("Please enter pickup date and time range.");
      return;
    }

    if (orderDraft.endRange <= orderDraft.startRange) {
      setOrderError("Pickup end time must be after start time.");
      return;
    }

    setSavingOrder(true);
    setOrderError("");

    try {
      const response = await orderApi.updateOrder(orderId, {
        pickupDate: `${orderDraft.pickupDate}T00:00:00`,
        startRange: `${orderDraft.startRange}:00`,
        endRange: `${orderDraft.endRange}:00`,
        estimateWeight: Number(orderDraft.estimateWeight) || editingOrder.estimateWeight || 0,
        categoryIDsWithSubcatIDs: editingOrder.categorySubcategoryPairs || {},
        status: editingOrder.status || "Scheduled",
        address: editingOrder.address,
      });

      replaceOrder(response.data);
      cancelOrderEditor();
    } catch (error) {
      setOrderError(error.message || "Failed to update pickup");
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDeleteOrder = async (order) => {
    const orderId = getOrderId(order);

    if (!orderId) return;

    const shouldDelete = window.confirm("Cancel this pickup request?");

    if (!shouldDelete) return;

    setOrderError("");

    try {
      const response = await orderApi.cancelOrder(orderId);
      replaceOrder(response.data);
      closeActionMenus();

      if (String(getOrderId(editingOrder)) === String(orderId)) {
        cancelOrderEditor();
      }
    } catch (error) {
      setOrderError(error.message || "Failed to cancel pickup");
    }
  };
const renderEarnings = () => (
  <section className="profile-panel earnings-panel dashboard-pickups-card">
    <div className="profile-panel-header">
      <div>
        <h2>Earnings</h2>
        <p>Your completed earning pickups are listed below.</p>
      </div>
      <strong className="earnings-total">Rs {totalEarnings.toLocaleString("en-IN")}</strong>
    </div>

    {loadingOrders ? <p className="profile-muted">Loading earnings...</p> : null}
    {orderError ? <p className="profile-error">{orderError}</p> : null}

    {!loadingOrders && !orderError ? (
      <div className="profile-table-wrap">
        <table className="profile-orders-table">
          <thead>
            <tr>
              <th>Pickup ID</th>
              <th>Date & Time</th>
              <th>Items</th>
              <th>Weight</th>
              <th>Amount Earned</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {earningOrders.length === 0 ? (
              <tr>
                <td colSpan="6">No earnings found yet</td>
              </tr>
            ) : (
              earningOrders.map((order, index) => {
                const orderId = getOrderId(order);

                return (
                  <tr key={orderId || `earning-order-${index}`}>
                    <td>#ORD{String(orderId || "-").padStart(4, "0")}</td>
                    <td>{formatIndianDateTime(order.pickupDate || order.updatedDateTime || order.createdDateTime)}</td>
                    <td>{formatOrderItems(order)}</td>
                    <td>{formatValue(order.estimateWeight)} kg</td>
                    <td>Rs {Number(order.amount).toLocaleString("en-IN")}</td>
                    <td>
                      <span
                        className={
                          order.status?.toLowerCase() === "delivered"
                            ? "pill delivered"
                            : "pill processing"
                        }
                      >
                        {order.status || "Paid"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    ) : null}

    <div className="profile-table-footer">
      <span>Showing {earningOrders.length} earning pickups</span>
    </div>
  </section>
);
const renderAddresses = () => (
  <section className="profile-panel addresses-panel saved-addresses-panel">
    <div className="profile-panel-header">
      <div>
        <h2>Saved Addresses</h2>
        <p>Manage pickup locations saved to your account.</p>
      </div>
      <button
        type="button"
        className="add-address-btn"
        onClick={() => {
          if (showAddressForm) {
            handleCancelAddressForm();
            return;
          }

          setAddressDraft({});
          setEditingAddressId(null);
          setShowAddressForm(true);
        }}
      >
        {showAddressForm ? "Close" : "+ Add New Address"}
      </button>
    </div>

    {addressError ? <p className="profile-error">{addressError}</p> : null}

    {showAddressForm ? (
      <div className="saved-address-form">
        <AddressForm
          initialAddress={addressDraft}
          onSelectAddress={setAddressDraft}
        />
        <div className="saved-address-actions">
          <button type="button" className="view-btn" onClick={handleCancelAddressForm}>
            Cancel
          </button>
          <button type="button" className="add-address-btn" onClick={handleSaveAddress} disabled={savingAddress}>
            {savingAddress ? "Saving..." : editingAddressId ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    ) : null}

    {loadingAddresses ? <p className="profile-muted">Loading saved addresses...</p> : null}

    {!loadingAddresses ? (
      addresses.length > 0 ? (
        <div className="addresses-list">
          {addresses.map((address, index) => {
            const addressMenuId = address.id || `address-${index}`;
            const isAddressMenuOpen = String(openAddressMenuId) === String(addressMenuId);

            return (
              <article className="address-card" key={address.id || getAddressSummary(address)}>
                <div className="address-card-header">
                  <h3>{[address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" ") || "Pickup Address"}</h3>
                  <div className="pickup-action-menu">
                    <button
                      type="button"
                      className="pickup-menu-trigger"
                      aria-label="Address actions"
                      aria-expanded={isAddressMenuOpen}
                      onClick={(event) => toggleAddressMenu(addressMenuId, event)}
                    >
                      ⋯
                    </button>

                    {isAddressMenuOpen ? (
                      <div className="pickup-menu-popover" style={actionMenuPosition || undefined}>
                        <button type="button" onClick={() => handleEditAddress(address)}>
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => handleDeleteAddress(address)}>
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <p>{getAddressSummary(address)}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="profile-muted">No saved addresses found.</p>
      )
    ) : null}
  </section>
);

const renderProfileSettings = () => (
  <section className="profile-panel settings-panel">
    <div className="profile-panel-header">
      <div>
        <h2>Profile Settings</h2>
        <p>Edit your account details. New phone and email values require OTP verification.</p>
      </div>
    </div>

    {profileError ? <p className="profile-error">{profileError}</p> : null}
    {profileMessage ? <p className="profile-success">{profileMessage}</p> : null}

    <div className="profile-settings-form">
      <label>
        First Name
        <input
          type="text"
          value={profileDraft.firstName || ""}
          onChange={(event) => updateProfileDraft("firstName", event.target.value)}
        />
      </label>

      <label>
        Last Name
        <input
          type="text"
          value={profileDraft.lastName || ""}
          onChange={(event) => updateProfileDraft("lastName", event.target.value)}
        />
      </label>

      <div className="verified-field">
        <label>
          Email
          <input
            type="email"
            value={profileDraft.email || ""}
            onChange={(event) => updateProfileDraft("email", event.target.value)}
          />
        </label>
        {isProfileEmailChanged ? (
          <div className="otp-row">
            <button
              type="button"
              className="view-btn"
              disabled={sendingProfileOtp.email}
              onClick={() => handleSendProfileOtp("email")}
            >
              {sendingProfileOtp.email ? "Sending..." : "Send OTP"}
            </button>
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Email OTP"
              value={profileOtp.email}
              onChange={(event) =>
                setProfileOtp((current) => ({ ...current, email: event.target.value }))
              }
            />
            <button type="button" className="add-address-btn" onClick={() => handleVerifyProfileOtp("email")}>
              {profileVerified.email ? "Verified" : "Verify"}
            </button>
          </div>
        ) : (
          <span className="verified-note">Current email</span>
        )}
      </div>

      <div className="verified-field">
        <label>
          Phone
          <input
            type="tel"
            value={profileDraft.phone || ""}
            onChange={(event) => updateProfileDraft("phone", event.target.value)}
          />
        </label>
        {isProfilePhoneChanged ? (
          <div className="otp-row">
            <button
              type="button"
              className="view-btn"
              disabled={sendingProfileOtp.phone}
              onClick={() => handleSendProfileOtp("phone")}
            >
              {sendingProfileOtp.phone ? "Sending..." : "Send OTP"}
            </button>
            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Phone OTP"
              value={profileOtp.phone}
              onChange={(event) =>
                setProfileOtp((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <button type="button" className="add-address-btn" onClick={() => handleVerifyProfileOtp("phone")}>
              {profileVerified.phone ? "Verified" : "Verify"}
            </button>
          </div>
        ) : (
          <span className="verified-note">Current phone</span>
        )}
      </div>
    </div>

    <div className="profile-settings-actions">
      <button type="button" className="add-address-btn" onClick={handleSaveProfile} disabled={savingProfile}>
        {savingProfile ? "Saving..." : "Save Profile"}
      </button>
    </div>
  </section>
);

  const renderOrdersTable = () => (
    <section className="profile-panel recent-orders-panel dashboard-pickups-card">
      <div className="profile-panel-header">
        <h2>{activeTab === "profile" ? "Recent Pickups" : "My Pickups"}</h2>

        {activeTab === "profile" ? (
          <button type="button" onClick={() => setActiveTab("orders")}>
            View All Pickups →
          </button>
        ) : null}
      </div>

      {loadingOrders ? <p className="profile-muted">Loading orders...</p> : null}
      {orderError ? <p className="profile-error">{orderError}</p> : null}

      {!loadingOrders ? (
        <>
          {editingOrder ? (
            <div className="pickup-edit-panel">
              <div>
                <h3>Edit Pickup #{String(getOrderId(editingOrder) || "-").padStart(4, "0")}</h3>
                <p>Update pickup date, time, or estimated weight.</p>
              </div>
              <label>
                Date
                <input
                  type="date"
                  value={orderDraft.pickupDate || ""}
                  onChange={(event) => setOrderDraft((current) => ({ ...current, pickupDate: event.target.value }))}
                />
              </label>
              <label>
                Start
                <input
                  type="time"
                  value={orderDraft.startRange || ""}
                  onChange={(event) => setOrderDraft((current) => ({ ...current, startRange: event.target.value }))}
                />
              </label>
              <label>
                End
                <input
                  type="time"
                  value={orderDraft.endRange || ""}
                  onChange={(event) => setOrderDraft((current) => ({ ...current, endRange: event.target.value }))}
                />
              </label>
              <label>
                Weight
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={orderDraft.estimateWeight || ""}
                  onChange={(event) => setOrderDraft((current) => ({ ...current, estimateWeight: event.target.value }))}
                />
              </label>
              <div className="pickup-edit-actions">
                <button type="button" className="view-btn" onClick={cancelOrderEditor}>
                  Cancel
                </button>
                <button type="button" className="add-address-btn" onClick={handleSaveOrderChanges} disabled={savingOrder}>
                  {savingOrder ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : null}

          <div className="profile-table-wrap">
            <table className="profile-orders-table">
              <thead>
                <tr>
                  <th>Pickup ID</th>
                  <th>Date & Time</th>
                  <th>Items</th>
                  <th>Weight</th>
                  <th>Amount Earned</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {(activeTab === "profile" ? recentOrders : orders).length === 0 ? (
                <tr>
                  <td colSpan="7">No pickups found</td>
                </tr>
              ) : (
                (activeTab === "profile" ? recentOrders : orders).map(
                  (order, index) => {
                    const orderId = getOrderId(order);
                    const orderMenuId = orderId || `profile-order-${index}`;
                    const isOrderMenuOpen = String(openOrderMenuId) === String(orderMenuId);

                    return (
                    <tr key={orderId || `profile-order-${index}`}>
                      <td>#ORD{String(orderId || "-").padStart(4, "0")}</td>

                      <td>
                        {formatIndianDateTime(
                          order.pickupDate || order.createdDateTime
                        )}
                      </td>

                      <td>{formatOrderItems(order)}</td>
                      <td>{formatValue(order.estimateWeight)} kg</td>
                      <td>Rs {formatValue(order.amount)}</td>

                      <td>
                        <span
                          className={
                            ["cancelled", "canceled", "cancellation"].includes(order.status?.toLowerCase())
                              ? "pill cancelled"
                              : order.status?.toLowerCase() === "delivered"
                                ? "pill delivered"
                                : "pill processing"
                          }
                        >
                          {order.status || "Scheduled"}
                        </span>
                      </td>
                      <td>
                        <div className="pickup-action-menu">
                          <button
                            type="button"
                            className="pickup-menu-trigger"
                            aria-label={`Actions for pickup ${orderId || index + 1}`}
                            aria-expanded={isOrderMenuOpen}
                            onClick={(event) => toggleOrderMenu(orderMenuId, event)}
                          >
                            ⋯
                          </button>

                          {isOrderMenuOpen ? (
                            <div className="pickup-menu-popover" style={actionMenuPosition || undefined}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  closeActionMenus();
                                }}
                              >
                                Details
                              </button>
                              <button type="button" onClick={() => openOrderEditor(order)} disabled={!canModifyOrder(order)}>
                                Edit
                              </button>
                              <button type="button" onClick={() => openOrderEditor(order)} disabled={!canModifyOrder(order)}>
                                Reschedule
                              </button>
                              <button type="button" className="danger" onClick={() => handleDeleteOrder(order)} disabled={!canModifyOrder(order)}>
                                Cancel
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                    );
                  }
                )
              )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <div className="profile-table-footer">
        <span>
          Showing {(activeTab === "profile" ? recentOrders : orders).length} of{" "}
          {orders.length} pickups
        </span>
      </div>
    </section>
  );

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) {
      return null;
    }

    const address = selectedOrder.address || {};

    return (
      <div className="order-detail-overlay" role="presentation" onClick={() => setSelectedOrder(null)}>
        <section
          className="order-detail-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="order-detail-header">
            <div>
              <span className="order-detail-eyebrow">Order Details</span>
              <h2 id="order-detail-title">#ORD{String(selectedOrder.id).padStart(4, "0")}</h2>
              <p>{selectedOrder.status || "Processing"}</p>
            </div>
            <button type="button" aria-label="Close order details" onClick={() => setSelectedOrder(null)}>
              ×
            </button>
          </header>

          <div className="order-detail-grid">
            <article>
              <span>Pickup Date</span>
              <strong>{formatIndianDateTime(selectedOrder.pickupDate)}</strong>
            </article>
            <article>
              <span>Pickup Time</span>
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
              <span>Items</span>
              <strong>{formatOrderItems(selectedOrder)}</strong>
            </article>
            <article>
              <span>Assigned Admin</span>
              <strong>{selectedOrder.pickscheduleById ? `Admin ${selectedOrder.pickscheduleById}` : "Not assigned"}</strong>
            </article>
            <article>
              <span>Created By</span>
              <strong>{selectedOrder.createdByUserID === 0 ? "Guest" : formatValue(selectedOrder.createdByUserID)}</strong>
            </article>
            <article>
              <span>Created At</span>
              <strong>{formatIndianDateTime(selectedOrder.createdDateTime)}</strong>
            </article>
            <article>
              <span>Updated At</span>
              <strong>{formatIndianDateTime(selectedOrder.updatedDateTime)}</strong>
            </article>
          </div>

          <section className="order-address-card">
            <h3>Pickup Address</h3>
            <p>{getAddressSummary(address)}</p>
            <dl>
              <div>
                <dt>Receiver</dt>
                <dd>{formatValue([address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" "))}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{formatValue(address.receiverPhone)}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{formatValue(address.receiverEmail)}</dd>
              </div>
              <div>
                <dt>Apartment</dt>
                <dd>{formatValue(address.apartment)}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{formatValue(address.city)}</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>{formatValue(address.state)}</dd>
              </div>
              <div>
                <dt>Zip</dt>
                <dd>{formatValue(address.zip)}</dd>
              </div>
              <div>
                <dt>Country</dt>
                <dd>{formatValue(address.country)}</dd>
              </div>
            </dl>
          </section>
        </section>
      </div>
    );
  };

  const renderOverview = () => (
    <>
      <header className="dashboard-welcome">
        <h1>My Dashboard <span>♧</span></h1>
        <p>Welcome back, {displayName}. Here is what is happening with your scrap journey.</p>
      </header>

      <section className="dashboard-stat-grid">
        {dashboardStats.map((stat) => (
          <article className="dashboard-stat-card" key={stat.title}>
            <span>{stat.icon}</span>
            <div>
              <h3>{stat.title}</h3>
              <strong>{stat.value}</strong>
              <p>{stat.sub}</p>
              <button type="button" onClick={stat.onClick}>{stat.action} →</button>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-main-grid">
        {renderOrdersTable()}
      </section>

      <section className="dashboard-lower-grid">
        <article className="eco-card profile-panel">
          <h2>Your Eco Impact <span>♧</span></h2>
          <p>You are making a real difference.</p>
          <div className="eco-metrics">
            <span><strong>{co2Saved.toFixed(1)} kg</strong> CO₂ saved</span>
            <span><strong>{totalWeight.toFixed(1)} kg</strong> waste recycled</span>
            <span><strong>{treesEquivalent}</strong> trees equivalent</span>
            <span><strong>{totalPickups}</strong> pickups completed</span>
          </div>
        </article>
      </section>
    </>
  );

  return (
    <div
      className={`user-profile-layout scrap-dashboard${
        sidebarOpen ? "" : " sidebar-collapsed"
      }`}
    >
      <button
        className="profile-mobile-sidebar-toggle"
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open profile navigation"
      >
        ☰
      </button>

      <SideNav
        ariaLabel="Profile navigation"
        brandIcon={(displayName || "U").charAt(0).toUpperCase()}
        brandTitle={displayName}
        brandSubtitle="Profile"
        className="profile-sidebar customer-sidebar"
        items={sidebarItems}
        activeKey={activeTab}
        onSelect={(item) => {
          if (item.key === "admin") {
            navigate("/admin");
            return;
          }

          setActiveTab(item.key);
          if (window.innerWidth <= 980) {
            setSidebarOpen(false);
          }
        }}
        onToggle={() => setSidebarOpen((current) => !current)}
        toggleLabel={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        toggleIcon={sidebarOpen ? "☰" : "☰"}
      />

      <section className="profile-main">
        <main className="profile-content">
          {activeTab === "profile" ? renderOverview() : null}
          {activeTab === "orders" ? renderOrdersTable() : null}
          {activeTab === "earnings" ? renderEarnings() : null}
          {activeTab === "addresses" ? renderAddresses() : null}
          {activeTab === "settings" ? renderProfileSettings() : null}
          {!["profile", "orders", "earnings", "addresses", "settings"].includes(activeTab) ? (
            <section className="profile-panel placeholder-panel">
              <h2>{sidebarItems.find((item) => item.key === activeTab)?.label}</h2>
              <p>This section is ready for your next update.</p>
            </section>
          ) : null}
        </main>
      </section>

      <PublicFooter
        className="dashboard-footer"
        companyLinks={[
          { label: "About Us", href: "#/" },
          { label: "Privacy Policy", href: "#/" },
        ]}
        serviceLinks={[
          { label: "Schedule Pickup", href: "#/schedule-pickup" },
          { label: "Price List", href: "#/price-list" },
        ]}
        showHelp={false}
        showAddress={false}
      />

      {renderOrderDetailsModal()}
    </div>
  );
};

export default ProfileDashboard;
