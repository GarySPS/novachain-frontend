import Icon from "./icon"; // Adjust import path if needed

export default function ButtonBack({ className = "", title = "Back", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center h-12 px-4 mb-6 rounded-full bg-theme-on-surface-2 text-theme-primary font-semibold text-title-1s shadow hover:bg-theme-on-surface-3 focus:outline-none focus:ring-2 focus:ring-theme-brand transition-all ${className}`}
    >
      <span className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-theme-on-surface-1 group-hover:bg-theme-on-surface-3 transition-all">
        <Icon
          className="fill-theme-secondary group-hover:fill-theme-primary transition-colors"
          name="arrow-left"
        />
      </span>
      <span className="truncate">{title}</span>
    </button>
  );
}
