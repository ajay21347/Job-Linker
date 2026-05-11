import App from "@/App";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/utils/api";
import { FileText, Mail, Phone, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Applicants = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/application/applicants/${jobId}`);
        setApplications(res.data.applications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApplicants();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Applicants</h1>
      {applications.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card
              key={app._id}
              className="shadow-lg hover::shadow-xl transition duration-300"
            >
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <User2 className="text-purple-600 w-5 h-5" />
                  <h2 className="text-xl font-semibold">
                    {app.applicant?.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  {app.applicant?.email}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-green-600" />
                  {app.applicant?.phone || "No phone provided"}
                </div>

                <div className="flex gap-3 mt-3">
                  <Button
                    variant="secondary"
                    onClick={() => window.open(app.applicant?.resume, "_blank")}
                  >
                    <FileText className="w-4 h4 mr-1" />
                    View Resume
                  </Button>
                </div>
                <Button onClick={() => window.open(app.applicant?.resume)}>
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;
