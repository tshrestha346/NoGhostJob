import axios from 'axios';
const API_URL = "http://localhost:5000/api";

export async function getSettings() {
  const response = await axios.get(`${API_URL}/admin/settings`);

  return {
    settings: response.data?.settings || null,
  };
}