import React, { useState } from 'react';
import axios from 'axios';

const CreateOrder = () => {
  const [order, setOrder] = useState({
    itemName: '',
    category: '',
    quantity: '',
    phone: '',
    date: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addrField = name.split('.')[1];
      setOrder({ ...order, address: { ...order.address, [addrField]: value } });
    } else {
      setOrder({ ...order, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/api/schedule/new', order, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Order created successfully');
      setOrder({
        itemName: '',
        category: '',
        quantity: '',
        phone: '',
        date: '',
        address: {
          street: '',
          city: '',
          state: '',
          pincode: ''
        }
      });
    } catch (error) {
      alert('Failed to create order');
    }
  };

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <input name="itemName" placeholder="Item Name" value={order.itemName} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={order.category} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Quantity" value={order.quantity} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={order.phone} onChange={handleChange} required />
        <input name="date" type="date" value={order.date} onChange={handleChange} required />
        <input name="address.street" placeholder="Street" value={order.address.street} onChange={handleChange} required />
        <input name="address.city" placeholder="City" value={order.address.city} onChange={handleChange} required />
        <input name="address.state" placeholder="State" value={order.address.state} onChange={handleChange} required />
        <input name="address.pincode" placeholder="Pincode" value={order.address.pincode} onChange={handleChange} required />
        <button type="submit">Create Order</button>
      </form>
    </div>
  );
};

export default CreateOrder;