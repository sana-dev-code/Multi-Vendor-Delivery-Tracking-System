function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`p-5 rounded-2xl shadow text-white ${color}`}>
      <div className="flex justify-between">
        <div>
          <p>{title}</p>
          <h2 className="text-4xl font-bold mt-2">{value}</h2>
        </div>

        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  );
}

export default StatsCard;