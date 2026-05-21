import React from "react";
import { getRateIcon } from "../../../utils/adminDashboard";

const SubCategoryTable = ({
  items,
  selectedCategoryName,
  showSubCategoryForm,
  subCategoryForm,
  editingSubCategoryId,
  openActionMenu,
  onSubCategoryFormChange,
  onSubCategorySubmit,
  onSubCategoryCancel,
  onSubCategoryAction,
  onToggleActionMenu,
}) => {
  if (items.length === 0 && !showSubCategoryForm) {
    return (
      <div className="empty-rate-state">
        <h3>No rates in {selectedCategoryName}</h3>
        <p>Add a subcategory to show rate cards here.</p>
      </div>
    );
  }

  return (
    <div className="rate-items-table">
      <header>
        <h3>Items in {selectedCategoryName}</h3>
      </header>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price (per kg)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {showSubCategoryForm ? (
            <tr className="subcategory-create-row">
              <td>
                <span className="item-icon">+</span>
                <input
                  type="text"
                  name="subCategory"
                  placeholder="Subcategory name"
                  value={subCategoryForm.subCategory}
                  onChange={(event) => onSubCategoryFormChange("subCategory", event.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  min="1"
                  value={subCategoryForm.price}
                  onChange={(event) => onSubCategoryFormChange("price", event.target.value)}
                />
              </td>
              <td>
                <div className="rate-item-actions subcategory-create-actions">
                  <button className="admin-primary" type="button" onClick={onSubCategorySubmit}>
                    {editingSubCategoryId ? "Update" : "Add"}
                  </button>
                  <button className="admin-secondary" type="button" onClick={onSubCategoryCancel}>
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          ) : null}

          {items.map((item) => {
            const itemName = item.subCategory || "Scrap item";

            return (
              <tr key={item.id}>
                <td>
                  <span className="item-icon">{getRateIcon(itemName)}</span>
                  <strong>{itemName}</strong>
                </td>
                <td className="item-price">₹ {Number(item.price || 0)}</td>
                <td>
                  <div className="rate-item-actions">
                    <button
                      type="button"
                      aria-label={`Open actions for ${itemName}`}
                      aria-expanded={openActionMenu === `item-${item.id}`}
                      onClick={() => onToggleActionMenu("item", item.id)}
                    >
                      ⋮
                    </button>
                    {openActionMenu === `item-${item.id}` ? (
                      <div className="row-action-menu" role="menu">
                        <button type="button" role="menuitem" onClick={() => onSubCategoryAction("edit", item)}>
                          Edit
                        </button>
                        <button type="button" role="menuitem" onClick={() => onSubCategoryAction("delete", item)}>
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <footer>
        <span>
          Showing {items.length} of {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        <div>
          <button type="button">←</button>
          <strong>1</strong>
          <button type="button">→</button>
        </div>
      </footer>
    </div>
  );
};

export default SubCategoryTable;
