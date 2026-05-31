// @ts-nocheck
// ScrapSelection.jsx
import React, { useState } from "react";
import "../styles/ScrapSelection.css";

const categories = [
  "Plastic",
  "Papers",
  "Metal",
  "Electronics",
  "Vehicle",
  "Furniture",
  "Glass",
];

const scrapItems = [
  {
    id: 1,
    title: "Cable (copper insulated)",
    price: 60,
    unit: "kg",
  },
  {
    id: 2,
    title: "Mix Plastic",
    price: 10,
    unit: "kg",
  },
  {
    id: 3,
    title: "Bottle",
    price: 12,
    unit: "kg",
  },
  {
    id: 4,
    title: "Plastic Bag",
    price: 5,
    unit: "kg",
  },
  {
    id: 5,
    title: "Cable (aluminum insulated)",
    price: 40,
    unit: "kg",
  },
];

const steps = [
  "Product",
  "Mobile No.",
  "Address",
  "Schedule",
];

function ScrapSelection() {
  const [selectedCategory, setSelectedCategory] = useState("Plastic");
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="scrap-wrapper">
      <div className="scrap-card">
        {/* Steps */}
        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-box" key={index}>
              <div
                className={`step-number ${
                  index === 0 ? "active-step" : ""
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>

              <p>{step}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="category-container">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-btn ${
                selectedCategory === category ? "active-category" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="circle-icon"></span>
              {category}
            </button>
          ))}
        </div>

        {/* Scrap Items */}
        <div className="items-grid">
          {scrapItems.map((item) => (
            <div
              key={item.id}
              className={`item-card ${
                selectedItem === item.id ? "selected-item" : ""
              }`}
              onClick={() => setSelectedItem(item.id)}
            >
              <h3>{item.title}</h3>

              <div className="item-icon">♻</div>

              <div className="price-row">
                <span className="price">₹ {item.price}</span>
                <span className="unit">/{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Validation */}
        {!selectedItem && (
          <p className="error-text">**Please Select Value</p>
        )}

        {/* Button */}
        <button className="next-btn">Next</button>
      </div>
    </div>
  );
}

export default ScrapSelection;