/* Reusable button for table/actions. Keeps buttons aligned and responsive. */
const styles = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-indigo-500 hover:bg-indigo-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  neutral: "bg-slate-200 hover:bg-slate-300 text-slate-700",
  disabled: "bg-slate-400 text-white cursor-not-allowed",
};

function ActionButton({ children, variant = "primary", disabled, onClick, type = "button" }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[88px] px-4 py-2 rounded-lg text-sm font-semibold transition ${
        disabled ? styles.disabled : styles[variant]
      }`}
    >
      {children}
    </button>
  );
}

export default ActionButton;
