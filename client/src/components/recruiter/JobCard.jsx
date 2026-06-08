import { Briefcase, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const JobCard = ({ job, onEdit, onDelete, onApplicants }) => {
  return (
    <Card className=" bg-white border border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer">
      <CardContent className="p-5">
        <h2 className="text-lg font-bold">{job.title}</h2>

        <p className="text-gray-600">{job.company}</p>

        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>

        <div className="flex items-center gap-2 mt-2 text-purple-600">
          <Briefcase className="w-4 h-4" />
          {job.jobType}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onEdit(job)}
            className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            Edit
          </button>

          <button
            onClick={() => onApplicants(job)}
            className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
          >
            Applicants
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition">
                Delete
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white rounded-2xl shadow-2xl border max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Job?</AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to delete this job posting? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="px-6 py-2 font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-100">
                  No
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => onDelete(job)}
                  className="px-6 py-2 font-semibold bg-red-600 text-white hover:bg-red-700"
                >
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
