/* Reusable tab buttons. */
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-4 whitespace-nowrap font-semibold ${active === tab.id ? "text-blue-700 border-b-2 border-blue-600" : "text-slate-500"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
export default Tabs;
