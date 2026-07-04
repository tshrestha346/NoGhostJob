import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  deleteTask,
  fetchUsers,
  createUser,
  login,
  logout,
  isLoggedIn,
  fetchUsersTasks
} from "./services/api";
import "./App.css";
import { jwtDecode } from "jwt-decode";

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await login(name, password);
      onLogin();
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="app">
      <div className="login-card">
        <h1>✨ Task Manager</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [owner_id, setOwnerId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (isLoggedIn()) {
        setLoggedIn(true);

        await loadUsers();
        await loadTasks();
        console.log("Token:", storedToken);
        try {
          const { exp } = jwtDecode(storedToken);
          console.log('date', Date.now() < exp * 1000)
          const isTokenValid = Date.now() < exp * 1000;
          console.log('isTokenValid', isTokenValid)
          return isTokenValid;
        } catch {
          return false;
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  const handleLogin = async () => {
    setLoggedIn(true);

    await loadUsers();
    await loadTasks();
  };

  const handleLogout = () => {
    logout();

    setLoggedIn(false);

    setTasks([]);
    setUsers([]);
  };

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

  const fetchUserTasks = async (id) => {
    try {
      const data = await fetchUsersTasks(id);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }
  if(!loggedIn && !tokenValid) {
    console.log("Token is invalid or expired. Logging out.");
    logout();
  }
  console.log('loggedIn', loggedIn, 'tokenValid', tokenValid)
  if (!loggedIn) {
    console.log("Not logged in, showing login screen");
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className="container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <h1>✨ Task Manager</h1>

        <form className="task-form" onSubmit={handleCreateUser}>
          <input
            type="text"
            placeholder="Enter user name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

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
            onChange={(e) => {
              const id = e.target.value;
              setOwnerId(id);
              fetchUserTasks(id);
            }}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              width: "200px",
              backgroundColor: "#fff",
              cursor: "pointer",
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

        {tasks.length === 0 ? (
          <p className="empty">No tasks found.</p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="task-item">
              <span>{t.title}</span>
              {t.owner_name ? (
                  <span style={{ fontStyle: "italic", color: "#555" }}>
                    (Owner: {t.owner_name})
                  </span>
                ) : (
                  <span></span>
                )
              }
              <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}