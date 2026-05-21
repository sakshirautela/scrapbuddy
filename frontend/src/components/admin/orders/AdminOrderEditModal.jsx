import React from "react";

const AdminOrderEditModal = ({ formData, onChange, onCancel, onSave }) => (
  <div className="modal-overlay">
    <div className="modal-box">
      <h2>Update Order</h2>

      <input
        type="datetime-local"
        name="pickupDate"
        value={formData.pickupDate}
        onChange={onChange}
      />

      <select name="status" value={formData.status} onChange={onChange}>
        <option value={true}>Active</option>
        <option value={false}>Cancelled</option>
      </select>

      <div className="modal-actions">
        <button className="save-btn" type="button" onClick={onSave}>
          Save
        </button>
        <button className="cancel-btn" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default AdminOrderEditModal;
