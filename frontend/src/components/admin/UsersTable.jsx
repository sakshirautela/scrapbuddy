import React from "react";

const UsersTable = ({
  users,
  onEdit,
  onDelete,
  onAdd,
}) => {

  return (

    <div className="table-container">

      <div className="table-header">

        <h2>
          Users
        </h2>

        <button
          onClick={onAdd}
        >
          Add User
        </button>

      </div>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Name</th>

            <th>Email</th>

            <th>Role</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.id}>

              <td>{user.id}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>

                <button
                  onClick={() =>
                    onEdit(user)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    onDelete(user.id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default UsersTable;