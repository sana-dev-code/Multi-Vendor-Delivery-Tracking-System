import Sidebar from "./Sidebar";

function Layout({ children, title }) {
  return (
    <div className="ml-72 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <div className="bg-white shadow-sm px-8 py-5 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-slate-500">
              Multi Vendor Delivery Tracking Platform
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
              A
            </div>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Layout;