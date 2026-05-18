import api from "./apiInstance";

// UPDATE USER
export const updateUser = async (id, data) => {
  const res = await api.put(`/${id}`, data);
  return res.data;
};

// GET USER BY ID
export const getUserById = async (id) => {
  const res = await api.get(`/id/${id}`);
  return res.data;
};

// GET CURRENT USER (FIXED)
export const getCurrentUser = async () => {
  const res = await api.get(`/token`);
  return res.data;
};

// DELETE USER
export const deleteUser = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
