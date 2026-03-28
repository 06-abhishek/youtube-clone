import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchCurrentUser } from "../../store/Slices/userSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaImage, FaTimes } from "react-icons/fa";

function UpdateUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    currentUser,
    updateUserLoading: loading,
    error,
  } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
        gender: currentUser.gender || "",
      });
      setPreview(currentUser.profileImage || null);
    }
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (preview && preview !== currentUser?.profileImage) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, currentUser]);

  const isOwnAccount = (currentUser?._id || currentUser?.id) === id;
  const canEdit = isOwnAccount;

  if (!currentUser && loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-t-[#3ea6ff] border-[#272727] rounded-full animate-spin" />
      </div>
    );
  }

  if (!canEdit) {
    navigate("/user-profile");
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
        file.type
      )
    ) {
      toast.error("Please upload a valid image (JPEG, PNG, GIF, or WebP)");
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }
    setProfileImage(file);
    setPreview(
      file ? URL.createObjectURL(file) : currentUser?.profileImage || null
    );
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        updateData.append(key, value);
      }
    });
    if (profileImage) {
      updateData.append("profileImage", profileImage);
    }

    try {
      await dispatch(
        updateUser({
          userId: currentUser._id || currentUser.id,
          formData: updateData,
        })
      ).unwrap();
      toast.success("Profile updated successfully!");
      navigate("/user-profile");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg bg-[#0f0f0f] border border-[#272727] p-8 rounded-xl shadow-none">
        <h2 className="text-2xl font-bold text-[#f1f1f1] mb-8">
          Update Profile
        </h2>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 text-red-400 p-3 rounded mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
            icon={<FaUser />}
          />
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="johndoe123"
            error={errors.username}
            icon={<FaUser />}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            error={errors.email}
            icon={<FaEnvelope />}
          />
          <Input
            label="Password (leave blank to keep current)"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••"
            error={errors.password}
            icon={<FaLock />}
          />
          <div>
            <label className="block text-sm font-medium text-[#aaaaaa] mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-3 bg-transparent border ${
                errors.gender ? "border-red-400" : "border-[#717171]"
              } text-[#f1f1f1] rounded focus:border-[#3ea6ff] focus:outline-none focus:ring-1 focus:ring-[#3ea6ff]`}
            >
              <option value="" className="bg-[#272727]">
                Select Gender
              </option>
              <option value="male" className="bg-[#272727]">
                Male
              </option>
              <option value="female" className="bg-[#272727]">
                Female
              </option>
              <option value="other" className="bg-[#272727]">
                Other
              </option>
            </select>
            {errors.gender && (
              <p className="text-red-400 text-xs mt-1">{errors.gender}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#aaaaaa] mb-1">
              Profile Picture
            </label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="file"
                name="profileImage"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="profileImage"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => (e.target.src = "/default-profile.png")}
                />
              )}
              <label
                htmlFor="profileImage"
                className="text-sm font-medium text-[#3ea6ff] hover:text-[#65b8ff] cursor-pointer"
              >
                {profileImage ? "Change Image" : "Upload Image"}
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-sm text-[#aaaaaa] hover:text-[#f1f1f1]"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end gap-4">
            <Link
              to="/user-profile"
              className="text-[#f1f1f1] font-medium text-sm hover:text-[#aaaaaa] px-4 py-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3ea6ff] text-[#0f0f0f] font-medium text-sm px-5 py-2 rounded-full hover:bg-[#65b8ff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;

const Input = ({ label, type = "text", error, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-[#aaaaaa] mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aaaaaa]">
        {icon}
      </span>
      <input
        type={type}
        {...props}
        className={`w-full p-3 pl-10 bg-transparent border ${
          error ? "border-red-400" : "border-[#717171]"
        } text-[#f1f1f1] rounded focus:border-[#3ea6ff] focus:outline-none focus:ring-1 focus:ring-[#3ea6ff] placeholder-[#717171]`}
        placeholder={props.placeholder}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);
