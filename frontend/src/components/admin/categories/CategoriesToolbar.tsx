// @ts-nocheck
import React from "react";

const CategoriesToolbar = ({
  activeRateTab,
  searchTerm,
  onSearchChange,
  onShowCategories,
  onToggleCategoryForm,
  onToggleSubCategoryForm,
}) => (
  <div className="rates-tabs-row">
    <div className="rates-tabs" role="tablist" aria-label="Rate views">
      <button
        className={activeRateTab === "categories" ? "active" : ""}
        type="button"
        onClick={onShowCategories}
      >
        All Categories
      </button>
    </div>

    <div className="rates-toolbar">
      <label className="search-box">
        <input
          type="search"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <span>⌕</span>
      </label>
      <button className="admin-primary" type="button" onClick={onToggleCategoryForm}>
        + Add Category
      </button>
      <button className="admin-outline" type="button" onClick={onToggleSubCategoryForm}>
        + Add Subcategory
      </button>
    </div>
  </div>
);

export default CategoriesToolbar;
