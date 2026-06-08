const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className={`rounded-3xl shadow-lg p-5 text-white ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">{title}</p>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <Icon className="w-8 h-8" />
      </div>
    </div>
  );
};

export default StatCard;
