import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import { Briefcase } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    jobType: "full-time",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/jobs/create", form);
      toast.success("Job posted successfully ");
      navigate("/recruiter-dashboard");
    } catch (error) {
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
            Post a Job
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
            <Select
              onValueChange={(value) => setForm({ ...form, jobType: value })}
            >
              <SelectTrigger className="bg-white/70">
                <SelectValue placeholder="Select Job Type" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="z-50 shadow-lg border"
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
            className="w-full border rounded p-3 resize-none h-28 bg-white/70 focus:ring-2 focus:ring-indigo-400"
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
