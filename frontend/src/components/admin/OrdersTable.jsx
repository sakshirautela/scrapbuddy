import React from "react";

const OrdersTable = ({
  orders,
}) => {

  return (

    <div className="table-container">

      <h2>
        Orders
      </h2>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Status</th>

            <th>Pickup Date</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order.id}>

              <td>
                {order.id}
              </td>

              <td>
                {order.status
                  ? "Done"
                  : "Pending"}
              </td>

              <td>
                {order.pickupDate}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default OrdersTable;