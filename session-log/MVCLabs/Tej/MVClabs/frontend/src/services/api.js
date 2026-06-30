const BASE = "http://localhost:8000";

function authHeaders(){
  const token =localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}`} : {};
}

export async function login(name, password){
  const body = new URLSearchParams({username: name, password});
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body
  });

  if(!res.ok) throw new Error("Login failed");
  
  const { access_token } = await res.json();

  if (!access_token) {
    throw new Error("No access token returned");
  }

  localStorage.setItem("token", access_token);

  return access_token;
}

export function logout(){
  localStorage.removeItem("token");
}

export function isLoggedIn(){
  return !!localStorage.getItem("token");
}

export async function fetchTasks() {
  const response = await fetch(`${BASE}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function createTask(title, owner_id) {
  const response = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", ...authHeaders()
    },
    body: JSON.stringify({ title, owner_id }),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(`${BASE}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}

export async function fetchUsers() {
  const response = await fetch(`${BASE}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function createUser(name) {
  const response = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", ...authHeaders()
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}