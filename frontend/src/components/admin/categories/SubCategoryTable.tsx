// @ts-nocheck
import React from "react";
import { getRateIcon } from "../../../utils/adminDashboard";

const SubCategoryTable = ({
  items,
  selectedCategoryName,
  openActionMenu,
  onSubCategoryAction,
  onToggleActionMenu,
}) => {
  if (items.length === 0) {
    return (
      <div className="empty-rate-state">
        <h3>No subcategories in {selectedCategoryName}</h3>
        <p>Add a subcategory to show rate cards here.</p>
      </div>
    );
  }

  return (
    <div className="rate-items-table subcategory-tree-panel">
      <header className="subcategory-tree-header">
        <div>
          <span className="subcategory-tree-eyebrow">Selected category</span>
          <h3>{selectedCategoryName}</h3>
        </div>
        <strong>
          {items.length} {items.length === 1 ? "subcategory" : "subcategories"}
        </strong>
      </header>

      <div className="subcategory-tree-list">
        {items.map((item) => {
          const itemName = item.subCategory || "Scrap item";

          return (
            <article className="subcategory-node" key={item.id}>
              <div className="subcategory-node-main">
                <span className="item-icon">{getRateIcon(itemName)}</span>
                <div>
                  <strong>{itemName}</strong>
                  <small>Rate per kg</small>
                </div>
              </div>
              <span className="item-price">₹ {Number(item.price || 0)}</span>
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
            </article>
          );
        })}
      </div>

      <footer>
        <span>
          Showing {items.length} of {items.length} {items.length === 1 ? "subcategory" : "subcategories"}
        </span>
      </footer>
    </div>
  );
};

export default SubCategoryTable;
