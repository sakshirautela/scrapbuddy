import React from "react";
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
  const rateItems = selectedCategory?.subCategories || [];

  return (
    <section className="rate-admin-page">
      <header className="rate-admin-header">
        <div>
          <h2>Rates</h2>
          <p>{categories.length} categories · {totalSubCategories} rate items · {selectedState || "No city selected"}</p>
        </div>
        <div className="rate-admin-actions">
          <input
            type="text"
            name="category"
            placeholder="Category name"
            value={categoryForm.category}
            onChange={(event) => onCategoryFormChange("category", event.target.value)}
          />
          <button type="button" onClick={onCategorySubmit}>
            {editingCategoryId ? "Update Category" : "Add Category"}
          </button>
          {editingCategoryId ? (
            <button type="button" onClick={onCategoryCancel}>
              Cancel
            </button>
          ) : null}
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
          <button type="button" onClick={onSubCategorySubmit}>
            {editingSubCategoryId ? "Update Subcategory" : "Add Subcategory"}
          </button>
          {editingSubCategoryId ? (
            <button type="button" onClick={onSubCategoryCancel}>
              Cancel
            </button>
          ) : null}
        </div>
      </header>

      <div className="rate-layout">
        <aside className="rate-category-panel">
          <select
            className="state-select"
            value={selectedState}
            onChange={(event) => onSelectState(event.target.value)}
            aria-label="Select state"
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

          <div className="rate-category-list">
            {categories.length === 0 ? (
              <p className="empty-copy">No categories found.</p>
            ) : (
              categories.map((category) => {
                const isActive = String(category.id) === String(selectedCategoryId);
                const name = getCategoryName(category);

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
                    </button>
                    <div className="rate-category-actions">
                      <button type="button" aria-label={`Edit ${name}`} onClick={() => onCategoryEdit(category)}>
                        Edit
                      </button>
                      <button type="button" aria-label={`Delete ${name}`} onClick={() => onCategoryDelete(category)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <section className="rate-content-panel">
          <div className="minimum-banner">Minimum Pickup Value Must Be Rs:200/-</div>

          {rateItems.length === 0 ? (
            <div className="empty-rate-state">
              <h3>No rates in {getCategoryName(selectedCategory)}</h3>
              <p>Add subcategories from backend/admin tools to show rate cards here.</p>
            </div>
          ) : (
            <div className="rate-card-grid">
              {rateItems.map((item) => {
                const itemName = item.subCategory || "Scrap item";

                return (
                  <article className="scrap-rate-card" key={item.id}>
                    <div className="scrap-illustration" aria-hidden="true">
                      {getRateIcon(itemName)}
                    </div>
                    <h3>{itemName}</h3>
                    <p className="scrap-rate">
                      ₹ {Number(item.price || 0)}
                      <span>/kg</span>
                    </p>
                    <div className="scrap-card-divider" />
                    <div className="scrap-card-actions">
                      <button
                        className="call-action"
                        type="button"
                        aria-label={`Edit ${itemName}`}
                        onClick={() => onSubCategoryEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="whatsapp-action"
                        type="button"
                        aria-label={`Delete ${itemName}`}
                        onClick={() => onSubCategoryDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <button className="floating-whatsapp" type="button" aria-label="WhatsApp support">☎</button>
      <div className="need-help-card">Need Help</div>
      <div className="support-avatar" aria-hidden="true">👨‍💼</div>
    </section>
  );
};

export default CategoriesManager;
