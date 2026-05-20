import React from "react";
import { formatValue } from "../../utils/adminDashboard";

const AddressesTable = ({ addresses }) => (
  <section className="admin-card table-card">
    <h2>Addresses</h2>
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
          {addresses.length === 0 ? (
            <tr><td colSpan="9">No Addresses Found</td></tr>
          ) : (
            addresses.map((address) => {
              const receiverName = [address.receiverFirstName, address.receiverLastName]
                .filter(Boolean)
                .join(" ");

              return (
                <tr key={address.id}>
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

export default AddressesTable;
