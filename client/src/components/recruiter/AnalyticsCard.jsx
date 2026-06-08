const AnalyticsCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
};

export default AnalyticsCard;
