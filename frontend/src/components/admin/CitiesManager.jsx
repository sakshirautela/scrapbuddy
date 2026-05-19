import React from "react";

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
}) => (
  <section className="admin-card table-card">
    <div className="table-title-row">
      <h2>Cities</h2>
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
        cities.map((cityItem) => (
          <article className="city-card-admin" key={cityItem.id || cityItem.name}>
            <strong>{cityItem.name || "Unnamed city"}</strong>
            <span>{addresses.filter((address) => address.city === cityItem.name).length} addresses</span>
            <div className="action-buttons">
              <button type="button" onClick={() => onCityEdit(cityItem)}>
                Edit
              </button>
              <button type="button" onClick={() => onCityDelete(cityItem)}>
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  </section>
);

export default CitiesManager;
