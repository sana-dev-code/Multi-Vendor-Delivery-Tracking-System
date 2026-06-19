/* Reusable page heading card. */
function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-8 mb-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
}
export default PageHeader;
