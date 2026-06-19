/* Responsive table wrapper. Keeps big tables usable on small screens. */
function DataTable({ columns, children, isEmpty, emptyText = "No records found" }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-x-auto mb-6">
      <table className="w-full min-w-[900px]">
        <thead className="bg-slate-100 text-slate-600 text-sm">
          <tr>{columns.map((c) => <th key={c} className="p-4 text-left font-semibold">{c}</th>)}</tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr><td colSpan={columns.length} className="p-10 text-center text-slate-400">{emptyText}</td></tr>
          ) : children}
        </tbody>
      </table>
    </div>
  );
}
export default DataTable;
