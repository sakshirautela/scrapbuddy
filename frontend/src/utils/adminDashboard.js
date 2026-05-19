export const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "⌂" },
  { key: "categories", label: "Categories", icon: "□" },
  { key: "orders", label: "Orders", icon: "🛒" },
  { key: "cities", label: "Cities", icon: "▥" },
  { key: "addresses", label: "Addresses", icon: "⌖" },
  { key: "reports", label: "Reports", icon: "⌁" },
  { key: "settings", label: "Settings", icon: "⚙" },
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
