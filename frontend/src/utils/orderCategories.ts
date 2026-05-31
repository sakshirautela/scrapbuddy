// @ts-nocheck
const getCategoryLabel = (category, fallback = "Category") =>
  category?.category || category?.name || category?.categoryName || fallback;

const getSubCategoryLabel = (subCategory, fallback = "Subcategory") =>
  subCategory?.subCategory || subCategory?.name || subCategory?.categoryName || fallback;

const findCategoryById = (categories, categoryId) =>
  categories.find((category) => String(category.id) === String(categoryId));

const findSubCategoryById = (category, subCategoryId) =>
  category?.subCategories?.find((subCategory) => String(subCategory.id) === String(subCategoryId));

export const formatOrderCategoryPairs = (pairs, categories = [], options = {}) => {
  const separator = options.separator || "; ";
  const categorySeparator = options.categorySeparator || " -> ";
  const includePrice = Boolean(options.includePrice);

  if (Array.isArray(pairs)) {
    if (pairs.length === 0) {
      return "-";
    }

    return pairs
      .map((category) => {
        const categoryName = getCategoryLabel(category);
        const subCategories = Array.isArray(category.subCategories) ? category.subCategories : [];

        if (subCategories.length === 0) {
          return categoryName;
        }

        return subCategories
          .map((subCategory) => {
            const price = includePrice && subCategory?.price ? ` - Rs ${subCategory.price}/kg` : "";
            return `${categoryName}${categorySeparator}${getSubCategoryLabel(subCategory)}${price}`;
          })
          .join(separator);
      })
      .join(separator);
  }

  if (!pairs || Object.keys(pairs).length === 0) {
    return "-";
  }

  return Object.entries(pairs)
    .flatMap(([categoryId, subCategoryIds]) => {
      const category = findCategoryById(categories, categoryId);
      const categoryName = getCategoryLabel(category, `Category ${categoryId}`);
      const ids = Array.isArray(subCategoryIds) ? subCategoryIds : [subCategoryIds];

      if (ids.length === 0) {
        return [categoryName];
      }

      return ids.map((subCategoryId) => {
        const subCategory = findSubCategoryById(category, subCategoryId);
        const subCategoryName = getSubCategoryLabel(subCategory, `Subcategory ${subCategoryId}`);
        const price = includePrice && subCategory?.price ? ` - Rs ${subCategory.price}/kg` : "";

        return `${categoryName}${categorySeparator}${subCategoryName}${price}`;
      });
    })
    .join(separator);
};
