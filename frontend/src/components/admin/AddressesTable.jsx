import React from "react";

const AddressesTable = ({
  addresses,
}) => {

  return (

    <div className="table-container">

      <h2>
        Addresses
      </h2>

      <table>

        <thead>

          <tr>

            <th>City</th>

            <th>Country</th>

            <th>Phone</th>

          </tr>

        </thead>

        <tbody>

          {addresses.map((a) => (

            <tr key={a.id}>

              <td>
                {a.city}
              </td>

              <td>
                {a.country}
              </td>

              <td>
                {a.receiverPhone}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default AddressesTable;