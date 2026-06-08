import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const ApplicantTable = ({ applicants }) => {
  return (
    <div className="w-full overflow-hidden bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-purple-200">
            <th className="w-1/4 px-6 py-5 text-left font-bold text-gray-800 border-r border-purple-200">
              Name
            </th>

            <th className="w-1/3 px-6 py-5 text-left font-bold text-gray-800 border-r border-purple-200">
              Email
            </th>

            <th className="w-1/5 px-6 py-5 text-left font-bold text-gray-800 border-r border-purple-200">
              Job Title
            </th>

            <th className="w-1/5 px-6 py-5 text-left font-bold text-gray-800 border-r border-purple-200">
              Applied Date
            </th>

            <th className="w-1/5 px-6 py-5 text-left font-bold text-gray-800 border-r border-purple-200">
              Status
            </th>

            <th className="w-1/5 px-6 py-5 text-left font-bold text-gray-800">
              Resume
            </th>
          </tr>
        </thead>

        <tbody>
          {applicants.map((app) => (
            <tr
              key={app._id}
              className="border-b border-purple-100 hover:bg-purple-50/70 transition-all duration-200"
            >
              <td className="px-6 py-6 border-r border-purple-100 font-medium text-gray-800">
                {app.applicant?.name}
              </td>

              <td className="px-6 py-6 border-r border-purple-100 text-gray-600">
                {app.applicant?.email}
              </td>

              <td className="px-6 py-6 border-r border-purple-100">
                <Link
                  to={`/job/${app.job?._id}`}
                  className="text-purple-600 hover:text-purple-800 hover:underline font-medium"
                >
                  {app.job?.title}
                </Link>
              </td>

              <td className="px-6 py-6 border-r border-purple-100 text-gray-600">
                {new Date(app.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-6 border-r border-purple-100">
                <StatusBadge status={app.status} />
              </td>

              <td className="px-6 py-6">
                <a
                  href={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
                    app.resume?.url,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-purple-600 font-medium hover:text-purple-800 hover:underline transition"
                >
                  View Resume
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
