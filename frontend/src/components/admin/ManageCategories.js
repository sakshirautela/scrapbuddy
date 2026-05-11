import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      await axios.post('http://localhost:8080/auth/api/categories', { category: newCategory, createdUserID: 1 }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error creating category', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:8080/auth/api/categories/${id}`, { userId: 1, category: editCategory.category }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/id=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category', error);
    }
  };

  return (
    <div>
      <h2>Manage Categories</h2>
      <input
        type="text"
        placeholder="New Category"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            {editCategory && editCategory.id === cat.id ? (
              <div>
                <input
                  type="text"
                  value={editCategory.category}
                  onChange={(e) => setEditCategory({ ...editCategory, category: e.target.value })}
                />
                <button onClick={() => handleUpdate(cat.id)}>Save</button>
                <button onClick={() => setEditCategory(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {cat.category}
                <button onClick={() => setEditCategory(cat)}>Edit</button>
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCategories;