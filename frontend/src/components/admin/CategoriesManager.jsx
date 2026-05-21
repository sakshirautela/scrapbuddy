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
          onToggleCategoryForm={() => setShowCategoryForm((current) => !current)}
          onToggleSubCategoryForm={() => setShowSubCategoryForm((current) => !current)}
        />

        <div className="rate-layout">
          <aside className="rate-category-panel">
            <CategoryList
              categories={filteredCategories}
              selectedCategoryId={selectedCategoryId}
              showCategoryForm={showCategoryForm}
              categoryForm={categoryForm}
              editingCategoryId={editingCategoryId}
              openActionMenu={openActionMenu}
              onCategoryFormChange={onCategoryFormChange}
              onCategorySubmit={handleCategorySubmitClick}
              onCategoryCancel={handleCategoryCancelClick}
              onCategoryAction={handleCategoryAction}
              onSelectCategory={onSelectCategory}
              onToggleActionMenu={toggleActionMenu}
            />
          </aside>

          <section className="rate-content-panel">
            <SubCategoryTable
              items={rateItems}
              selectedCategoryName={selectedCategoryName}
              showSubCategoryForm={showSubCategoryForm}
              subCategoryForm={subCategoryForm}
              editingSubCategoryId={editingSubCategoryId}
              openActionMenu={openActionMenu}
              onSubCategoryFormChange={onSubCategoryFormChange}
              onSubCategorySubmit={handleSubCategorySubmitClick}
              onSubCategoryCancel={handleSubCategoryCancelClick}
              onSubCategoryAction={handleSubCategoryAction}
              onToggleActionMenu={toggleActionMenu}
            />
          </section>
        </div>
      </div>
    </section>
  );
};

export default CategoriesManager;
