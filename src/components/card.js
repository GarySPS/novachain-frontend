import React from "react";
import Select from "./select";   // Adjust import path
import Icon from "./icon";       // Adjust import path
import Tooltip from "./tooltip"; // Adjust import path
import { Link } from "react-router-dom";

export default function Card({
  className,
  title,
  arrowTitle,
  option,
  setOption,
  options,
  seeAllUrl,
  tooltip,
  children,
  leftContent,
  rightContent,
}) {
  return (
    <section
  className={`card border border-theme-stroke shadow-depth-1 rounded-2xl p-1 md:p-2 transition-all ${
    className?.includes("bg-") ? className : "bg-theme-on-surface-1/90 " + (className || "")
  }`}
>
      <div className="relative z-2 flex flex-wrap items-center justify-between min-h-[2.5rem] mb-0 gap-0">
        {leftContent}
        {title && (
          <div className="flex items-center text-title-1s font-inter-display md:text-[1.125rem]">
            <span className={`truncate ${options ? "md:max-w-[33vw]" : ""}`}>{title}</span>
            {arrowTitle && (
              <Icon className="ml-3 fill-theme-primary md:ml-1.5" name="arrow-next" />
            )}
            {tooltip && <Tooltip className="-mb-0.25 md:mb-0" title={tooltip} />}
          </div>
        )}
        {options && (
          <Select
            className="shrink-0 min-w-[8.5rem] ml-3"
            value={option}
            onChange={setOption}
            items={options}
          />
        )}
        {seeAllUrl && (
          <Link
            className="shrink-0 group inline-flex items-center text-button-1 text-theme-brand ml-3"
            to={seeAllUrl}
          >
            See all
            <Icon
              className="!w-4 !h-4 ml-2 fill-theme-brand transition-transform group-hover:translate-x-0.5"
              name="arrow-next-fat"
            />
          </Link>
        )}
        {rightContent}
      </div>
      <div>{children}</div>
    </section>
  );
}
