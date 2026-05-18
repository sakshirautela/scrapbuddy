import React, {
  useEffect,
  useState,
} from "react";
import categoryApi from "../api/categoryApi";
import {
  useNavigate,
} from "react-router-dom";

import ordersApi from "../api/orderApi";

import DashboardCards
  from "../components/admin/DashboardCards";

import OrdersTable
  from "../components/admin/OrdersTable";

import UsersTable
  from "../components/admin/UsersTable";

import CategoriesTable
  from "../components/admin/CategoriesTable";

import CitiesTable
  from "../components/admin/CitiesTable";

import AddressesTable
  from "../components/admin/AddressesTable";

import UserModal
  from "../components/admin/UserModal";

import "../styles/SuperAdminDashboard.css";

const SuperAdminDashboard = () => {

  const navigate =
    useNavigate();

  const [activeTab,
    setActiveTab] =
    useState("dashboard");

  const [orders,
    setOrders] =
    useState([]);

  const [categories,
    setCategories] =
    useState([]);

  const [cities,
    setCities] =
    useState([]);

  const [addresses,
    setAddresses] =
    useState([]);

  const [users,
    setUsers] =
    useState([]);

  const [openUserModal,
    setOpenUserModal] =
    useState(false);

  const [editMode,
    setEditMode] =
    useState(false);

  const [currentUser,
    setCurrentUser] =
    useState({

      id: null,

      name: "",

      email: "",

      password: "",

      role: "USER",

    });

  useEffect(() => {

    fetchAll();

  }, []);

  const fetchAll =
    async () => {

      try {

        const [
          o,
          c,
          ci,
          a,
          u,
        ] = await Promise.all([
          ordersApi.getAllOrders(),
          categoryApi.getAllCategoryWithSubcategories(),
          // citiesApi.getAll(),

          // addressesApi.getAll(),

          // usersApi.getAll(),  

        ]);

        setOrders(o.data || []);

        setCategories(c.data || []);

        setCities(ci.data || []);

        setAddresses(a.data || []);

        setUsers(u.data || []);

      } catch (error) {

        console.error(error);

      }
    };

  const handleLogout = () => {

    localStorage.removeItem(
      "user"
    );

    navigate("/");

  };

  // CREATE USER
  const createUser =
    async () => {

      try {

        // await usersApi.create(
        //   currentUser
        // );

        // fetchAll();

        // closeModal();

      } catch (error) {

        console.error(error);

      }
    };

  // UPDATE USER
  const updateUser =
    async () => {

      try {

        // await usersApi.update(
        //   currentUser.id,
        //   currentUser
        // );

        // fetchAll();

        // closeModal();

      } catch (error) {

        console.error(error);

      }
    };

  // DELETE USER
  const deleteUser =
    async (id) => {

      try {

        // await usersApi.delete(id);

        // fetchAll();

      } catch (error) {

        console.error(error);

      }
    };

  const editUser = (
    user
  ) => {

    setCurrentUser(user);

    setEditMode(true);

    setOpenUserModal(true);

  };

  const closeModal = () => {

    setCurrentUser({

      id: null,

      name: "",

      email: "",

      password: "",

      role: "USER",

    });

    setEditMode(false);

    setOpenUserModal(false);

  };

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <h2>
          ADMIN PANEL
        </h2>

        <button
          onClick={() =>
            setActiveTab("dashboard")
          }
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            setActiveTab("orders")
          }
        >
          Orders
        </button>

        <button
          onClick={() =>
            setActiveTab("users")
          }
        >
          Users
        </button>

        <button
          onClick={() =>
            setActiveTab("categories")
          }
        >
          Categories
        </button>

        <button
          onClick={() =>
            setActiveTab("cities")
          }
        >
          Cities
        </button>

        <button
          onClick={() =>
            setActiveTab("addresses")
          }
        >
          Addresses
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="main-content">

        {activeTab ===
          "dashboard" && (

          <DashboardCards
            orders={orders}
            users={users}
            categories={categories}
            cities={cities}
          />

        )}

        {activeTab ===
          "orders" && (

          <OrdersTable
            orders={orders}
          />

        )}

        {activeTab ===
          "users" && (

          <UsersTable
            users={users}
            onEdit={editUser}
            onDelete={deleteUser}
            onAdd={() =>
              setOpenUserModal(true)
            }
          />

        )}

        {activeTab ===
          "categories" && (

          <CategoriesTable
            categories={categories}
          />

        )}

        {activeTab ===
          "cities" && (

          <CitiesTable
            cities={cities}
          />

        )}

        {activeTab ===
          "addresses" && (

          <AddressesTable
            addresses={addresses}
          />

        )}

      </main>

      {/* MODAL */}
      {openUserModal && (

        <UserModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          editMode={editMode}
          onClose={closeModal}
          onSubmit={
            editMode
              ? updateUser
              : createUser
          }
        />

      )}

    </div>
  );
};

export default SuperAdminDashboard;