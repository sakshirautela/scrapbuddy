import React, {
    useEffect,
    useState,
} from "react";

import apiClient from "../../utils/apiClient";

import "../../styles/CategoriesPage.css";

const CategoriesWithSubCat = ({
    onSelect,
}) => {

    const [categories, setCategories] =
        useState([]);

    const [selectedCategory,
        setSelectedCategory] =
        useState(null);

    const [selectedSubCategory,
        setSelectedSubCategory] =
        useState(null);

    useEffect(() => {

        fetchCategories();

    }, []);

    const fetchCategories =
        async () => {

            try {

                const response =
                    await apiClient.get(
                        "/api/categories/with-subcategories"
                    );

                setCategories(
                    response.data || []
                );

            } catch (error) {

                console.error(error);

            }
        };

    // CATEGORY CLICK
    const handleCategoryClick = (
        category
    ) => {

        setSelectedCategory(category);

        // RESET OLD SUBCATEGORY
        setSelectedSubCategory(null);

    };

    // SUBCATEGORY CLICK
    const handleSubCategoryClick = (
        categoryId,
        sub
    ) => {

        setSelectedSubCategory(sub.id);

        // SEND DATA TO PARENT
        if (onSelect) {

            onSelect({
                categoryID: categoryId,
                subCategoryID: sub.id,
            });

        }
    };

    return (

        <div className="categories-page">

            {/* CATEGORY BUTTONS */}
            <div className="category-buttons">

                {categories.map((category) => (

                    <button
                        key={category.id}
                        className={`category-btn ${selectedCategory?.id ===
                                category.id
                                ? "active-category"
                                : ""
                            }`}
                        onClick={() =>
                            handleCategoryClick(
                                category
                            )
                        }
                    >

                        {category.category}

                    </button>

                ))}

            </div>

            {/* SUBCATEGORY BUTTONS */}
            {selectedCategory && (

                <div className="subcategory-buttons">

                    <h3>
                        Select Subcategory
                    </h3>

                    {selectedCategory
                        .subCategories &&
                        selectedCategory
                            .subCategories.length >
                        0 ? (

                        selectedCategory.subCategories.map(
                            (sub) => (

                                <button
                                    key={sub.id}
                                    className={`subcategory-btn ${selectedSubCategory ===
                                            sub.id
                                            ? "active-subcategory"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        handleSubCategoryClick(
                                            selectedCategory.id,
                                            sub
                                        )
                                    }
                                >

                                    {sub.subCategory}
                                    {" "}
                                    - ₹
                                    {sub.price}

                                </button>

                            )
                        )

                    ) : (

                        <p>
                            No Subcategories
                        </p>

                    )}

                </div>

            )}

        </div>
    );
};

export default CategoriesWithSubCat;