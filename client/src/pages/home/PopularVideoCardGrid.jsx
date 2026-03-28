import React from "react";
import VideoCardGrid from "../../components/VideoCardGrid";
import { fetchPopularVideos } from "../../store/Slices/videoSlice";

const PopularVideoCardGrid = () => {
  return (
    <div className="w-full bg-[#0f0f0f] text-[#f1f1f1]">
      <VideoCardGrid
        title="Popular Videos"
        thunk={() => fetchPopularVideos({ limit: 8 })}
        selector={(state) => ({
          items: state.video.popularVideos || [],
          loading: state.video.popularVideosLoading || false,
          error: state.video.error || null,
        })}
        linkPrefix="/video"
        className="py-6 px-4 sm:px-6 lg:px-8"
      />
    </div>
  );
};

export default PopularVideoCardGrid;
