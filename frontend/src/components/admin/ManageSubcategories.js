import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSub, setNewSub] = useState({ subCategory: '', categoryId: '', price: '' });
  const [editSub, setEditSub] = useState(null);

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/api/subcategories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/api/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:8080/auth/api/subcategories', { ...newSub, userId: 3 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewSub({ subCategory: '', categoryId: '', price: '' });
      fetchSubcategories();
    } catch (error) {
      console.error('Error creating subcategory', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:8080/auth/api/subcategories/${id}`, editSub, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditSub(null);
      fetchSubcategories();
    } catch (error) {
      console.error('Error updating subcategory', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSubcategories();
    } catch (error) {
      console.error('Error deleting subcategory', error);
    }
  };

  return (
    <div>
      <h2>Manage Subcategories</h2>
      <input
        type="text"
        placeholder="Subcategory"
        value={newSub.subCategory}
        onChange={(e) => setNewSub({ ...newSub, subCategory: e.target.value })}
      />
      <select value={newSub.categoryId} onChange={(e) => setNewSub({ ...newSub, categoryId: e.target.value })}>
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
      </select>
      <input
        type="number"
        placeholder="Price"
        value={newSub.price}
        onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
      />
      <button onClick={handleCreate}>Create</button>
      <ul>
        {subcategories.map(sub => (
          <li key={sub.id}>
            {editSub && editSub.id === sub.id ? (
              <div>
                <input
                  type="text"
                  value={editSub.subCategory}
                  onChange={(e) => setEditSub({ ...editSub, subCategory: e.target.value })}
                />
                <select value={editSub.categoryId} onChange={(e) => setEditSub({ ...editSub, categoryId: e.target.value })}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                </select>
                <input
                  type="number"
                  value={editSub.price}
                  onChange={(e) => setEditSub({ ...editSub, price: e.target.value })}
                />
                <button onClick={() => handleUpdate(sub.id)}>Save</button>
                <button onClick={() => setEditSub(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {sub.subCategory} - {sub.price}
                <button onClick={() => setEditSub(sub)}>Edit</button>
                <button onClick={() => handleDelete(sub.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSubcategories;