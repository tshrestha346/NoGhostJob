import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  deleteTask,
  fetchUsers,
  createUser
} from "./services/api";
import "./App.css";
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [owner_id, setOwnerId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadTasks();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadUsers();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createTask(title, owner_id);
      setTitle("");
      setOwnerId("");
      await loadTasks(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await createUser(name);
      setName("");
      await loadUsers(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createTask(title, owner_id);
      setTitle("");
      setOwnerId("");
      await loadTasks(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      await loadTasks(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

    return (
        <div className="app">
            <div className="container">
                <h1>✨ Task Manager</h1>

                <form className="task-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <select
                  name="user_id"
                  id="user_id"
                  value={owner_id}
                  onChange={(e) => setOwnerId(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    width: "200px",
                    backgroundColor: "#fff",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Select Owner</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                <button type="submit">Add</button>
                </form>

                <form className="task-form" onSubmit={handleCreateUser}>
                <input
                    type="text"
                    placeholder="Enter user name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Add</button>
                </form>

                {tasks.length === 0 ? (
                <p className="empty">No tasks found.</p>
                ) : (
                tasks.map((t) => (
                    <div key={t.id} className="task-item">
                    <span>{t.title}</span> 
                    <span style={{ fontStyle: "italic", color: "#555" }}>
                        (Owner: {t.owner_name})
                    </span>
                    <button
                        className="delete-btn"
                        onClick={() => handleDelete(t.id)}
                    >
                        Delete
                    </button>
                    </div>
                ))
                )}
            </div>
        </div>
    );
}