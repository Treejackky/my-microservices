"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.scss';

type User = { id: number; name: string };

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_USERS_URL ||
  'http://localhost:3000';

export default function Index() {
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`);
      if (res.ok) {
        setUsers(await res.json());
      } else {
        console.error('Failed to fetch users', res.statusText);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        setNewName('');
        fetchUsers();
      } else {
        console.error('Failed to create user', res.statusText);
      }
    } catch (err) {
      console.error('Failed to create user', err);
    }
  };

  const startEdit = (user: User) => {
    setEditId(user.id);
    setEditName(user.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        cancelEdit();
        fetchUsers();
      } else {
        console.error('Failed to update user', res.statusText);
      }
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchUsers();
      } else {
        console.error('Failed to delete user', res.statusText);
      }
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>
      <form onSubmit={addUser} className={styles.form}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New user name"
        />
        <button type="submit">Add</button>
      </form>
      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user.id} className={styles.listItem}>
            {editId === user.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <div className={styles.actions}>
                  <button onClick={() => saveEdit(user.id)}>Save</button>
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{user.name}</span>
                <div className={styles.actions}>
                  <button onClick={() => startEdit(user)}>Edit</button>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
