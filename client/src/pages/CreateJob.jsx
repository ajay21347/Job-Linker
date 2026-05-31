import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import { Briefcase, Clock3 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const CreateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    jobType: "full-time",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          const res = await api.get(`/jobs/${id}`);

          setForm({
            title: res.data.job.title,
            company: res.data.job.company,
            location: res.data.job.location,
            salary: res.data.job.salary,
            description: res.data.job.description,
            jobType: res.data.job.jobType,
            deadline: res.data.job.deadline?.split("T")[0],
          });
        } catch (error) {
          toast.error("Failed to load job");
        }
      };
      fetchJob();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (
      (!form.title.trim() || !form.company.trim() || !form,
      location.trim() || !form.description.trim())
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    if (!form.deadline) {
      toast.warning("Please select an application deadline");
      return;
    }

    if (form.salary && Number(form.salary) < 0) {
      toast.warning("Salary cannot be negative");
      return;
    }

    if (new Date(form.deadline) < new Date()) {
      toast.warning("Deadline cannot be in the past");
      return;
    }

    const loadingToast = toast.loading(
      id ? "Updating job..." : "Posting job...",
    );

    try {
      if (id) {
        await api.put(`/jobs/update/${id}`, form);

        toast.dismiss(loadingToast);
        toast.success("Job updated successfully");
      } else {
        await api.post("/jobs/create", form);

        toast.dismiss(loadingToast);
        toast.success("Job posted successfully ");
      }

      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1000);
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <Card className="w-full max-w-2xl shadow-xl bg-white/70 backdrop-blur-md border border-purple-200 transition-all duration-300 hover:shadow-2xl">
        <CardContent className="p-6 flex flex-col gap-6 overflow-visible">
          {/*Header*/}
          <div className=" flex items-center gap-2 text-xl font-bold">
            <Briefcase className="text-indigo-600" />
            {id ? "Update Job" : "Post a Job"}
          </div>

          {/* Form */}
          <div className="grid md:grid-col-2 gap-4">
            <Input
              name="title"
              placeholder="Title"
              onChange={handleChange}
              className="bg-white/70 focus:ring-2 focus:ring-indigo-400 "
            />
            <Input
              name="company"
              placeholder="Company"
              onChange={handleChange}
              className="bg-white/70 focus:ring-2 focus:ring-indigo-400"
            />
            <Input
              name="location"
              placeholder="Location"
              onChange={handleChange}
              className="bg-white/70 focus:ring-2 focus:ring-indigo-400"
            />
            <Input
              name="salary"
              type="number"
              placeholder="Salary"
              onChange={handleChange}
              className="bg-white/70 focus:ring-2 focus:ring-indigo-400"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                Application Deadline
              </label>
              <Input
                name="deadline"
                type="date"
                onChange={handleChange}
                className="bg-white/70 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <Select
              onValueChange={(value) => setForm({ ...form, jobType: value })}
            >
              <SelectTrigger className="bg-white/70">
                <SelectValue placeholder="Select Job Type" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="z-50 bg-white shadow-lg border"
              >
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <textarea
            name="description"
            placeholder="Job Description...."
            onChange={handleChange}
            className="w-full border rounded p-3 resize-none h-28 bg-white/70 focus:ring-2 focus:ring-indigo-400 relative z-0"
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
            >
              Post{" "}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
