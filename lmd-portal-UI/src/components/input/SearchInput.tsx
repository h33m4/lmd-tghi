import React from "react";

// icons
import SearchIcon from "../../../public/assets/icons/search.svg";

const SearchInput = () => {
  return (
    <div className="h-[38px] md:h-[28px] relative w-56">
      <input
        type={"search"}
        className="absolute h-full w-full border-[1px] border-primary rounded-[50px] bg-th-textbox-fill placeholder:text-th-text-placeholder  text-sm pl-8 mt-[0.2px]"
        placeholder="Search for anything"
      />
      <div className="absolute flex h-full items-center left-2.5">
        <SearchIcon width="15" height="19" viewBox="0 0 19 19" />
      </div>
    </div>
  );
};

export default SearchInput;
