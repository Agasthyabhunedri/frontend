import React, { useEffect, useState } from 'react';
import axios from 'axios';

//const API = "http://localhost:8080/users";
const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return await res.json();
};


export default function App() {
  const [users, setUsers] = useState([]); // stores all users from backend
  const [form, setForm] = useState({ name: '', email: '' }); // stores input for name/email
  const [editId, setEditId] = useState(null); // stores the ID of the user being edited
  const [searchId, setSearchId] = useState(''); // stores the ID for GET /users/:id

  // 🔁 Fetch all users on first render
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // 🟦 GET /users
  const fetchAllUsers = () => {
    axios.get(`${BASE_URL}/users`)
      .then(res => setUsers(res.data)) // update the users state
      .catch(() => alert("Fetch failed"));
  };

  // 🟦 GET /users/:id
  const fetchUserById = () => {
    if (!searchId) return alert("Enter ID");
    axios.get(`${BASE_URL}/users/${searchId}`)
      .then(res => alert(JSON.stringify(res.data, null, 2))) // show user info
      .catch(() => alert("User not found"));
  };

  // Handle form input changes
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟩 POST /users (Create) or 🟧 PUT /users/:id (Update)
  const handleSubmit = () => {
    if (!form.name || !form.email) return alert("Name and Email required");

    if (editId) {
      // PUT
      axios.put(`${BASE_URL}/users/${editId}`, form)
        .then(() => {
          alert("User updated");
          setEditId(null);
          setForm({ name: '', email: '' });
          fetchAllUsers();
        })
        .catch(() => alert("Update failed"));
    } else {
      // POST
      axios.post(`${BASE_URL}/users`, form)
        .then(() => {
          alert("User added");
          setForm({ name: '', email: '' });
          fetchAllUsers();
        })
        .catch(() => alert("Add failed"));
    }
  };

  // 🟥 DELETE /users/:id
  const handleDelete = (id) => {
    axios.delete(`${BASE_URL}/users/${id}`)
      .then(() => {
        alert("User deleted");
        fetchAllUsers();
      })
      .catch(() => alert("Delete failed"));
  };

  // When clicking "Edit", populate form and set ID
  const startEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user.ID); // capital 'ID' because Go sends JSON with capital 'ID'
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>User Management</h1>

      {/* CREATE / UPDATE FORM */}
      <h3>{editId ? "Edit User" : "Add User"}</h3>
      <input
        placeholder="Name"
        name="name"
        value={form.name}
        onChange={handleInput}
      /><br />
      <input
        placeholder="Email"
        name="email"
        value={form.email}
        onChange={handleInput}
      /><br />
      <button onClick={handleSubmit}>
        {editId ? "Update (PUT)" : "Add (POST)"}
      </button>

      {/* GET /users/:id */}
      <h3>Get Single User</h3>
      <input
        placeholder="Enter ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <button onClick={fetchUserById}>Get User</button>

      {/* Display all users */}
      <h3>All Users (GET)</h3>
      <ul>
        {users.map(user => (
          <li key={user.ID}>
            <b>{user.name}</b> - {user.email}
            <button onClick={() => startEdit(user)}>✏️ Edit</button>
            <button onClick={() => handleDelete(user.ID)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
