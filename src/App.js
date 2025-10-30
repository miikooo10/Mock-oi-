import React, { useState, useEffect } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import "./App.css";

const API_URL = "https://69032fc5d0f10a340b231005.mockapi.io/users";

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching users from:", API_URL);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error("API did not return an array");
      }
      
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users: " + error.message);
      setUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Create or update user
  const saveUser = async (userData) => {
    setError("");
    try {
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser ? `${API_URL}/${editingUser.id}` : API_URL;
      
      console.log("Saving user to:", url);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await fetchUsers(); // Refresh the list
      setEditingUser(null);
      
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Failed to save user: " + error.message);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setError("");
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user: " + error.message);
      }
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>User Management System</h1>
        
        {error && (
          <div style={{ 
            background: "#ffebee", 
            color: "#c62828", 
            padding: "10px", 
            borderRadius: "5px",
            marginBottom: "20px"
          }}>
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError("")} 
              style={{ marginLeft: "10px", float: "right" }}
            >
              ×
            </button>
          </div>
        )}
        
        <div className="content">
          <div className="form-section">
            <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
            <UserForm 
              user={editingUser}
              onSubmit={saveUser}
              onCancel={editingUser ? cancelEdit : null}
            />
          </div>
          
          <div className="list-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Users ({Array.isArray(users) ? users.length : 0})</h2>
              <button onClick={fetchUsers} className="btn btn-primary">
                Refresh
              </button>
            </div>
            
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <UserList 
                users={users}
                onEdit={editUser}
                onDelete={deleteUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;