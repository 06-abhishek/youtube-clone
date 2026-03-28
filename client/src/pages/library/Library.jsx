import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/Slices/userSlice";
import { Link, useLocation } from "react-router-dom";
import { FaRedo, FaPlayCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

const Library = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser()).catch(() => {
      toast.error("Failed to load library. Please try again.");
    });
  }, [dispatch, location.pathname]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRetry = () => {
    dispatch(fetchCurrentUser());
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton
            height={180}
            width="100%"
            baseColor="#272727"
            highlightColor="#3f3f3f"
            borderRadius="0.75rem"
          />
          <div>
            <Skeleton
              height={20}
              width="90%"
              baseColor="#272727"
              highlightColor="#3f3f3f"
              className="mb-1"
            />
            <Skeleton
              height={16}
              width="60%"
              baseColor="#272727"
              highlightColor="#3f3f3f"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderVideoCard = (item, type) => (
    <motion.li
      key={item._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
    >
      <Link
        to={`/video/${item.videoId._id}`}
        className="block"
        aria-label={`View video: ${item.videoId.title || "Untitled Video"}`}
      >
        <div className="relative mb-2">
          <img
            src={item.videoId.thumbnailUrl || "/default-thumbnail.png"}
            alt={item.videoId.title || "Untitled Video"}
            className="w-full aspect-video object-cover rounded-xl transition-transform duration-200 group-hover:rounded-none"
            loading="lazy"
            onError={(e) => (e.target.src = "/default-thumbnail.png")}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
            <FaPlayCircle className="text-white text-4xl" />
          </div>
        </div>
        <div className="pr-6">
          <h3 className="text-[#f1f1f1] text-base font-semibold line-clamp-2 leading-tight">
            {item.videoId.title || "Untitled Video"}
          </h3>
          <p className="text-[#aaaaaa] text-sm mt-1">
            {type === "liked" ? "Liked" : "Saved"} •{" "}
            {formatDate(type === "liked" ? item.likedAt : item.savedAt)}
          </p>
        </div>
      </Link>
    </motion.li>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] p-4 sm:p-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-2">
          Library
        </h1>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-[#272727] text-red-400 rounded-lg flex items-center justify-between"
            >
              <span>{error}</span>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-colors font-medium"
              >
                <FaRedo /> Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !currentUser ? (
          renderSkeleton()
        ) : (
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-[#f1f1f1] mb-4">
                Liked Videos
              </h2>
              {currentUser?.likedVideos?.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                  {currentUser.likedVideos.map((item) =>
                    item.videoId && typeof item.videoId === "object" ? (
                      renderVideoCard(item, "liked")
                    ) : (
                      <li
                        key={item._id}
                        className="p-4 bg-[#272727] rounded-xl text-[#aaaaaa]"
                      >
                        Unavailable video
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-[#aaaaaa] text-sm">No liked videos yet.</p>
              )}
            </div>

            <hr className="border-[#272727]" />

            <div>
              <h2 className="text-xl font-bold text-[#f1f1f1] mb-4">
                Saved Videos
              </h2>
              {currentUser?.savedVideos?.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                  {currentUser.savedVideos.map((item) =>
                    item.videoId && typeof item.videoId === "object" ? (
                      renderVideoCard(item, "saved")
                    ) : (
                      <li
                        key={item._id}
                        className="p-4 bg-[#272727] rounded-xl text-[#aaaaaa]"
                      >
                        Unavailable video
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-[#aaaaaa] text-sm">No saved videos yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
