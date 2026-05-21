export const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "home" },
  { key: "orders", label: "Pickup Requests", icon: "pickup" },
  { key: "addresses", label: "Customers", icon: "customers" },
  { key: "categories", label: "Scrap Categories", icon: "categories" },
  { key: "price-management", label: "Price Management", icon: "price" },
  { key: "field-executives", label: "Field Executives", icon: "executives" },
  { key: "transactions", label: "Transactions", icon: "transactions" },
  { key: "kyc", label: "KYC Verifications", icon: "kyc" },
  { key: "support", label: "Support Tickets", icon: "support" },
  { key: "cities", label: "Service Areas", icon: "cities" },
  { key: "settings", label: "Settings", icon: "settings" },
];

const categoryIconMap = {
  plastic: "♙",
  paper: "▤",
  papers: "▤",
  metal: "⌁",
  electronics: "⌘",
  vehicle: "⇄",
  furniture: "▦",
  glass: "◌",
};

const rateIconMap = {
  bottle: "♜",
  plastic: "▱",
  bag: "▰",
  cable: "⌘",
  paper: "▤",
  newspaper: "▤",
  cardboard: "▥",
  iron: "⌁",
  metal: "⌁",
  glass: "◌",
};

export const getCategoryName = (category) => category?.category || category?.name || "Untitled";

export const getCategoryIcon = (name) => {
  const key = String(name || "").toLowerCase();
  const iconKey = Object.keys(categoryIconMap).find((item) => key.includes(item));
  return iconKey ? categoryIconMap[iconKey] : "♻";
};

export const getRateIcon = (name) => {
  const key = String(name || "").toLowerCase();
  const iconKey = Object.keys(rateIconMap).find((item) => key.includes(item));
  return iconKey ? rateIconMap[iconKey] : "♻";
};

export const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

export const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

export const joinValues = (values) => {
  const filteredValues = values.filter(
    (value) => value !== null && value !== undefined && String(value).trim() !== ""
  );

  return filteredValues.length > 0 ? filteredValues.join(", ") : "-";
};

export const getAddressSummary = (address = {}) =>
  joinValues([
    [address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" "),
    address.receiverPhone,
    address.receiverEmail,
    address.apartment,
    address.city,
    address.state,
    address.zip,
    address.country,
    address.countryCode,
  ]);
