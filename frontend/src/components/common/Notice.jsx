/* Reusable toast notice. */
function Notice({ notice, onClose }) {
  if (!notice) return null;
  const ok = notice.type === "success";
  return (
    <div className={`fixed top-6 right-6 z-[999] rounded-2xl shadow-xl px-5 py-4 border ${ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
        <p className="font-semibold text-sm">{notice.text}</p>
        <button onClick={onClose} className="ml-2 font-bold text-lg leading-none">×</button>
      </div>
    </div>
  );
}
export default Notice;
