// @ts-nocheck
import { formatDateTime, formatValue, getAddressSummary, joinValues } from "./formatters";

export const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "home" },
  { key: "orders", label: "Pickup Requests", icon: "pickup" },
  { key: "addresses", label: "Customers", icon: "customers" },
  { key: "categories", label: "Scrap Categories", icon: "categories" },
  { key: "field-executives", label: "Field Executives", icon: "executives" },
  { key: "transactions", label: "Transactions", icon: "transactions" },
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

export const getCategoryName = (category, fallback = "Untitled") => category?.category || category?.name || fallback;
export const getSubCategoryName = (subCategory, fallback = "Subcategory") =>
  subCategory?.subCategory || subCategory?.name || subCategory?.categoryName || fallback;

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

export { formatDateTime, formatValue, getAddressSummary, joinValues };
