import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/utils/api";
import { Briefcase } from "lucide-react";
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
      !form.title.trim() ||
      !form.company.trim() ||
      !form.location.trim() ||
      !form.description.trim()
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
        toast.success("Job posted successfully");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-600" />

          <h1 className="text-4xl font-bold text-gray-900">
            {id ? "Update Job" : "Post a Job"}
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <Card className="w-full bg-white/80 backdrop-blur-md border border-indigo-200 shadow-lg rounded-2xl">
        <CardContent className="p-10 flex flex-col gap-8 overflow-visible">
          {/* Basic Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              name="title"
              value={form.title}
              placeholder="Job Title"
              onChange={handleChange}
              className="bg-white"
            />

            <Input
              name="company"
              value={form.company}
              placeholder="Company Name"
              onChange={handleChange}
              className="bg-white"
            />

            <Input
              name="location"
              value={form.location}
              placeholder="Location"
              onChange={handleChange}
              className="bg-white"
            />

            <Input
              name="salary"
              type="number"
              value={form.salary}
              placeholder="Salary"
              onChange={handleChange}
              className="bg-white"
            />

            {/* Deadline */}
            <div className="flex flex-col gap-2">
              <Label>Application Deadline</Label>

              <Input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                className="bg-white"
              />
            </div>

            {/* Job Type */}
            <div className="flex flex-col gap-2">
              <Label>Job Type</Label>

              <Select
                value={form.jobType}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    jobType: value,
                  })
                }
              >
                <SelectTrigger className="w-full bg-white h-12 text-base">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>

                <SelectContent
                  position="popper"
                  sideOffset={8}
                  className="z-50 w-[--radix-select-trigger-width] bg-white border shadow-xl rounded-xl p-1"
                >
                  <SelectItem
                    value="full-time"
                    className="text-base py-2 px-3 rounded-md cursor-pointer"
                  >
                    Full Time
                  </SelectItem>

                  <SelectItem
                    value="part-time"
                    className="text-base py-2 px-3 rounded-md cursor-pointer"
                  >
                    Part Time
                  </SelectItem>

                  <SelectItem
                    value="internship"
                    className="text-base py-2 px-3 rounded-md cursor-pointer"
                  >
                    Internship
                  </SelectItem>

                  <SelectItem
                    value="remote"
                    className="text-base py-2 px-3 rounded-md cursor-pointer"
                  >
                    Remote
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label>Job Description</Label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe responsibilities, requirements, skills, benefits, etc."
              className="w-full border rounded-xl p-4 resize-none min-h-[200px] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all duration-200"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
            >
              {id ? "Update Job" : "Post Job"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
