import React from "react";

export default function TabsSame({ className = "", items, value, setValue }) {
    const handleClick = (val, onClick) => {
        setValue(val);
        if (onClick) onClick();
    };

    // Handles up to 4 tabs, background slider for active tab
    let beforeClass = "";
    if (items.length === 3) {
        beforeClass = `before:w-1/3 ${
            items[1].value === value
                ? "before:left-1/3"
                : items[2].value === value
                ? "before:left-2/3"
                : ""
        }`;
    } else if (items.length === 4) {
        beforeClass = `before:w-1/4 ${
            items[1].value === value
                ? "before:left-1/4"
                : items[2].value === value
                ? "before:left-2/4"
                : items[3].value === value
                ? "before:left-3/4"
                : ""
        }`;
    } else {
        beforeClass = `before:w-1/2 ${items[1] && items[1].value === value ? "before:left-1/2" : ""}`;
    }

    return (
        <div className={`p-1 bg-theme-n-8 rounded-xl ${className}`}>
            <div
                className={`relative flex before:absolute before:top-0 before:left-0 before:h-8 before:bg-theme-on-surface-1 before:rounded-lg before:shadow-[0_0.125rem_0.25rem_0_rgba(0,0,0,0.15)] before:transition-all before:duration-300 ${beforeClass}`}
            >
                {items.map((item, idx) => (
                    <button
                        className={`relative z-2 flex justify-center items-center flex-1 h-8 text-base-1s text-theme-secondary transition-colors hover:text-theme-primary outline-none ${
                            item.value === value ? "!text-theme-primary" : ""
                        }`}
                        onClick={() => handleClick(item.value, item.onClick)}
                        key={idx}
                    >
                        {item.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
