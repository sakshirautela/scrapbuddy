import React from "react";
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

const AddressesTable = ({ orders = [], currentAdminId = 0 }) => {
  const assignedAddresses = orders
    .filter((order) => String(order.pickscheduleById || "") === String(currentAdminId || ""))
    .map((order) => order.address)
    .filter(Boolean);

  const addressesToShow = assignedAddresses.length > 0 ? assignedAddresses : [];
  const uniqueAddresses = Array.from(
    new Map(addressesToShow.map((address) => [getAddressKey(address), address])).values()
  );

  return (
    <section className="admin-card table-card">
      <h2>Assigned Customer Addresses</h2>
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
            </tr>
          </thead>
          <tbody>
            {uniqueAddresses.length === 0 ? (
              <tr><td colSpan="8">No assigned addresses found</td></tr>
            ) : (
              uniqueAddresses.map((address) => {
                const receiverName = [address.receiverFirstName, address.receiverLastName]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr key={getAddressKey(address)}>
                    <td>{formatValue(receiverName)}</td>
                    <td>{formatValue(address.receiverPhone)}</td>
                    <td>{formatValue(address.receiverEmail)}</td>
                    <td>{formatValue(address.apartment)}</td>
                    <td>{formatValue(address.city)}</td>
                    <td>{formatValue(address.state)}</td>
                    <td>{formatValue(address.zip)}</td>
                    <td>{formatValue(address.country)}</td>
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
