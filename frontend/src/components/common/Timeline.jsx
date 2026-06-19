/* Reusable delivery status timeline. */
function Timeline({ steps, activeIndex }) {
  return (
    <div className="flex items-center my-4 overflow-x-auto">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 min-w-[110px]">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border ${i <= activeIndex ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-slate-100 text-slate-400 border-slate-200"}`}>{i + 1}</div>
            <span className="text-[10px] text-slate-500 mt-1 text-center w-20">{step.replace("_", " ")}</span>
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-px mx-1 mb-4 ${i < activeIndex ? "bg-blue-300" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  );
}
export default Timeline;
