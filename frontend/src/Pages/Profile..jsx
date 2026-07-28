import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const emptyUser = {
  fullName: "",
  email: "",
  phoneNo: "",
  address: "",
  street: "",
  houseNo: "",
  postalCode: "",
  country: "",
  role: "",
};

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read stored user:", error);
    return null;
  }
}

function getStoredToken() {
  const savedUser = getStoredUser();

  return (
    savedUser?.token ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    null
  );
}

function updateStoredUser(updatedUser) {
  const isLocalStorageUser = Boolean(
    localStorage.getItem("user")
  );

  if (isLocalStorageUser) {
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  } else {
    sessionStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  }
}

export default function Profile() {
  const initialStoredUser = getStoredUser();
  const token = getStoredToken();

  const [user, setUser] = useState({
    ...emptyUser,
    ...initialStoredUser,
  });

  const [formData, setFormData] = useState({
    ...emptyUser,
    ...initialStoredUser,
  });

  const [cv, setCv] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("success");

  useEffect(() => {
    async function loadProfileAndCV() {
      if (!token) {
        setMessageType("error");
        setMessage(
          "Your login session is missing. Please log in again."
        );
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        setMessage("");

        const [profileResponse, cvResponse] =
          await Promise.all([
            fetch(`${API_URL}/auth/profile`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch(`${API_URL}/auth/cv`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const profileData =
          await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(
            profileData.message ||
              "Unable to load profile"
          );
        }

        const completeUser = {
          ...emptyUser,
          ...initialStoredUser,
          ...profileData,
          token,
        };

        setUser(completeUser);
        setFormData(completeUser);
        updateStoredUser(completeUser);

        if (cvResponse.ok) {
          const cvData = await cvResponse.json();
          setCv(cvData.cv || null);
        } else {
          setCv(null);
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        setMessageType("error");
        setMessage(error.message);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfileAndCV();
  }, [token]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleEditToggle() {
    if (isEditing) {
      // Restore the original values when cancelling.
      setFormData(user);
      setMessage("");
    }

    setIsEditing((previousValue) => !previousValue);
  }

  async function handleSave() {
    if (!token) {
      setMessageType("error");
      setMessage(
        "Token missing. Please log in again."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phoneNo: formData.phoneNo,
            address: formData.address,
            street: formData.street,
            houseNo: formData.houseNo,
            postalCode: formData.postalCode,
            country: formData.country,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Profile update failed"
        );
      }

      const updatedUser = {
        ...user,
        ...data,
        token,
      };

      setUser(updatedUser);
      setFormData(updatedUser);
      updateStoredUser(updatedUser);

      setIsEditing(false);
      setMessageType("success");
      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error("Profile update error:", error);
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFF]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

          <p className="mt-4 font-semibold text-[#3D4A63]">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFF] px-5 py-10 font-['Segoe_UI',system-ui,sans-serif] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-[#DDEAFC] bg-white p-8 shadow-[0_10px_30px_rgba(21,101,192,0.08)]">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-400 text-4xl font-bold text-white shadow-lg">
              {user.fullName
                ? user.fullName
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#07192E]">
                {user.fullName || "User"}
              </h1>

              <p className="mt-1 text-[#3D4A63]">
                {user.role || "Add your role"}
              </p>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>

            <div className="sm:ml-auto">
              <button
                type="button"
                onClick={handleEditToggle}
                className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-6 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] transition-transform hover:-translate-y-0.5"
              >
                {isEditing
                  ? "Cancel"
                  : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {message && (
          <p
            className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${
              messageType === "error"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
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
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-8 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
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
                  ? `Saved CV: ${
                      cv.data.personal.fullName
                    } - ${
                      cv.data.personal
                        .jobTitle ||
                      "No title"
                    }`
                  : "Create and manage your professional CV."}
              </p>
            </div>

            <Link
              to="/CreateCV"
              state={{ cv }}
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

function ProfileField({
  label,
  name,
  value,
  isEditing,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm text-gray-500"
      >
        {label}
      </label>

      {isEditing ? (
        <input
          id={name}
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