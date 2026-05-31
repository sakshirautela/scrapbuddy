// @ts-nocheck
import React from "react";
import { getCategoryIcon, getCategoryName } from "../../../utils/adminDashboard";

const CategoryList = ({
  categories,
  selectedCategoryId,
  openActionMenu,
  onCategoryAction,
  onSelectCategory,
  onToggleActionMenu,
}) => (
  <div className="rate-category-list">
    {categories.length === 0 ? (
      <p className="empty-copy">No categories found.</p>
    ) : (
      categories.map((category) => {
        const isActive = String(category.id) === String(selectedCategoryId);
        const name = getCategoryName(category);
        const subCategories = category.subCategories || [];
        const itemCount = subCategories.length;

        return (
          <div className="rate-category-row" key={category.id}>
            <button
              className={isActive ? "rate-category active" : "rate-category"}
              type="button"
              onClick={() => onSelectCategory(String(category.id))}
            >
              <span className="rate-category-icon">{getCategoryIcon(name)}</span>
              <span>
                <strong>{name}</strong>
                {name.toLowerCase().includes("furniture") ? <small>Resell Only</small> : null}
              </span>
              <em>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </em>
            </button>
            <div className="rate-category-actions">
              <button
                type="button"
                aria-label={`Open actions for ${name}`}
                aria-expanded={openActionMenu === `category-${category.id}`}
                onClick={() => onToggleActionMenu("category", category.id)}
              >
                ⋮
              </button>
              {openActionMenu === `category-${category.id}` ? (
                <div className="row-action-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => onCategoryAction("edit", category)}>
                    Edit
                  </button>
                  <button type="button" role="menuitem" onClick={() => onCategoryAction("delete", category)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        );
      })
    )}
  </div>
);

export default CategoryList;
