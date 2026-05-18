import React from "react";

const UserModal = ({
  currentUser,
  setCurrentUser,
  editMode,
  onClose,
  onSubmit,
}) => {

  return (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>
          {editMode
            ? "Edit User"
            : "Create User"}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={currentUser.name}
          onChange={(e) =>
            setCurrentUser({
              ...currentUser,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={currentUser.email}
          onChange={(e) =>
            setCurrentUser({
              ...currentUser,
              email: e.target.value,
            })
          }
        />

        {!editMode && (

          <input
            type="password"
            placeholder="Password"
            value={currentUser.password}
            onChange={(e) =>
              setCurrentUser({
                ...currentUser,
                password:
                  e.target.value,
              })
            }
          />

        )}

        <select
          value={currentUser.role}
          onChange={(e) =>
            setCurrentUser({
              ...currentUser,
              role: e.target.value,
            })
          }
        >

          <option value="USER">
            USER
          </option>

          <option value="ADMIN">
            ADMIN
          </option>

        </select>

        <div className="modal-actions">

          <button
            onClick={onSubmit}
          >
            {editMode
              ? "Update"
              : "Create"}
          </button>

          <button
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

export default UserModal;