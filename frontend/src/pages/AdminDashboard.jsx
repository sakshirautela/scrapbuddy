import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import cityApi from "../api/cityApi";
import "../styles/AdminDashboard.css";
import ProfileDashboard from "./UserDetails";
const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "⌂" },
  { key: "categories", label: "Categories", icon: "□" },
  { key: "orders", label: "Orders", icon: "🛒" },
  { key: "cities", label: "Cities", icon: "▥" },
  { key: "addresses", label: "Addresses", icon: "⌖" },
  { key: "reports", label: "Reports", icon: "⌁" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

const getCategoryName = (category) => category?.category || category?.name || "Untitled";

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

const getCategoryIcon = (name) => {
  const key = String(name || "").toLowerCase();
  const iconKey = Object.keys(categoryIconMap).find((item) => key.includes(item));
  return iconKey ? categoryIconMap[iconKey] : "♻";
};

const getRateIcon = (name) => {
  const key = String(name || "").toLowerCase();
  const iconKey = Object.keys(rateIconMap).find((item) => key.includes(item));
  return iconKey ? rateIconMap[iconKey] : "♻";
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("categories");
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cities, setCities] = useState([]);
  const [categoryForm, setCategoryForm] = useState({
    category: "",
  });
  const [subCategoryForm, setSubCategoryForm] = useState({
    subCategory: "",
    price: "",
  });
  const [cityForm, setCityForm] = useState({
    name: "",
  });
  const [editingCityId, setEditingCityId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const adminName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  useEffect(() => {
    fetchAll();
  }, []);
const handleSwitchProfile = () => {
  <ProfileDashboard />
};
  const fetchAll = async () => {
    setLoading(true);
    setError("");

    const settle = async (request, fallback = []) => {
      try {
        const response = await request();
        return Array.isArray(response.data) ? response.data : fallback;
      } catch (err) {
        console.error(err);
        return fallback;
      }
    };

    try {
      const [ordersData, categoriesData, addressesData, citiesData] = await Promise.all([
        settle(() => apiClient.get("/api/orders")),
        settle(() => apiClient.get("/api/categories/with-subcategories")),
        settle(() => apiClient.get("/api/addresses")),
        cityApi.getCities(),
      ]);

      setOrders(ordersData);
      setCategories(categoriesData);
      setAddresses(addressesData);
      setCities(citiesData);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const totalSubCategories = useMemo(() => {
    return categories.reduce((total, category) => total + (category.subCategories || []).length, 0);
  }, [categories]);

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId) {
      return categories.find((category) => String(category.id) === String(selectedCategoryId));
    }
    return categories[0];
  }, [categories, selectedCategoryId]);

  const rateItems = selectedCategory?.subCategories || [];

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(String(categories[0].id));
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (!selectedState && cities.length > 0) {
      setSelectedState(cities[0]?.name || "");
    }
  }, [cities, selectedState]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const requireAdminSession = (resourceName) => {
    const token = localStorage.getItem("token");

    if (!token || !user?.id) {
      window.alert(`Please login before managing ${resourceName}`);
      navigate("/login");
      return false;
    }

    return true;
  };

  const handleCategoryAdd = async () => {
    if (!requireAdminSession("categories")) {
      return;
    }

    if (!categoryForm.category.trim()) {
      window.alert("Please enter category name");
      return;
    }

    try {
      const payload = {
        category: categoryForm.category.trim(),
        createdUserID: Number(user?.id),
        updatedCategoryID: Number(user?.id),
      };

      const response = await apiClient.post("/api/categories", payload);
      setCategories((current) => [...current, response.data]);
      setCategoryForm({
        category: "",
      });
    } catch (err) {
      window.alert(err.message || "Failed to add category");
    }
  };

  const handleSubCategoryAdd = async () => {
    if (!requireAdminSession("subcategories")) {
      return;
    }

    if (!selectedCategory?.id) {
      window.alert("Please select a parent category");
      return;
    }

    if (!subCategoryForm.subCategory.trim()) {
      window.alert("Please enter subcategory name");
      return;
    }

    if (!subCategoryForm.price || Number(subCategoryForm.price) <= 0) {
      window.alert("Please enter a valid price");
      return;
    }

    try {
      const payload = {
        subCategory: subCategoryForm.subCategory.trim(),
        userId: Number(user.id),
        categoryId: Number(selectedCategory.id),
        price: Number(subCategoryForm.price),
      };

      const response = await apiClient.post("/api/subcategories", payload);

      setCategories((current) =>
        current.map((category) => {
          if (String(category.id) !== String(selectedCategory.id)) {
            return category;
          }

          return {
            ...category,
            subCategories: [...(category.subCategories || []), response.data],
          };
        })
      );

      setSubCategoryForm({
        subCategory: "",
        price: "",
      });
    } catch (err) {
      window.alert(err.message || "Failed to add subcategory");
    }
  };

  const handleCitySubmit = async () => {
    if (!requireAdminSession("cities")) {
      return;
    }

    if (!cityForm.name.trim()) {
      window.alert("Please enter city name");
      return;
    }

    try {
      const payload = {
        name: cityForm.name.trim(),
      };

      if (editingCityId) {
        const updatedCity = await cityApi.updateCity(editingCityId, payload);
        setCities((current) =>
          current.map((cityItem) =>
            String(cityItem.id) === String(editingCityId) ? updatedCity : cityItem
          )
        );
      } else {
        const createdCity = await cityApi.createCity(payload);
        setCities((current) => [...current, createdCity]);
        setSelectedState((current) => current || createdCity.name || "");
      }

      setCityForm({
        name: "",
      });
      setEditingCityId(null);
    } catch (err) {
      window.alert(err.message || "Failed to save city");
    }
  };

  const handleCityEdit = (cityItem) => {
    setEditingCityId(cityItem.id);
    setCityForm({
      name: cityItem.name || "",
    });
  };

  const handleCityDelete = async (cityItem) => {
    if (!requireAdminSession("cities")) {
      return;
    }

    const cityName = cityItem.name || "this city";
    const shouldDelete = window.confirm(`Delete ${cityName}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await cityApi.deleteCity(cityItem.id);
      setCities((current) => current.filter((city) => city.id !== cityItem.id));

      if (selectedState === cityItem.name) {
        const nextCity = cities.find((city) => city.id !== cityItem.id);
        setSelectedState(nextCity?.name || "");
      }

      if (editingCityId === cityItem.id) {
        setEditingCityId(null);
        setCityForm({
          name: "",
        });
      }
    } catch (err) {
      window.alert(err.message || "Failed to delete city");
    }
  };

  const handleCityCancel = () => {
    setEditingCityId(null);
    setCityForm({
      name: "",
    });
  };

  const renderCategories = () => (
    <section className="rate-admin-page">
      <header className="rate-admin-header">
        <div>
          <h2>Rates</h2>
          <p>{categories.length} categories · {totalSubCategories} rate items · {selectedState || "No city selected"}</p>
        </div>
        <div className="rate-admin-actions">
          <input
            type="text"
            name="category"
            placeholder="Category name"
            value={categoryForm.category}
            onChange={(event) =>
              setCategoryForm((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
          />
          <button type="button" onClick={handleCategoryAdd}>Add Category</button>
          <input
            type="text"
            name="subCategory"
            placeholder="Subcategory name"
            value={subCategoryForm.subCategory}
            onChange={(event) =>
              setSubCategoryForm((current) => ({
                ...current,
                subCategory: event.target.value,
              }))
            }
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            min="1"
            value={subCategoryForm.price}
            onChange={(event) =>
              setSubCategoryForm((current) => ({
                ...current,
                price: event.target.value,
              }))
            }
          />
          <button type="button" onClick={handleSubCategoryAdd}>
            Add Subcategory
          </button>
        </div>
      </header>

      <div className="rate-layout">
        <aside className="rate-category-panel">
          <select
            className="state-select"
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value)}
            aria-label="Select state"
          >
            {cities.length === 0 ? (
              <option value="">No cities configured</option>
            ) : (
              cities.map((cityItem) => (
                <option key={cityItem.id || cityItem.name} value={cityItem.name}>
                  {cityItem.name}
                </option>
              ))
            )}
          </select>

          <div className="rate-category-list">
            {categories.length === 0 ? (
              <p className="empty-copy">No categories found.</p>
            ) : (
              categories.map((category) => {
                const isActive = String(category.id) === String(selectedCategory?.id);
                const name = getCategoryName(category);
                return (
                  <button
                    key={category.id}
                    className={isActive ? "rate-category active" : "rate-category"}
                    type="button"
                    onClick={() => setSelectedCategoryId(String(category.id))}
                  >
                    <span className="rate-category-icon">{getCategoryIcon(name)}</span>
                    <span>
                      <strong>{name}</strong>
                      {name.toLowerCase().includes("furniture") ? <small>Resell Only</small> : null}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="rate-content-panel">
          <div className="minimum-banner">Minimum Pickup Value Must Be Rs:200/-</div>

          {rateItems.length === 0 ? (
            <div className="empty-rate-state">
              <h3>No rates in {getCategoryName(selectedCategory)}</h3>
              <p>Add subcategories from backend/admin tools to show rate cards here.</p>
            </div>
          ) : (
            <div className="rate-card-grid">
              {rateItems.map((item) => {
                const itemName = item.subCategory || "Scrap item";
                return (
                  <article className="scrap-rate-card" key={item.id}>
                    <div className="scrap-illustration" aria-hidden="true">
                      {getRateIcon(itemName)}
                    </div>
                    <h3>{itemName}</h3>
                    <p className="scrap-rate">
                      ₹ {Number(item.price || 0)}
                      <span>/kg</span>
                    </p>
                    <div className="scrap-card-divider" />
                    <div className="scrap-card-actions">
                      <button className="call-action" type="button" aria-label={`Call for ${itemName}`}>☎</button>
                      <button className="whatsapp-action" type="button" aria-label={`WhatsApp for ${itemName}`}>◔</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <button className="floating-whatsapp" type="button" aria-label="WhatsApp support">☎</button>
      <div className="need-help-card">Need Help</div>
      <div className="support-avatar" aria-hidden="true">👨‍💼</div>
    </section>
  );

  const renderOrders = () => (
    <section className="admin-card table-card">
      <h2>Orders</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Pickup Date</th>
              <th>Receiver</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5">No Orders Found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td><span className="active-pill">{order.status ? "Completed" : "Scheduled"}</span></td>
                  <td>{order.pickupDate || "-"}</td>
                  <td>{order.address?.receiverFirstName || "-"}</td>
                  <td>{order.address?.city || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderCities = () => (
    <section className="admin-card table-card">
      <div className="table-title-row">
        <h2>Cities</h2>
      </div>

      <div className="rate-admin-actions">
        <input
          type="text"
          name="name"
          placeholder="City name"
          value={cityForm.name}
          onChange={(event) =>
            setCityForm({
              name: event.target.value,
            })
          }
        />
        <button type="button" onClick={handleCitySubmit}>
          {editingCityId ? "Update City" : "Add City"}
        </button>
        {editingCityId ? (
          <button type="button" onClick={handleCityCancel}>
            Cancel
          </button>
        ) : null}
      </div>

      <div className="city-grid">
        {cities.length === 0 ? (
          <p>No Cities Found</p>
        ) : (
          cities.map((cityItem) => (
            <article className="city-card-admin" key={cityItem.id || cityItem.name}>
              <strong>{cityItem.name || "Unnamed city"}</strong>
              <span>{addresses.filter((address) => address.city === cityItem.name).length} addresses</span>
              <div className="action-buttons">
                <button type="button" onClick={() => handleCityEdit(cityItem)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleCityDelete(cityItem)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );

  const renderAddresses = () => (
    <section className="admin-card table-card">
      <h2>Addresses</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Receiver</th>
              <th>Phone</th>
              <th>City</th>
              <th>Zip</th>
            </tr>
          </thead>
          <tbody>
            {addresses.length === 0 ? (
              <tr><td colSpan="4">No Addresses Found</td></tr>
            ) : (
              addresses.map((address) => (
                <tr key={address.id}>
                  <td>{address.receiverFirstName || "-"}</td>
                  <td>{address.receiverPhone || "-"}</td>
                  <td>{address.city || "-"}</td>
                  <td>{address.zip || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderMainContent = () => {
    if (loading) {
      return <section className="admin-card loading-card">Loading admin data...</section>;
    }

    if (error) {
      return <section className="admin-card error-card">{error}</section>;
    }

    if (activeTab === "categories" || activeTab === "dashboard") {
      return renderCategories();
    }
    if (activeTab === "orders") {
      return renderOrders();
    }
    if (activeTab === "cities") {
      return renderCities();
    }
    if (activeTab === "addresses") {
      return renderAddresses();
    }

    return (
      <section className="admin-card empty-panel">
        <h2>{menuItems.find((item) => item.key === activeTab)?.label}</h2>
        <p>This section is ready for backend data.</p>
      </section>
    );
  };

  return (
    <div className="shop-admin-layout">
      <aside className="shop-sidebar">
        <div className="shop-brand">
          <span className="brand-bag">▣</span>
          <strong>ShopAdmin</strong>
        </div>

        <nav>
          <span className="nav-label">Management</span>
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              type="button"
              onClick={() => setActiveTab(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="shop-main">
        <header className="shop-topbar">
          <div className="topbar-left">
            <button className="menu-button" type="button">☰</button>
            <h1>{menuItems.find((item) => item.key === activeTab)?.label || "Dashboard"}</h1>
          </div>

          <div className="topbar-right">
            <button className="notification-button" type="button">
              ♢
              <span>5</span>
            </button>
            <div className="admin-profile-menu">
              <button
                className="admin-profile-trigger"
                type="button"
                onClick={() => setShowProfile((current) => !current)}
                aria-expanded={showProfile}
                aria-haspopup="menu"
              >
                <span className="admin-avatar">{adminInitial}</span>
                <span className="admin-user">{adminName}</span>
                <span>⌄</span>
              </button>

              {showProfile ? (
                <div className="admin-profile-dropdown" role="menu">
                  <div className="profile-dropdown-header">
                    <span className="admin-avatar profile-large">{adminInitial}</span>
                    <div>
                      <strong>{adminName}</strong>
                      <p>{user?.email || "No email added"}</p>
                    </div>
                  </div>
                  <dl className="profile-details">
                    <div>
                      <button className="-profile-button" type="button" onClick={handleSwitchProfile}> Profile</button>
                    </div>
                    <div>
                      <dt>Username</dt>
                      <dd>{user?.username || "-"}</dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{user?.phone || "-"}</dd>
                    </div>
                    <div>
                      <dt>Role</dt>
                      <dd>{user?.role || "Admin"}</dd>
                    </div>
                  </dl>
                  <button className="profile-logout" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="shop-content">
          {renderMainContent()}
        </main>
      </section>
    </div>
  );
};

export default AdminDashboard;
