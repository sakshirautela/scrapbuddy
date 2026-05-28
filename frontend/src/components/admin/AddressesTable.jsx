import React, { useMemo, useState } from "react";
import { formatValue } from "../../utils/adminDashboard";

const getAddressKey = (address = {}) =>
  address.id
    || [
      address.receiverEmail,
      address.receiverPhone,
      address.apartment,
      address.city,
      address.zip,
    ].filter(Boolean).join("|");

const getOrderId = (order = {}) => order.id ?? order.orderId ?? order.orderID;

const getRowKey = (row = {}) => {
  if (row.source === "order") {
    return `order-${row.orderId || row.index}-${getAddressKey(row.address)}`;
  }

  return `saved-${getAddressKey(row.address)}`;
};

const AddressesTable = ({ addresses = [], orders = [], currentAdminId = 0 }) => {
  const [filters, setFilters] = useState({
    search: "",
    source: "all",
    city: "all",
    state: "all",
    country: "all",
  });

  const addressRows = useMemo(
    () => [
      ...addresses
        .filter(Boolean)
        .map((address, index) => ({
          address,
          index,
          source: "saved",
          sourceLabel: "Saved",
          isAssignedToMe: false,
        })),
      ...orders
        .map((order, index) => {
          if (!order.address) {
            return null;
          }

          const orderId = getOrderId(order);

          return {
            address: order.address,
            index,
            orderId,
            source: "order",
            sourceLabel: orderId ? `Order #${orderId}` : "Order",
            isAssignedToMe: String(order.pickscheduleById || "") === String(currentAdminId || ""),
          };
        })
        .filter(Boolean),
    ],
    [addresses, orders, currentAdminId]
  );

  const uniqueSavedAddresses = useMemo(
    () => Array.from(
      new Map(addresses.filter(Boolean).map((address) => [getAddressKey(address), address])).values()
    ),
    [addresses]
  );

  const cityOptions = useMemo(
    () => Array.from(new Set(addressRows.map((row) => row.address.city).filter(Boolean))).sort(),
    [addressRows]
  );

  const stateOptions = useMemo(
    () => Array.from(new Set(addressRows.map((row) => row.address.state).filter(Boolean))).sort(),
    [addressRows]
  );

  const countryOptions = useMemo(
    () => Array.from(new Set(addressRows.map((row) => row.address.country).filter(Boolean))).sort(),
    [addressRows]
  );

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const filteredAddresses = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    return addressRows.filter((row) => {
      const { address } = row;
      const receiverName = [address.receiverFirstName, address.receiverLastName]
        .filter(Boolean)
        .join(" ");
      const searchableText = [
        receiverName,
        address.receiverPhone,
        address.receiverEmail,
        address.apartment,
        address.city,
        address.state,
        address.zip,
        address.country,
        address.countryCode,
      ].filter(Boolean).join(" ").toLowerCase();

      if (normalizedSearch && !searchableText.includes(normalizedSearch)) {
        return false;
      }

      if (filters.source === "assigned" && !row.isAssignedToMe) {
        return false;
      }

      if (filters.source === "unassigned" && row.isAssignedToMe) {
        return false;
      }

      if (filters.source === "saved" && row.source !== "saved") {
        return false;
      }

      if (filters.source === "orders" && row.source !== "order") {
        return false;
      }

      if (filters.city !== "all" && address.city !== filters.city) {
        return false;
      }

      if (filters.state !== "all" && address.state !== filters.state) {
        return false;
      }

      if (filters.country !== "all" && address.country !== filters.country) {
        return false;
      }

      return true;
    });
  }, [addressRows, filters]);

  return (
    <section className="admin-card table-card">
      <div className="table-title-row">
        <div>
          <h2>Customer Addresses</h2>
          <p>
            Showing {filteredAddresses.length} of {addressRows.length} customer {addressRows.length === 1 ? "address" : "addresses"}
            {" "}({orders.filter((order) => order.address).length} from orders, {uniqueSavedAddresses.length} saved)
          </p>
        </div>
      </div>
      <div className="admin-filter-panel">
        <label className="admin-filter-field admin-filter-search">
          <span>Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Name, phone, email, address"
          />
        </label>
        <label className="admin-filter-field">
          <span>Source</span>
          <select value={filters.source} onChange={(event) => updateFilter("source", event.target.value)}>
            <option value="all">All addresses</option>
            <option value="saved">Saved addresses</option>
            <option value="orders">Order addresses</option>
            <option value="assigned">Assigned to me</option>
            <option value="unassigned">Not assigned to me</option>
          </select>
        </label>
        <label className="admin-filter-field">
          <span>City</span>
          <select value={filters.city} onChange={(event) => updateFilter("city", event.target.value)}>
            <option value="all">All cities</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter-field">
          <span>State</span>
          <select value={filters.state} onChange={(event) => updateFilter("state", event.target.value)}>
            <option value="all">All states</option>
            {stateOptions.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter-field">
          <span>Country</span>
          <select value={filters.country} onChange={(event) => updateFilter("country", event.target.value)}>
            <option value="all">All countries</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </label>
        <button
          className="admin-secondary admin-filter-clear"
          type="button"
          onClick={() => setFilters({
            search: "",
            source: "all",
            city: "all",
            state: "all",
            country: "all",
          })}
        >
          Clear
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Receiver</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Apartment</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Country</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {filteredAddresses.length === 0 ? (
              <tr><td colSpan="9">No addresses found</td></tr>
            ) : (
              filteredAddresses.map((row) => {
                const { address } = row;
                const receiverName = [address.receiverFirstName, address.receiverLastName]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr key={getRowKey(row)}>
                    <td>{formatValue(receiverName)}</td>
                    <td>{formatValue(address.receiverPhone)}</td>
                    <td>{formatValue(address.receiverEmail)}</td>
                    <td>{formatValue(address.apartment)}</td>
                    <td>{formatValue(address.city)}</td>
                    <td>{formatValue(address.state)}</td>
                    <td>{formatValue(address.zip)}</td>
                    <td>{formatValue(address.country)}</td>
                    <td>{row.sourceLabel}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AddressesTable;
