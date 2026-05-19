import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressesTable from "../components/admin/AddressesTable";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import CategoriesManager from "../components/admin/CategoriesManager";
import CitiesManager from "../components/admin/CitiesManager";
import OrdersTable from "../components/admin/OrdersTable";
import apiClient from "../utils/apiClient";
import cityApi from "../api/cityApi";
import { getCategoryName, menuItems } from "../utils/adminDashboard";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("categories");
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cities, setCities] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ category: "" });
  const [subCategoryForm, setSubCategoryForm] = useState({ subCategory: "", price: "" });
  const [cityForm, setCityForm] = useState({ name: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
  const [editingCityId, setEditingCityId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const adminName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const totalSubCategories = useMemo(
    () => categories.reduce((total, category) => total + (category.subCategories || []).length, 0),
    [categories]
  );

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId) {
      return categories.find((category) => String(category.id) === String(selectedCategoryId));
    }

    return categories[0];
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    fetchAll();
  }, []);

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

  const requireAdminSession = (resourceName) => {
    const token = localStorage.getItem("token");

    if (!token || !user?.id) {
      window.alert(`Please login before managing ${resourceName}`);
      navigate("/login");
      return false;
    }

    return true;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCategorySubmit = async () => {
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

      if (editingCategoryId) {
        const response = await apiClient.put(`/api/categories/${editingCategoryId}`, payload);
        setCategories((current) =>
          current.map((category) =>
            String(category.id) === String(editingCategoryId)
              ? { ...response.data, subCategories: category.subCategories || [] }
              : category
          )
        );
      } else {
        const response = await apiClient.post("/api/categories", payload);
        setCategories((current) => [
          ...current,
          { ...response.data, subCategories: response.data.subCategories || [] },
        ]);
        setSelectedCategoryId((current) => current || String(response.data.id));
      }

      handleCategoryCancel();
    } catch (err) {
      window.alert(err.message || "Failed to save category");
    }
  };

  const handleSubCategorySubmit = async () => {
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

      const response = editingSubCategoryId
        ? await apiClient.put(`/api/subcategories/${editingSubCategoryId}`, payload)
        : await apiClient.post("/api/subcategories", payload);

      setCategories((current) =>
        current.map((category) => {
          if (String(category.id) !== String(selectedCategory.id)) {
            return category;
          }

          const existingItems = category.subCategories || [];

          return {
            ...category,
            subCategories: editingSubCategoryId
              ? existingItems.map((item) =>
                  String(item.id) === String(editingSubCategoryId) ? response.data : item
                )
              : [...existingItems, response.data],
          };
        })
      );

      handleSubCategoryCancel();
    } catch (err) {
      window.alert(err.message || "Failed to save subcategory");
    }
  };

  const handleCategoryEdit = (category) => {
    setSelectedCategoryId(String(category.id));
    setEditingCategoryId(category.id);
    setCategoryForm({ category: getCategoryName(category) });
  };

  const handleCategoryDelete = async (category) => {
    if (!requireAdminSession("categories")) {
      return;
    }

    const categoryName = getCategoryName(category);
    const shouldDelete = window.confirm(`Delete ${categoryName} and its subcategories?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await apiClient.delete(`/api/categories/${category.id}`);
      setCategories((current) => current.filter((item) => String(item.id) !== String(category.id)));

      if (String(selectedCategoryId) === String(category.id)) {
        const nextCategory = categories.find((item) => String(item.id) !== String(category.id));
        setSelectedCategoryId(nextCategory ? String(nextCategory.id) : "");
      }

      if (String(editingCategoryId) === String(category.id)) {
        handleCategoryCancel();
      }
    } catch (err) {
      window.alert(err.message || "Failed to delete category");
    }
  };

  const handleCategoryCancel = () => {
    setEditingCategoryId(null);
    setCategoryForm({ category: "" });
  };

  const handleSubCategoryEdit = (item) => {
    setEditingSubCategoryId(item.id);
    setSelectedCategoryId(String(item.categoryId || selectedCategory?.id || ""));
    setSubCategoryForm({
      subCategory: item.subCategory || "",
      price: item.price || "",
    });
  };

  const handleSubCategoryDelete = async (item) => {
    if (!requireAdminSession("subcategories")) {
      return;
    }

    const itemName = item.subCategory || "this subcategory";
    const shouldDelete = window.confirm(`Delete ${itemName}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await apiClient.delete(`/api/subcategories/${item.id}`);
      setCategories((current) =>
        current.map((category) => ({
          ...category,
          subCategories: (category.subCategories || []).filter(
            (subCategory) => String(subCategory.id) !== String(item.id)
          ),
        }))
      );

      if (String(editingSubCategoryId) === String(item.id)) {
        handleSubCategoryCancel();
      }
    } catch (err) {
      window.alert(err.message || "Failed to delete subcategory");
    }
  };

  const handleSubCategoryCancel = () => {
    setEditingSubCategoryId(null);
    setSubCategoryForm({ subCategory: "", price: "" });
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
      const payload = { name: cityForm.name.trim() };

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

      handleCityCancel();
    } catch (err) {
      window.alert(err.message || "Failed to save city");
    }
  };

  const handleCityEdit = (cityItem) => {
    setEditingCityId(cityItem.id);
    setCityForm({ name: cityItem.name || "" });
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
        handleCityCancel();
      }
    } catch (err) {
      window.alert(err.message || "Failed to delete city");
    }
  };

  const handleCityCancel = () => {
    setEditingCityId(null);
    setCityForm({ name: "" });
  };

  const renderMainContent = () => {
    if (loading) {
      return <section className="admin-card loading-card">Loading admin data...</section>;
    }

    if (error) {
      return <section className="admin-card error-card">{error}</section>;
    }

    if (activeTab === "categories" || activeTab === "dashboard") {
      return (
        <CategoriesManager
          categories={categories}
          cities={cities}
          selectedCategory={selectedCategory}
          selectedCategoryId={selectedCategoryId}
          selectedState={selectedState}
          totalSubCategories={totalSubCategories}
          categoryForm={categoryForm}
          subCategoryForm={subCategoryForm}
          editingCategoryId={editingCategoryId}
          editingSubCategoryId={editingSubCategoryId}
          onCategoryFormChange={(name, value) =>
            setCategoryForm((current) => ({ ...current, [name]: value }))
          }
          onSubCategoryFormChange={(name, value) =>
            setSubCategoryForm((current) => ({ ...current, [name]: value }))
          }
          onCategorySubmit={handleCategorySubmit}
          onCategoryCancel={handleCategoryCancel}
          onSubCategorySubmit={handleSubCategorySubmit}
          onSubCategoryCancel={handleSubCategoryCancel}
          onSelectCategory={setSelectedCategoryId}
          onSelectState={setSelectedState}
          onCategoryEdit={handleCategoryEdit}
          onCategoryDelete={handleCategoryDelete}
          onSubCategoryEdit={handleSubCategoryEdit}
          onSubCategoryDelete={handleSubCategoryDelete}
        />
      );
    }

    if (activeTab === "orders") {
      return <OrdersTable orders={orders} categories={categories} />;
    }

    if (activeTab === "cities") {
      return (
        <CitiesManager
          cities={cities}
          addresses={addresses}
          cityForm={cityForm}
          editingCityId={editingCityId}
          onCityFormChange={(value) => setCityForm({ name: value })}
          onCitySubmit={handleCitySubmit}
          onCityCancel={handleCityCancel}
          onCityEdit={handleCityEdit}
          onCityDelete={handleCityDelete}
        />
      );
    }

    if (activeTab === "addresses") {
      return <AddressesTable addresses={addresses} />;
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
      <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <section className="shop-main">
        <AdminTopbar
          activeTab={activeTab}
          adminInitial={adminInitial}
          adminName={adminName}
          showProfile={showProfile}
          user={user}
          onToggleProfile={() => setShowProfile((current) => !current)}
          onOpenProfile={() => navigate("/user")}
          onLogout={handleLogout}
        />

        <main className="shop-content">
          {renderMainContent()}
        </main>
      </section>
    </div>
  );
};

export default AdminDashboard;
