import { useState ,useEffect} from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const savedUser = JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"));

  const [user, setUser] = useState(
    savedUser || {
      fullName: "John Doe",
      email: "john@example.com",
      phoneNo: "",
      address: "",
      street: "",
      houseNo: "",
      postalCode: "",
      country: "",
      role: "",
    }
  );console.log("saved",savedUser)
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
const [cv, setCv] = useState(null);


useEffect(() => {
  async function loadCV() {
    try {
      if (!user?.token) return;

      const response = await fetch("http://localhost:5000/api/auth/cv", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCv(data.cv);
      }
    } catch (error) {
      console.log(error);
    }
  }

  loadCV();
}, []);


  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSave() {
  try {
    setLoading(true);
    setMessage("");

    if (!user.token) {
      setMessage("Token missing. Please login again.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Profile update failed");
    }

    const updatedUser = {
      ...data,
      token: user.token,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setFormData(updatedUser);
    setIsEditing(false);
    setMessage("Profile updated successfully");
  } catch (error) {
    setMessage(error.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-[#F7FAFF] px-5 py-10 sm:px-8 lg:px-12 font-['Segoe_UI',system-ui,sans-serif]">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white p-8 shadow-[0_10px_30px_rgba(21,101,192,0.08)] border border-[#DDEAFC]">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-400 text-4xl font-bold text-white shadow-lg">
              {user.fullName?.charAt(0)?.toUpperCase()}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#07192E]">
                {user.fullName}
              </h1>

              <p className="mt-1 text-[#3D4A63]">
                {user.role || "Add your role"}
              </p>

              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="sm:ml-auto">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-6 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] transition-transform hover:-translate-y-0.5"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {message && (
          <p className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {message}
          </p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[#DDEAFC] bg-white p-7 shadow-[0_10px_30px_rgba(21,101,192,0.08)]">
            <h2 className="mb-5 text-xl font-bold text-[#07192E]">
              Personal Information
            </h2>

            <div className="space-y-4">
              <ProfileField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Email Address"
                name="email"
                value={formData.email}
                isEditing={false}
                onChange={handleChange}
              />

              <ProfileField
                label="Phone"
                name="phoneNo"
                value={formData.phoneNo}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Address"
                name="address"
                value={formData.address}
                isEditing={isEditing}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-[#DDEAFC] bg-white p-7 shadow-[0_10px_30px_rgba(21,101,192,0.08)]">
            <h2 className="mb-5 text-xl font-bold text-[#07192E]">
              Career & Location Details
            </h2>

            <div className="space-y-4">
              <ProfileField
                label="Current Role"
                name="role"
                value={formData.role}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Street"
                name="street"
                value={formData.street}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="House No"
                name="houseNo"
                value={formData.houseNo}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                isEditing={isEditing}
                onChange={handleChange}
              />

              <ProfileField
                label="Country"
                name="country"
                value={formData.country}
                isEditing={isEditing}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-8 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-[#DDEAFC] bg-white p-7 shadow-[0_10px_30px_rgba(21,101,192,0.08)]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#07192E]">
                Your Resume
              </h2>

              <p className="mt-1 text-sm text-[#3D4A63]">
  {cv?.data?.personal?.fullName
    ? `Saved CV: ${cv.data.personal.fullName} - ${cv.data.personal.jobTitle || "No title"}`
    : "Create and manage your professional CV."}
</p>
            </div>

            <Link
              to="/CreateCV"
              className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-6 py-3 text-center text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)]"
            >
            {cv ? "Edit CV" : "Create CV"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, name, value, isEditing, onChange }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="mt-1 w-full rounded-xl border border-[#DDEAFC] px-4 py-3 font-semibold text-[#3D4A63] outline-none focus:border-blue-500"
        />
      ) : (
        <p className="font-semibold text-[#3D4A63]">
          {value || "Not added yet"}
        </p>
      )}
    </div>
  );
}