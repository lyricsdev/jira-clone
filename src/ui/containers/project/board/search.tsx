import React from "react";
import { observer } from "mobx-react-lite";
import cx from "classix";
import { projectStore } from "infrastructure/store";
import { Icon } from "ui/components/icon";

export const Search = observer((): JSX.Element => {
  const search = projectStore.filters.search;

  const setSearch = (value: string) => {
    projectStore.filters.search = value;
  };

  const clearSearch = () => setSearch("");
  const renderIcon = (): JSX.Element => {
    return search.length === 0 ? (
      <SearchIcon />
    ) : (
      <ClearIcon onClick={clearSearch} />
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <div className="relative w-fit">
      <input
        value={search}
        type="text"
        placeholder="Filter issues"
        onChange={handleChange}
        className="border-1 box-border h-[40px] w-[120px] rounded border-none bg-grey-100 py-2 pr-8 pl-2 outline outline-2 outline-grey-400 duration-200 ease-in-out placeholder:font-primary-light placeholder:text-sm placeholder:text-xs placeholder:text-font-light placeholder:duration-200 placeholder:ease-in-out hover:bg-grey-300 focus:w-[190px] focus:bg-white focus:shadow-blue focus:outline-primary-main"
      />
      <span className="absolute right-0 top-1/2 -translate-y-1/2 px-2">
        {renderIcon()}
      </span>
    </div>
  );
});

const iconBaseClass = cx(
  "flex border-none justify-center items-center font-icon z-10"
);

const SearchIcon = (): JSX.Element => (
  <span className={iconBaseClass}>
    <Icon name="lens" size={16} />
  </span>
);

const ClearIcon = ({ onClick }: ClearIconProps): JSX.Element => (
  // onMouseDown is needed because blur (unfocus) happens
  // before 'click' event, but not before 'onMouseDown'
  <button
    onMouseDown={onClick}
    className={cx(iconBaseClass, "cursor-pointer rounded hover:bg-grey-300")}
  >
    <Icon name="close" size={16} />
  </button>
);

interface ClearIconProps {
  onClick: () => void;
}