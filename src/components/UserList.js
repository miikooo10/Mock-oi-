import React from "react";

const UserList = ({ users, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (users.length === 0) {
    return <p>No users found. Add your first user above!</p>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Department:</strong> {user.department}</p>
            <p><strong>Created:</strong> {formatDate(user.createdAt)}</p>
          </div>
          <div className="user-actions">
            <button 
              onClick={() => onEdit(user)}
              className="btn btn-edit"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(user.id)}
              className="btn btn-delete"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
