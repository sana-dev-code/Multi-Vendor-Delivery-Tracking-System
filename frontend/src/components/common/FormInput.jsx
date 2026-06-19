/* Reusable input with optional icon and label. */
function FormInput({ label, icon: Icon, className = "", ...props }) {
  return (
    <div>
      {label && <label className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">{label}</label>}
      <div className="relative mt-2">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />}
        <input
          {...props}
          className={`w-full h-12 rounded-xl border border-slate-200 bg-white/75 ${Icon ? "pl-11" : "pl-4"} pr-4 text-sm outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 ${className}`}
        />
      </div>
    </div>
  );
}
export default FormInput;
