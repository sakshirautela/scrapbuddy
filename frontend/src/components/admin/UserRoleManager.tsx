// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import apiClient from "../../utils/apiClient";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  role: "USER",
};

const roleOptions = ["USER", "ADMIN", "SUPER_ADMIN"];

const getDisplayName = (user) =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User";

const UserRoleManager = ({ onUsersChanged }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [roleDrafts, setRoleDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/api/users");
      const nextUsers = Array.isArray(response.data) ? response.data : [];
      setUsers(nextUsers);
      setRoleDrafts(
        nextUsers.reduce((drafts, user) => {
          drafts[user.id] = user.role || "USER";
          return drafts;
        }, {})
      );
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const role = user.role || "USER";
      const haystack = [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        user.username,
        role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (roleFilter !== "all" && role !== roleFilter) {
        return false;
      }

      return !normalizedSearch || haystack.includes(normalizedSearch);
    });
  }, [users, search, roleFilter]);

  const updateForm = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await apiClient.post("/api/users", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });

      setForm(emptyForm);
      setMessage("User created successfully");
      await fetchUsers();
      onUsersChanged?.();
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const updateRole = async (userId) => {
    const nextRole = roleDrafts[userId];
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await apiClient.patch(`/api/users/${userId}/role`, { role: nextRole });
      setMessage("Role updated successfully");
      await fetchUsers();
      onUsersChanged?.();
    } catch (err) {
      setError(err.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-card user-role-card">
      <div className="admin-section-heading">
        <div>
          <span>Access Control</span>
          <h2>Users & Roles</h2>
        </div>
        <p>Create team members and choose whether they can use customer or admin tools.</p>
      </div>

      <form className="user-role-form" onSubmit={createUser}>
        <label>
          <span>First name</span>
          <input
            type="text"
            value={form.firstName}
            onChange={(event) => updateForm("firstName", event.target.value)}
            required
          />
        </label>
        <label>
          <span>Last name</span>
          <input
            type="text"
            value={form.lastName}
            onChange={(event) => updateForm("lastName", event.target.value)}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateForm("email", event.target.value)}
            required
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(event) => updateForm("phone", event.target.value)}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => updateForm("password", event.target.value)}
            minLength={6}
            required
          />
        </label>
        <label>
          <span>Role</span>
          <select value={form.role} onChange={(event) => updateForm("role", event.target.value)}>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <button className="admin-primary" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add User"}
        </button>
      </form>

      {message ? <p className="admin-success-message">{message}</p> : null}
      {error ? <p className="admin-error-message">{error}</p> : null}

      <div className="admin-filter-panel user-role-filters">
        <label className="admin-filter-field admin-filter-search">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, email, phone, role"
          />
        </label>
        <label className="admin-filter-field">
          <span>Role</span>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="all">All roles</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table user-role-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Current Role</th>
              <th>Assign Role</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading users...</td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{getDisplayName(user)}</strong>
                    <span>#{user.id}</span>
                  </td>
                  <td>
                    <strong>{user.email || "-"}</strong>
                    <span>{user.phone || user.username || "-"}</span>
                  </td>
                  <td>
                    <span className="role-pill">{(user.role || "USER").replace("_", " ")}</span>
                  </td>
                  <td>
                    <div className="role-assignment">
                      <select
                        value={roleDrafts[user.id] || user.role || "USER"}
                        onChange={(event) =>
                          setRoleDrafts((current) => ({
                            ...current,
                            [user.id]: event.target.value,
                          }))
                        }
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      <button
                        className="admin-secondary"
                        type="button"
                        disabled={saving || (roleDrafts[user.id] || user.role) === user.role}
                        onClick={() => updateRole(user.id)}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserRoleManager;
