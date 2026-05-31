import { useEffect, useMemo, useState } from "react";
import { getCategoryName } from "../../utils/adminDashboard";
import {
  adminOrderService,
  createCategory,
  createCity,
  createSubCategory,
  deleteCategory,
  deleteCity,
  deleteSubCategory,
  getAdminDashboardData,
  getAdmins,
  getCustomerAddressesAndOrders,
  getOrders,
  updateCategory,
  updateCity,
  updateSubCategory,
} from "../../services/adminDashboardService";

const getStoredUser = () => JSON.parse(localStorage.getItem("user") || "null");

export const useAdminDashboard = (navigate) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
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

  const user = getStoredUser();
  const adminName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  const selectedCategory = useMemo(() => {
    if (selectedCategoryId) {
      return categories.find((category) => String(category.id) === String(selectedCategoryId));
    }

    return categories[0];
  }, [categories, selectedCategoryId]);

  const requireAdminSession = (resourceName) => {
    const token = localStorage.getItem("token");

    if (!token || !user?.id) {
      window.alert(`Please login before managing ${resourceName}`);
      navigate("/login");
      return false;
    }

    return true;
  };

  const replaceOrder = (updatedOrder) => {
    setOrders((current) =>
      current.map((order) =>
        String(order.id) === String(updatedOrder.id) ? updatedOrder : order
      )
    );
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminDashboardData();
      setOrders(data.orders);
      setCategories(data.categories);
      setAddresses(data.addresses);
      setCities(data.cities);
      setAdmins(data.admins);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrders(await getOrders());
    } catch (err) {
      const status = err.response?.status;
      const detail = status ? ` (${status})` : "";
      setError(`Failed to load orders${detail}`);
    }
  };

  const fetchCustomerAddresses = async () => {
    try {
      const data = await getCustomerAddressesAndOrders();
      setAddresses(data.addresses);
      setOrders(data.orders);
    } catch {
      setError("Failed to load customer addresses");
    }
  };

  const fetchAdmins = async () => {
    try {
      setAdmins(await getAdmins());
    } catch {
      setError("Failed to load admins");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }

    if (activeTab === "addresses") {
      fetchCustomerAddresses();
    }
  }, [activeTab]);

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
    localStorage.clear();
    navigate("/");
  };

  const handleCategoryCancel = () => {
    setEditingCategoryId(null);
    setCategoryForm({ category: "" });
  };

  const handleSubCategoryCancel = () => {
    setEditingSubCategoryId(null);
    setSubCategoryForm({ subCategory: "", price: "" });
  };

  const handleCityCancel = () => {
    setEditingCityId(null);
    setCityForm({ name: "" });
  };

  const handleCategorySubmit = async () => {
    if (!requireAdminSession("categories")) {
      return false;
    }

    if (!categoryForm.category.trim()) {
      window.alert("Please enter category name");
      return false;
    }

    try {
      const payload = {
        category: categoryForm.category.trim(),
        createdUserID: Number(user?.id) || 0,
        updatedCategoryID: Number(user?.id) || 0,
      };

      if (editingCategoryId) {
        const updatedCategory = await updateCategory(editingCategoryId, payload);
        setCategories((current) =>
          current.map((category) =>
            String(category.id) === String(editingCategoryId)
              ? { ...updatedCategory, subCategories: category.subCategories || [] }
              : category
          )
        );
      } else {
        const newCategory = await createCategory(payload);
        setCategories((current) => [
          ...current,
          { ...newCategory, subCategories: newCategory.subCategories || [] },
        ]);
        setSelectedCategoryId((current) => current || String(newCategory.id));
      }

      handleCategoryCancel();
      return true;
    } catch (err) {
      window.alert(err.message || "Failed to save category");
      return false;
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
      await deleteCategory(category.id);
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

  const handleSubCategorySubmit = async () => {
    if (!requireAdminSession("subcategories")) {
      return false;
    }

    if (!selectedCategory?.id) {
      window.alert("Please select a parent category");
      return false;
    }

    if (!subCategoryForm.subCategory.trim()) {
      window.alert("Please enter subcategory name");
      return false;
    }

    if (!subCategoryForm.price || Number(subCategoryForm.price) <= 0) {
      window.alert("Please enter a valid price");
      return false;
    }

    try {
      const payload = {
        subCategory: subCategoryForm.subCategory.trim(),
        userId: Number(user.id),
        categoryId: Number(selectedCategory.id),
        price: Number(subCategoryForm.price),
      };

      const savedSubCategory = editingSubCategoryId
        ? await updateSubCategory(editingSubCategoryId, payload)
        : await createSubCategory(payload);

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
                  String(item.id) === String(editingSubCategoryId) ? savedSubCategory : item
                )
              : [...existingItems, savedSubCategory],
          };
        })
      );

      handleSubCategoryCancel();
      return true;
    } catch (err) {
      window.alert(err.message || "Failed to save subcategory");
      return false;
    }
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
      await deleteSubCategory(item.id);
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
        const updatedCity = await updateCity(editingCityId, payload);
        setCities((current) =>
          current.map((cityItem) =>
            String(cityItem.id) === String(editingCityId) ? updatedCity : cityItem
          )
        );
      } else {
        const newCity = await createCity(payload);
        setCities((current) => [...current, newCity]);
        setSelectedState((current) => current || newCity.name || "");
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
      await deleteCity(cityItem.id);
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

  const handleAcceptOrder = async (orderId) => {
    if (!requireAdminSession("orders")) {
      return;
    }

    try {
      const response = await adminOrderService.acceptOrder(orderId);
      replaceOrder(response.data);
      return response.data;
    } catch (err) {
      window.alert(err.message || "Failed to accept order");
      throw err;
    }
  };

  const handleAssignOrder = async (orderId, adminId) => {
    if (!requireAdminSession("orders")) {
      return;
    }

    if (!adminId) {
      window.alert("Please select an admin");
      return;
    }

    try {
      const response = await adminOrderService.assignOrder(orderId, Number(adminId));
      replaceOrder(response.data);
      return response.data;
    } catch (err) {
      window.alert(err.message || "Failed to assign order");
      throw err;
    }
  };

  const handleUnassignOrder = async (orderId) => {
    if (!requireAdminSession("orders")) {
      return;
    }

    try {
      const response = await adminOrderService.unassignOrder(orderId);
      replaceOrder(response.data);
      return response.data;
    } catch (err) {
      window.alert(err.message || "Failed to remove assignment");
      throw err;
    }
  };

  const handleRescheduleOrder = async (orderId, schedule) => {
    if (!requireAdminSession("orders")) {
      return;
    }

    if (!schedule.pickupDate || !schedule.startRange || !schedule.endRange) {
      window.alert("Please enter pickup date and time range");
      return;
    }

    if (schedule.endRange <= schedule.startRange) {
      window.alert("Pickup end time must be after start time");
      return;
    }

    try {
      const response = await adminOrderService.rescheduleOrder(orderId, {
        pickupDate: `${schedule.pickupDate}T${schedule.startRange}:00`,
        startRange: `${schedule.startRange}:00`,
        endRange: `${schedule.endRange}:00`,
      });
      replaceOrder(response.data);
    } catch (err) {
      window.alert(err.message || "Failed to reschedule order");
    }
  };

  const handleSendDeliveryOtp = async (orderId) => {
    if (!requireAdminSession("orders")) {
      return;
    }

    try {
      await adminOrderService.sendDeliveryOtp(orderId);
      setOrders((current) =>
        current.map((order) =>
          String(order.id) === String(orderId)
            ? { ...order, status: "Delivery OTP Sent" }
            : order
        )
      );
      window.alert("Delivery OTP sent to pickup phone and email");
    } catch (err) {
      window.alert(err.message || "Failed to send delivery OTP");
    }
  };

  const handleDeliverOrder = async (orderId, payload) => {
    if (!requireAdminSession("orders")) {
      return;
    }

    const otp = payload?.otp || "";
    const amount = Number(payload?.amount);
    const weight = Number(payload?.weight);

    if (!otp || !otp.trim()) {
      window.alert("Please enter delivery OTP");
      return;
    }

    if (!Number.isFinite(weight) || weight <= 0) {
      window.alert("Please enter final pickup weight");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert("Please enter final order amount");
      return;
    }

    try {
      const response = await adminOrderService.deliverOrder(orderId, {
        otp: otp.trim(),
        amount,
        weight,
      });
      replaceOrder(response.data);
    } catch (err) {
      window.alert(err.message || "Failed to deliver order");
    }
  };

  const categoriesProps = {
    categories,
    selectedCategory,
    selectedCategoryId,
    selectedState,
    categoryForm,
    subCategoryForm,
    editingCategoryId,
    editingSubCategoryId,
    onCategoryFormChange: (name, value) =>
      setCategoryForm((current) => ({ ...current, [name]: value })),
    onSubCategoryFormChange: (name, value) =>
      setSubCategoryForm((current) => ({ ...current, [name]: value })),
    onCategorySubmit: handleCategorySubmit,
    onCategoryCancel: handleCategoryCancel,
    onSubCategorySubmit: handleSubCategorySubmit,
    onSubCategoryCancel: handleSubCategoryCancel,
    onSelectCategory: setSelectedCategoryId,
    onCategoryEdit: handleCategoryEdit,
    onCategoryDelete: handleCategoryDelete,
    onSubCategoryEdit: handleSubCategoryEdit,
    onSubCategoryDelete: handleSubCategoryDelete,
  };

  const ordersProps = {
    orders,
    admins,
    addresses,
    categories,
    currentAdminId: Number(user?.id) || 0,
    onAcceptOrder: handleAcceptOrder,
    onAssignOrder: handleAssignOrder,
    onUnassignOrder: handleUnassignOrder,
    onRescheduleOrder: handleRescheduleOrder,
    onSendDeliveryOtp: handleSendDeliveryOtp,
    onDeliverOrder: handleDeliverOrder,
    onRefreshOrders: fetchOrders,
  };

  const citiesProps = {
    cities,
    addresses,
    cityForm,
    editingCityId,
    onCityFormChange: (value) => setCityForm({ name: value }),
    onCitySubmit: handleCitySubmit,
    onCityCancel: handleCityCancel,
    onCityEdit: handleCityEdit,
    onCityDelete: handleCityDelete,
  };

  return {
    activeTab,
    addresses,
    adminInitial,
    adminName,
    admins,
    categories,
    categoriesProps,
    cities,
    citiesProps,
    error,
    loading,
    ordersProps,
    setActiveTab,
    setShowProfile,
    showProfile,
    user,
    fetchAdmins,
    handleLogout,
  };
};
