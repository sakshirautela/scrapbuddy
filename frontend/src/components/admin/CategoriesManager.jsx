import React, { useEffect, useMemo, useState } from "react";
import {
  getCategoryIcon,
  getCategoryName,
  getRateIcon,
} from "../../utils/adminDashboard";

const CategoriesManager = ({
  categories,
  cities,
  selectedCategory,
  selectedCategoryId,
  selectedState,
  totalSubCategories,
  categoryForm,
  subCategoryForm,
  editingCategoryId,
  editingSubCategoryId,
  onCategoryFormChange,
  onSubCategoryFormChange,
  onCategorySubmit,
  onCategoryCancel,
  onSubCategorySubmit,
  onSubCategoryCancel,
  onSelectCategory,
  onSelectState,
  onCategoryEdit,
  onCategoryDelete,
  onSubCategoryEdit,
  onSubCategoryDelete,
}) => {
  const [activeRateTab, setActiveRateTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);
  const rateItems = selectedCategory?.subCategories || [];
  const selectedCategoryName = getCategoryName(selectedCategory);
  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return categories;
    }

    return categories.filter((category) =>
      getCategoryName(category).toLowerCase().includes(normalizedSearch)
    );
  }, [categories, searchTerm]);

  useEffect(() => {
    if (editingCategoryId) {
      setShowCategoryForm(true);
    }
  }, [editingCategoryId]);

  useEffect(() => {
    if (editingSubCategoryId) {
      setShowSubCategoryForm(true);
    }
  }, [editingSubCategoryId]);

  const toggleActionMenu = (type, id) => {
    const menuKey = `${type}-${id}`;
    setOpenActionMenu((current) => (current === menuKey ? null : menuKey));
  };

  const handleCategoryAction = (action, category) => {
    setOpenActionMenu(null);

    if (action === "edit") {
      onCategoryEdit(category);
      return;
    }

    onCategoryDelete(category);
  };

  const handleSubCategoryAction = (action, item) => {
    setOpenActionMenu(null);

    if (action === "edit") {
      onSubCategoryEdit(item);
      return;
    }

    onSubCategoryDelete(item);
  };

  const handleCategoryCancelClick = () => {
    onCategoryCancel();
    setShowCategoryForm(false);
  };

  const handleSubCategoryCancelClick = () => {
    onSubCategoryCancel();
    setShowSubCategoryForm(false);
  };

  return (
    <section className="rate-admin-page">
      <header className="rate-admin-header">
        <div>
          <h2>Rates</h2>
          <p>Manage categories and their rate items</p>
        </div>

        <div className="rate-summary-grid">
          <article className="summary-card summary-amber">
            <span>₹</span>
            <strong>200</strong>
            <small>Min. Pickup Value</small>
          </article>
          <article className="summary-card summary-violet">
            <span>⌖</span>
            <strong>{selectedState || "Noida"}</strong>
            <small>Current City</small>
          </article>
        </div>
      </header>

      <div className="rates-workspace">
        <div className="rates-tabs-row">
          <div className="rates-tabs" role="tablist" aria-label="Rate views">
            <button
              className={activeRateTab === "categories" ? "active" : ""}
              type="button"
              onClick={() => setActiveRateTab("categories")}
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
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <span>⌕</span>
            </label>
            <button
              className="admin-primary"
              type="button"
              onClick={() => setShowCategoryForm((current) => !current)}
            >
              + Add Category
            </button>
          </div>
        </div>

        {showCategoryForm ? (
          <div className="inline-admin-form">
            <input
              type="text"
              name="category"
              placeholder="Category name"
              value={categoryForm.category}
              onChange={(event) => onCategoryFormChange("category", event.target.value)}
            />
            <button className="admin-primary" type="button" onClick={onCategorySubmit}>
              {editingCategoryId ? "Update Category" : "Save Category"}
            </button>
            <button className="admin-secondary" type="button" onClick={handleCategoryCancelClick}>
              Cancel
            </button>
          </div>
        ) : null}

        <div className="rates-filter-row">
          <select
            className="state-select"
            value={selectedState}
            onChange={(event) => onSelectState(event.target.value)}
            aria-label="Select city"
          >
            {cities.length === 0 ? (
              <option value="">No cities configured</option>
            ) : (
              cities.map((cityItem) => (
                <option key={cityItem.id || cityItem.name} value={cityItem.name}>
                  {cityItem.name}
                </option>
              ))
            )}
          </select>

          <div className="minimum-banner">
            Minimum Pickup Value Must Be Rs:200/- <span>ⓘ</span>
          </div>

          <div className="subcategory-quick-add">
            <button
              className="admin-outline"
              type="button"
              onClick={() => setShowSubCategoryForm((current) => !current)}
            >
              + Add Subcategory
            </button>
          </div>
        </div>

        {showSubCategoryForm ? (
          <div className="inline-admin-form inline-admin-form-right">
            <input
              type="text"
              name="subCategory"
              placeholder="Subcategory name"
              value={subCategoryForm.subCategory}
              onChange={(event) => onSubCategoryFormChange("subCategory", event.target.value)}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              min="1"
              value={subCategoryForm.price}
              onChange={(event) => onSubCategoryFormChange("price", event.target.value)}
            />
            <button className="admin-outline" type="button" onClick={onSubCategorySubmit}>
              {editingSubCategoryId ? "Update Subcategory" : "Save Subcategory"}
            </button>
            <button className="admin-secondary" type="button" onClick={handleSubCategoryCancelClick}>
              Cancel
            </button>
          </div>
        ) : null}

        <div className="rate-layout">
          <aside className="rate-category-panel">

          <div className="rate-category-list">
            {filteredCategories.length === 0 ? (
              <p className="empty-copy">No categories found.</p>
            ) : (
              filteredCategories.map((category) => {
                const isActive = String(category.id) === String(selectedCategoryId);
                const name = getCategoryName(category);
                const itemCount = category.subCategories?.length || 0;

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
                      <em>{itemCount} {itemCount === 1 ? "item" : "items"}</em>
                    </button>
                    <div className="rate-category-actions">
                      <button
                        type="button"
                        aria-label={`Open actions for ${name}`}
                        aria-expanded={openActionMenu === `category-${category.id}`}
                        onClick={() => toggleActionMenu("category", category.id)}
                      >
                        ⋮
                      </button>
                      {openActionMenu === `category-${category.id}` ? (
                        <div className="row-action-menu" role="menu">
                          <button type="button" role="menuitem" onClick={() => handleCategoryAction("edit", category)}>
                            Edit
                          </button>
                          <button type="button" role="menuitem" onClick={() => handleCategoryAction("delete", category)}>
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
        </aside>

        <section className="rate-content-panel">
          {rateItems.length === 0 ? (
            <div className="empty-rate-state">
              <h3>No rates in {selectedCategoryName}</h3>
              <p>Add subcategories from backend/admin tools to show rate cards here.</p>
            </div>
          ) : (
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
                  {rateItems.map((item) => {
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
                              onClick={() => toggleActionMenu("item", item.id)}
                            >
                              ⋮
                            </button>
                            {openActionMenu === `item-${item.id}` ? (
                              <div className="row-action-menu" role="menu">
                                <button type="button" role="menuitem" onClick={() => handleSubCategoryAction("edit", item)}>
                                  Edit
                                </button>
                                <button type="button" role="menuitem" onClick={() => handleSubCategoryAction("delete", item)}>
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
                <span>Showing {rateItems.length} of {rateItems.length} {rateItems.length === 1 ? "item" : "items"}</span>
                <div>
                  <button type="button">←</button>
                  <strong>1</strong>
                  <button type="button">→</button>
                </div>
              </footer>
            </div>
          )}
        </section>
        </div>
      </div>

    </section>
  );
};

export default CategoriesManager;
