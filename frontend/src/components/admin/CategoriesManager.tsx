// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { getCategoryName } from "../../utils/adminDashboard";
import CategoriesToolbar from "./categories/CategoriesToolbar";
import CategoryList from "./categories/CategoryList";
import RateAdminHeader from "./categories/RateAdminHeader";
import SubCategoryTable from "./categories/SubCategoryTable";

const CategoriesManager = ({
  categories,
  selectedCategory,
  selectedCategoryId,
  selectedState,
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

  const handleCategorySubmitClick = async () => {
    const didSave = await onCategorySubmit();

    if (didSave) {
      setShowCategoryForm(false);
    }
  };

  const handleSubCategoryCancelClick = () => {
    onSubCategoryCancel();
    setShowSubCategoryForm(false);
  };

  const handleSubCategorySubmitClick = async () => {
    const didSave = await onSubCategorySubmit();

    if (didSave) {
      setShowSubCategoryForm(false);
    }
  };

  return (
    <section className="rate-admin-page">
      <RateAdminHeader selectedState={selectedState} />

      <div className="rates-workspace">
        <CategoriesToolbar
          activeRateTab={activeRateTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onShowCategories={() => setActiveRateTab("categories")}
          onToggleCategoryForm={() => setShowCategoryForm(true)}
          onToggleSubCategoryForm={() => setShowSubCategoryForm(true)}
        />

        <div className="rate-layout">
          <aside className="rate-category-panel">
            <CategoryList
              categories={filteredCategories}
              selectedCategoryId={selectedCategoryId}
              openActionMenu={openActionMenu}
              onCategoryAction={handleCategoryAction}
              onSelectCategory={onSelectCategory}
              onToggleActionMenu={toggleActionMenu}
            />
          </aside>

          <section className="rate-content-panel">
            <SubCategoryTable
              items={rateItems}
              selectedCategoryName={selectedCategoryName}
              openActionMenu={openActionMenu}
              onSubCategoryAction={handleSubCategoryAction}
              onToggleActionMenu={toggleActionMenu}
            />
          </section>
        </div>
      </div>

      {showCategoryForm ? (
        <div className="admin-modal-backdrop" role="presentation">
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
            <header className="admin-modal-header">
              <div>
                <span>Category</span>
                <h3 id="category-modal-title">{editingCategoryId ? "Edit category" : "Add category"}</h3>
              </div>
              <button type="button" aria-label="Close category form" onClick={handleCategoryCancelClick}>
                &times;
              </button>
            </header>
            <label className="admin-modal-field">
              <span>Category name</span>
              <input
                type="text"
                name="category"
                placeholder="Category name"
                value={categoryForm.category}
                autoFocus
                onChange={(event) => onCategoryFormChange("category", event.target.value)}
              />
            </label>
            <div className="admin-modal-actions">
              <button className="admin-secondary" type="button" onClick={handleCategoryCancelClick}>
                Cancel
              </button>
              <button className="admin-primary" type="button" onClick={handleCategorySubmitClick}>
                {editingCategoryId ? "Update category" : "Add category"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {showSubCategoryForm ? (
        <div className="admin-modal-backdrop" role="presentation">
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="subcategory-modal-title">
            <header className="admin-modal-header">
              <div>
                <span>{selectedCategoryName}</span>
                <h3 id="subcategory-modal-title">
                  {editingSubCategoryId ? "Edit subcategory" : "Add subcategory"}
                </h3>
              </div>
              <button type="button" aria-label="Close subcategory form" onClick={handleSubCategoryCancelClick}>
                &times;
              </button>
            </header>
            <label className="admin-modal-field">
              <span>Category</span>
              <select
                name="category"
                value={subCategoryForm.category || selectedCategoryName}
                onChange={(event) => onSubCategoryFormChange("category", event.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-modal-field">
              <span>Subcategory name</span>
              <input
                type="text"
                name="subCategory"
                placeholder="Subcategory name"
                value={subCategoryForm.subCategory}
                autoFocus
                onChange={(event) => onSubCategoryFormChange("subCategory", event.target.value)}
              />
            </label>
            <label className="admin-modal-field">
              <span>Price per kg</span>
              <input
                type="number"
                name="price"
                placeholder="Price"
                min="1"
                value={subCategoryForm.price}
                onChange={(event) => onSubCategoryFormChange("price", event.target.value)}
              />
            </label>
            <div className="admin-modal-actions">
              <button className="admin-secondary" type="button" onClick={handleSubCategoryCancelClick}>
                Cancel
              </button>
              <button className="admin-primary" type="button" onClick={handleSubCategorySubmitClick}>
                {editingSubCategoryId ? "Update subcategory" : "Add subcategory"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
};

export default CategoriesManager;
