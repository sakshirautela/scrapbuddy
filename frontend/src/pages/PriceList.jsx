import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/common/NavBar/NavBar";
import apiClient from "../utils/apiClient";
import "../styles/PriceList.css";

const getCategoryName = (category) => category?.category || category?.name || "Uncategorized";

const getSubCategoryName = (subCategory) =>
  subCategory?.subCategory || subCategory?.name || "Untitled item";

const getItemIcon = (name) => {
  const value = String(name || "").toLowerCase();

  if (value.includes("paper") || value.includes("book") || value.includes("newspaper")) return "📰";
  if (value.includes("plastic") || value.includes("bottle")) return "🧴";
  if (value.includes("metal") || value.includes("iron") || value.includes("steel")) return "⚙";
  if (value.includes("copper")) return "🧵";
  if (value.includes("laptop") || value.includes("mobile") || value.includes("e-waste")) return "💻";
  if (value.includes("glass")) return "🍾";
  if (value.includes("battery")) return "🔋";
  if (value.includes("cardboard") || value.includes("carton")) return "📦";

  return "♻";
};

const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Ask on pickup";
  }

  return `Rs ${numericPrice.toFixed(2)} / kg`;
};

const PriceList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiClient.get("/api/categories/with-subcategories");

        if (isMounted) {
          setCategories(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load price list");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryNames = useMemo(
    () => ["All", ...categories.map(getCategoryName).filter(Boolean)],
    [categories]
  );

  const rows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return categories
      .flatMap((category) =>
        (category.subCategories || []).map((subCategory) => ({
          id: `${category.id}-${subCategory.id}`,
          item: getSubCategoryName(subCategory),
          category: getCategoryName(category),
          price: subCategory.price,
          icon: getItemIcon(`${getCategoryName(category)} ${getSubCategoryName(subCategory)}`),
          notes: `${getSubCategoryName(subCategory)} accepted for doorstep pickup.`,
          updatedAt: subCategory.updatedDateTime || subCategory.createdDateTime || category.updatedDateTime,
        }))
      )
      .filter((row) => activeCategory === "All" || row.category === activeCategory)
      .filter((row) => {
        if (!normalizedSearch) {
          return true;
        }

        return `${row.item} ${row.category}`.toLowerCase().includes(normalizedSearch);
      });
  }, [activeCategory, categories, searchTerm]);

  const formatDate = (value) => {
    if (!value) {
      return "Latest";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "Latest"
      : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <main className="price-page">
      <NavBar activePage="Price List" />

      <section className="price-hero">
        <div>
          <h1>Scrap <span>Price List</span></h1>
          <p>Check the latest scrap rates in your city. Prices may change based on market conditions, quantity and location.</p>
        </div>
        <div className="price-hero-art">♻</div>
      </section>

      <section className="price-shell">
        <div className="price-main">
          <div className="price-tools">
            <label className="price-search">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search items (e.g., newspaper, iron, laptop)..."
              />
            </label>
            {categoryNames.map((category) => (
              <button
                className={`price-filter ${activeCategory === category ? "active" : ""}`}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="price-table-card">
            <div className="price-table-wrap">
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Notes</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">Loading price list...</td>
                    </tr>
                  ) : null}
                  {error ? (
                    <tr>
                      <td colSpan="5">{error}</td>
                    </tr>
                  ) : null}
                  {!loading && !error && rows.length === 0 ? (
                    <tr>
                      <td colSpan="5">No rates found</td>
                    </tr>
                  ) : null}
                  {!loading && !error
                    ? rows.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <div className="price-item-cell">
                              <span className="price-item-icon">{row.icon}</span>
                              <strong>{row.item}</strong>
                            </div>
                          </td>
                          <td><span className="price-chip">{row.category}</span></td>
                          <td><span className="price-value">{formatPrice(row.price)}</span></td>
                          <td>{row.notes}</td>
                          <td>{formatDate(row.updatedAt)}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
            <p className="price-table-note">
              <span>ⓘ Prices are indicative and subject to change without prior notice.</span>
              <span>Showing {rows.length} item{rows.length === 1 ? "" : "s"}</span>
            </p>
          </div>
        </div>

        <aside className="price-side">
          <section className="price-info-card">
            <h2>Prices may vary</h2>
            <p>by city and quantity</p>
            <ul>
              <li><span>▥</span>Rates depend on market conditions and demand.</li>
              <li><span>♙</span>Higher quantities may get better rates.</li>
              <li><span>◷</span>Final price is confirmed during pickup.</li>
              <li><span>×</span>For bulk pickup, contact our support team.</li>
            </ul>
          </section>

          <section className="price-cta-card">
            <h2>Have scrap to sell?</h2>
            <p>Book a free pickup and get the best value.</p>
            <button type="button" onClick={() => navigate("/schedule-pickup")}>
              Book Pickup Now →
            </button>
            <small>✓ No hidden charges · 100% free pickup</small>
          </section>
        </aside>
      </section>

      <footer className="price-footer">
        <div>
          <strong>♻ JunkBox</strong>
          <p>India's trusted platform to sell scrap online. Clean India, green India.</p>
        </div>
        <div>
          <h3>Company</h3>
          <a href="/">About Us</a>
          <a href="/">Careers</a>
          <a href="/">Privacy Policy</a>
        </div>
        <div>
          <h3>Services</h3>
          <a href="/schedule-pickup">Schedule Pickup</a>
          <a href="/price-list">Price List</a>
          <a href="/track-order">Track Order</a>
        </div>
        <div>
          <h3>Help</h3>
          <a href="/">FAQ</a>
          <a href="/">How It Works</a>
          <a href="/">Blog</a>
        </div>
        <div>
          <h3>Contact Us</h3>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:hello@junkbox.in">hello@junkbox.in</a>
          <p>Greater Noida, Uttar Pradesh</p>
        </div>
      </footer>
      <div className="price-copybar">
        <span>© 2026 JunkBox. All rights reserved.</span>
        <span>Proudly made in India 🇮🇳</span>
        <span>A small step towards a better tomorrow ♻</span>
      </div>
    </main>
  );
};

export default PriceList;
