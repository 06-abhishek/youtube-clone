import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaUserEdit, FaSignOutAlt, FaTrashAlt, FaUpload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCurrentUser,
  logoutUser,
  deleteUser,
} from "../../store/Slices/userSlice";
import { toast } from "react-toastify";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentUser,
    updateUserLoading: loading,
    error,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  const formatJoinDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteUser(currentUser._id)).unwrap();
        toast.success("Account deleted successfully!");
        navigate("/signup");
      } catch (err) {
        toast.error(
          "Delete account failed: " + (err.message || "Unknown error")
        );
      }
    }
  };

  if (loading || (!currentUser && !error)) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f]">
        <div className="h-8 w-8 border-4 border-t-[#3ea6ff] border-[#272727] rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser && error) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-[#272727] text-red-400 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channel Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-10 border-b border-[#272727]">
          <img
            src={currentUser.profileImage}
            alt="Profile"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover"
            onError={(e) => (e.target.src = "/default-profile.png")}
          />
          <div className="text-center sm:text-left flex-1 mt-4 sm:mt-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">
              {currentUser.name || "N/A"}
            </h1>
            <div className="text-[#aaaaaa] text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-4">
              <span>@{currentUser.username || "N/A"}</span>
              <span className="hidden sm:inline">•</span>
              <span>Joined {formatJoinDate(currentUser.createdAt)}</span>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
              <Link
                to={`/update-user/${currentUser._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-sm font-medium transition-colors"
              >
                <FaUserEdit /> Edit profile
              </Link>
              <Link
                to="/upload-video"
                className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-sm font-medium transition-colors"
              >
                <FaUpload /> Upload video
              </Link>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-sm font-medium transition-colors disabled:opacity-50"
              >
                <FaSignOutAlt /> {loading ? "..." : "Logout"}
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12">
          <h2 className="text-lg font-medium text-[#f1f1f1] mb-4">
            Account Management
          </h2>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-[#717171] hover:bg-red-500/10 hover:border-red-500 text-red-500 rounded-full text-sm font-medium transition-all"
          >
            <FaTrashAlt /> {loading ? "Deleting..." : "Delete Channel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
