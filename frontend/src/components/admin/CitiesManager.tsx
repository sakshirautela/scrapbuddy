// @ts-nocheck
import React, { useState } from "react";

const CitiesManager = ({
  cities,
  addresses,
  cityForm,
  editingCityId,
  onCityFormChange,
  onCitySubmit,
  onCityCancel,
  onCityEdit,
  onCityDelete,
}) => {
  const [openCityMenuId, setOpenCityMenuId] = useState(null);

  const handleEdit = (cityItem) => {
    setOpenCityMenuId(null);
    onCityEdit(cityItem);
  };

  const handleDelete = (cityItem) => {
    setOpenCityMenuId(null);
    onCityDelete(cityItem);
  };

  return (
    <section className="admin-card table-card">
      <div className="table-title-row">
        <h2>Service Areas</h2>
      </div>

      <div className="rate-admin-actions">
        <input
          type="text"
          name="name"
          placeholder="City name"
          value={cityForm.name}
          onChange={(event) => onCityFormChange(event.target.value)}
        />
        <button type="button" onClick={onCitySubmit}>
          {editingCityId ? "Update City" : "Add City"}
        </button>
        {editingCityId ? (
          <button type="button" onClick={onCityCancel}>
            Cancel
          </button>
        ) : null}
      </div>

      <div className="city-grid">
        {cities.length === 0 ? (
          <p>No Cities Found</p>
        ) : (
          cities.map((cityItem, index) => {
            const cityMenuId = cityItem.id || cityItem.name || `city-${index}`;
            const isMenuOpen = String(openCityMenuId) === String(cityMenuId);

            return (
              <article className="city-card-admin" key={cityItem.id || cityItem.name}>
                <div className="city-card-header">
                  <strong>{cityItem.name || "Unnamed city"}</strong>
                  <div className="city-action-menu">
                    <button
                      type="button"
                      className="city-menu-trigger"
                      aria-label={`Actions for ${cityItem.name || "city"}`}
                      aria-expanded={isMenuOpen}
                      onClick={() =>
                        setOpenCityMenuId((current) =>
                          String(current) === String(cityMenuId) ? null : cityMenuId
                        )
                      }
                    >
                      ⋯
                    </button>

                    {isMenuOpen ? (
                      <div className="city-menu-popover">
                        <button type="button" onClick={() => handleEdit(cityItem)}>
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => handleDelete(cityItem)}>
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <span>{addresses.filter((address) => address.city === cityItem.name).length} addresses</span>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

export default CitiesManager;
