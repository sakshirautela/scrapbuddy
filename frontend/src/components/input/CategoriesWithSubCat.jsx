import React, { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import "../../styles/CategoriesPage.css";

const CategoriesWithSubCat = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedScraps, setSelectedScraps] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories/with-subcategories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubCategoryClick = (category, subCategory) => {
    const alreadySelected = selectedScraps.some(
      (item) =>
        item.categoryID === category.id &&
        item.subCategoryID === subCategory.id
    );

    let updatedScraps;

    if (alreadySelected) {
      updatedScraps = selectedScraps.filter(
        (item) =>
          !(
            item.categoryID === category.id &&
            item.subCategoryID === subCategory.id
          )
      );
    } else {
      updatedScraps = [
        ...selectedScraps,
        {
          categoryID: category.id,
          categoryName: category.category,
          subCategoryID: subCategory.id,
          subCategoryName: subCategory.subCategory,
          price: subCategory.price,
        },
      ];
    }

    setSelectedScraps(updatedScraps);

    if (onSelect) {
      onSelect(updatedScraps);
    }
  };

  const isSubCategorySelected = (categoryId, subCategoryId) => {
    return selectedScraps.some(
      (item) =>
        item.categoryID === categoryId &&
        item.subCategoryID === subCategoryId
    );
  };

  const isCategorySelected = (categoryId) => {
    return selectedScraps.some((item) => item.categoryID === categoryId);
  };

  const removeSelectedScrap = (categoryId, subCategoryId) => {
    const updatedScraps = selectedScraps.filter(
      (item) =>
        !(
          item.categoryID === categoryId &&
          item.subCategoryID === subCategoryId
        )
    );

    setSelectedScraps(updatedScraps);

    if (onSelect) {
      onSelect(updatedScraps);
    }
  };

  return (
    <div className="categories-page">
      <div className="category-buttons">
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`category-btn ${
                selectedCategory?.id === category.id ? "active-category" : ""
              } ${
                isCategorySelected(category.id) ? "selected-category" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.category}

              {isCategorySelected(category.id) ? (
                <span className="category-selected-mark"> ✓</span>
              ) : null}
            </button>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </div>

      {selectedCategory && (
        <div className="subcategory-buttons">
          <h3>{selectedCategory.category} Subcategories</h3>

          {selectedCategory.subCategories &&
          selectedCategory.subCategories.length > 0 ? (
            selectedCategory.subCategories.map((subCategory) => (
              <button
                key={subCategory.id}
                type="button"
                className={`subcategory-btn ${
                  isSubCategorySelected(selectedCategory.id, subCategory.id)
                    ? "active-subcategory"
                    : ""
                }`}
                onClick={() =>
                  handleSubCategoryClick(selectedCategory, subCategory)
                }
              >
                {subCategory.subCategory} - ₹{subCategory.price}

                {isSubCategorySelected(selectedCategory.id, subCategory.id)
                  ? " ✓"
                  : ""}
              </button>
            ))
          ) : (
            <p>No subcategories found</p>
          )}
        </div>
      )}

      {selectedScraps.length > 0 && (
        <div className="selected-scraps">
          <h3>Selected Scrap Items</h3>

          {selectedScraps.map((item) => (
            <div
              key={`${item.categoryID}-${item.subCategoryID}`}
              className="selected-scrap-item"
            >
              <span>
                {item.categoryName} - {item.subCategoryName}
              </span>

              <strong>₹{item.price}</strong>

              <button
                type="button"
                className="remove-scrap-btn"
                onClick={() =>
                  removeSelectedScrap(item.categoryID, item.subCategoryID)
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesWithSubCat;