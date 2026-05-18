import React from "react";

const CategoriesTable = ({
  categories,
}) => {

  return (

    <div className="table-container">

      <h2>
        Categories
      </h2>

      <div className="grid-box">
console.log(categories);
        {categories.map((cat) => (

          <div
            key={cat.id}
            className="grid-card"
          >

            <h3>
              {cat.category}
            </h3>

          </div>

        ))}

      </div>

    </div>
  );
};

export default CategoriesTable;