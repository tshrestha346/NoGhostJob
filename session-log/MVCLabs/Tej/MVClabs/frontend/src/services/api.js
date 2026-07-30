const BASE = "http://localhost:8000";

export async function fetchTasks(){
    const res = await fetch(`${BASE}/tasks/`);
    if (!res.ok) throw new Error("Failed to load tasks");
    return res.json();
}