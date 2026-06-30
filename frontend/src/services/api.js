const API_URL = "http://localhost:5000/api";

export async function fetchJobs(keyword = "", loc = "") {
  const res = await fetch(
    `${API_URL}/jobs?keyword=${encodeURIComponent(keyword)}&loc=${encodeURIComponent(loc)}`
  );
  return res.json();
}

export async function fetchCompanies() {
  const res = await fetch(`${API_URL}/companies`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function fetchTestimonials() {
  const res = await fetch(`${API_URL}/testimonials`);
  return res.json();
}

export async function subscribeNewsletter(email) {
  const res = await fetch(`${API_URL}/newsletter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return res.json();
}