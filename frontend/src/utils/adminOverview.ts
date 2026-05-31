// @ts-nocheck
import { getAddressSummary, getCategoryName } from "./adminDashboard";
import { formatOrderCategoryPairs } from "./orderCategories";

const statusLabels = {
  pending: "Pending",
  scheduled: "Pending",
  accepted: "Assigned",
  assigned: "Assigned",
  "on the way": "On the Way",
  "delivery otp sent": "On the Way",
  delivered: "Completed",
  completed: "Completed",
  cancelled: "Cancelled",
  canceled: "Cancelled",
  cancellation: "Cancelled",
};

export const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value) || 0);

export const getOrderId = (order) => order?.id ?? order?.orderId ?? order?.orderID;

export const normalizeOrderStatus = (status) => {
  const normalized = String(status || "pending").trim().toLowerCase();
  return statusLabels[normalized] || "Pending";
};

const isSameDay = (value, date = new Date()) => {
  if (!value) {
    return false;
  }

  const target = new Date(value);

  if (Number.isNaN(target.getTime())) {
    return false;
  }

  return target.toDateString() === date.toDateString();
};

const getOrderWeight = (order) => Number(order?.estimateWeight || order?.weight || 0) || 0;

const getOrderAmount = (order) => Number(order?.amount || order?.finalAmount || 0) || 0;

const getCustomerName = (order) => {
  const address = order?.address || {};
  const name = [address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" ");
  return name || order?.createdByName || (order?.createdByUserID ? `Customer ${order.createdByUserID}` : "Guest");
};

const getSlot = (order) => {
  const date = order?.pickupDate ? new Date(order.pickupDate) : null;
  const dateText = date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    : "Not set";
  const start = order?.startRange ? String(order.startRange).slice(0, 5) : "--:--";
  const end = order?.endRange ? String(order.endRange).slice(0, 5) : "--:--";

  return `${dateText}, ${start} - ${end}`;
};

const getCategoryPath = (order, categories) => {
  const categoryPairsText = formatOrderCategoryPairs(order?.categorySubcategoryPairs, categories, {
    separator: ", ",
  });

  if (categoryPairsText !== "-") {
    return categoryPairsText;
  }

  const category = categories.find((item) => String(item.id) === String(order?.categoryID));
  const subCategory = category?.subCategories?.find(
    (item) => String(item.id) === String(order?.subCategoryID)
  );

  return subCategory?.subCategory || (category ? getCategoryName(category) : "Mixed Scrap");
};

const getAdminName = (admin, fallbackIndex) =>
  [admin?.firstName, admin?.lastName].filter(Boolean).join(" ")
  || admin?.username
  || admin?.email
  || `Executive ${fallbackIndex + 1}`;

const buildWeeklySeries = (orders) => {
  const today = new Date();

  return Array.from({ length: 7 }).map((_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));

    const count = orders.filter((order) => isSameDay(order?.pickupDate || order?.createdDateTime, day)).length;

    return {
      label: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      value: count,
    };
  });
};

export const buildAdminOverview = ({ orders = [], categories = [], admins = [], addresses = [], cities = [] }) => {
  const completedOrders = orders.filter((order) => normalizeOrderStatus(order.status) === "Completed");
  const pendingOrders = orders.filter((order) => normalizeOrderStatus(order.status) === "Pending");
  const todayOrders = orders.filter((order) => isSameDay(order.pickupDate || order.createdDateTime));
  const totalRevenue = orders.reduce((sum, order) => sum + getOrderAmount(order), 0);
  const totalWeight = orders.reduce((sum, order) => sum + getOrderWeight(order), 0);
  const customerIds = new Set(
    orders
      .map((order) => order.createdByUserID)
      .filter((id) => id !== null && id !== undefined && id !== 0)
      .map(String)
  );

  const statusCounts = ["Pending", "Assigned", "On the Way", "Completed", "Cancelled"].map((label) => ({
    label,
    value: orders.filter((order) => normalizeOrderStatus(order.status) === label).length,
  }));

  const rates = categories
    .flatMap((category) => {
      const categoryName = getCategoryName(category);
      const subCategories = category.subCategories || [];

      if (subCategories.length === 0) {
        return [{ name: categoryName, category: categoryName, rate: 0 }];
      }

      return subCategories.map((item) => ({
        name: item.subCategory || categoryName,
        category: categoryName,
        rate: Number(item.price || 0),
      }));
    })
    .slice(0, 6);

  const recentRequests = orders.slice(0, 6).map((order) => ({
    id: getOrderId(order) ? `REQ-${getOrderId(order)}` : "REQ-new",
    customer: getCustomerName(order),
    scrapType: getCategoryPath(order, categories),
    address: getAddressSummary(order.address || {}).split(",").slice(3, 6).join(", ") || "Address pending",
    slot: getSlot(order),
    executive: order.pickscheduleById ? `Admin ${order.pickscheduleById}` : "Unassigned",
    status: normalizeOrderStatus(order.status),
  }));

  const executives = (admins.length ? admins : [{}, {}, {}, {}]).slice(0, 5).map((admin, index) => ({
    name: getAdminName(admin, index),
    area: cities[index]?.name || ["Noida", "South Delhi", "Bengaluru", "Pune", "Chennai"][index] || "Service area",
    pickups: Math.max(0, completedOrders.filter((order) => String(order.pickscheduleById) === String(admin?.id)).length || 12 - index),
    rating: (4.8 - index * 0.1).toFixed(1),
    status: index % 4 === 3 ? "Offline" : index % 3 === 2 ? "On Duty" : "Online",
  }));

  const transactions = completedOrders.slice(0, 4).map((order, index) => ({
    id: `TXN-${getOrderId(order) || 9845 - index}`,
    date: order.updatedDateTime
      ? new Date(order.updatedDateTime).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "Today",
    vendor: order.pickscheduleById ? `Admin ${order.pickscheduleById}` : "Counter pickup",
    amount: formatMoney(getOrderAmount(order)),
    mode: "UPI",
    account: order.createdByUserID ? `user-${order.createdByUserID}` : "-",
    status: "Paid",
  }));

  return {
    stats: [
      { label: "Total Pickups Today", value: todayOrders.length || orders.length, trend: "18% vs yesterday", tone: "green", icon: "truck" },
      { label: "Pending Requests", value: pendingOrders.length, trend: "8% vs yesterday", tone: "orange", icon: "clock" },
      { label: "Completed Pickups", value: completedOrders.length, trend: "22% vs yesterday", tone: "green", icon: "check" },
      { label: "Total Revenue", value: formatMoney(totalRevenue), trend: "16% vs yesterday", tone: "green", icon: "rupee" },
      { label: "Active Customers", value: formatCompactNumber(customerIds.size || addresses.length), trend: "12% vs yesterday", tone: "green", icon: "users" },
      { label: "CO2 Saved Today", value: `${(totalWeight * 2.4 / 1000).toFixed(2)} Tonnes`, trend: "15% vs yesterday", tone: "green", icon: "leaf" },
    ],
    weeklySeries: buildWeeklySeries(orders),
    statusCounts,
    rates,
    recentRequests,
    executives,
    transactions,
    supportTickets:[],
    ecoImpact: {
      waste: (totalWeight / 1000).toFixed(2),
      co2: (totalWeight * 2.4 / 1000).toFixed(2),
      trees: Math.round(totalWeight / 22),
    },
    serviceArea: cities[0]?.name || "Greater Noida",
  };
};
