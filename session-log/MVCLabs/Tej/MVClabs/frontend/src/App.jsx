import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  deleteTask,
} from "./services/api";
import "./App.css";
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
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

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createTask(title);
      setTitle("");
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
                <button type="submit">Add</button>
                </form>

                {tasks.length === 0 ? (
                <p className="empty">No tasks found.</p>
                ) : (
                tasks.map((t) => (
                    <div key={t.id} className="task-item">
                    <span>{t.title}</span>
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