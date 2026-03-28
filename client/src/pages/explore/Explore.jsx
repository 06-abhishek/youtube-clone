import React from "react";
import AllVideoCardGrid from "../../features/video/AllVideoCardGrid";
import SearchInput from "../../features/search/SearchInput";

const Explore = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1]">
      <SearchInput />
      <AllVideoCardGrid />
    </div>
  );
};

export default Explore;
