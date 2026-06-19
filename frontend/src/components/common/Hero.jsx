/* Role dashboard hero card. */
function Hero({ eyebrow, title, subtitle, right }) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-900 text-white p-6 sm:p-8 shadow-xl mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">
        <div>
          <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest">{eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">{title}</h1>
          <p className="text-purple-100 mt-2 max-w-2xl">{subtitle}</p>
        </div>
        {right}
      </div>
    </div>
  );
}
export default Hero;
