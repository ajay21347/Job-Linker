const colors = {
  Applied: "bg-blue-100 text-blue-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-purple-100 text-purple-700",
  "Interview Scheduled": "bg-indigo-100 text-indigo-700",
  Selected: "bg-green-100 text-green-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
