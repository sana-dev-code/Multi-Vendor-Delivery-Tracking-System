/* Shared responsive glassmorphism layout for auth pages. */
function AuthLayout({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[radial-gradient(circle_at_top,#a855f7_0%,#f5d0fe_35%,#ffffff_75%)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,.12)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="relative w-full max-w-[520px] bg-white/45 backdrop-blur-2xl border border-white/70 rounded-[28px] shadow-2xl px-5 sm:px-9 py-8">
        <div className="text-center mb-8">
          {Icon && (
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-xl mb-5">
              <Icon className="text-3xl" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
export default AuthLayout;
