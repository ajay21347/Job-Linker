import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import { Download, Eye, FileText, Mail, Phone, User2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    ...storedUser,
    phone: storedUser?.phone || "",
    preferences: storedUser?.preferences || "",
    bio: storedUser?.bio || "",
    resume: storedUser?.resume || "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUser({ ...user, resume: fileURL });
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/user/profile", user);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
      toast.success("Profile updated successfully");

      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6 flex justify-center items-center">
      <Card className="w-full max-w-2xl hover:shadow-xl bg-white/60 backdrop-blur-md border border-purple-200">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg flex items-center justify-center hover:scale-105 transition text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500 uppercase font-bold">{user?.role}</p>
            <h3 className="text-sm font-semibold text-gray-500 uppercase ">
              Personal Info
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <User2 className="w-5 h-5 text-gray-500" />
              <Input
                name="name"
                value={user?.name}
                disabled={!isEditing}
                onChange={handleChange}
                className=" bg-white/70 focus:bg-white disabled:opacity-100 text-gray-600 focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <Input
                name="email"
                value={user?.email}
                disabled={!isEditing}
                onChange={handleChange}
                className=" bg-white/70 focus:bg-white disabled:opacity-100 text-gray-600 focus:ring-2 focus:ring-purple-400"
              />
            </div>{" "}
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-500" />
              <Input
                name="phone"
                placeholder="Phone number"
                value={user?.phone}
                disabled={!isEditing}
                onChange={handleChange}
                className=" bg-white/70 focus:bg-white  disabled:opacity-100 text-gray-600 focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <textarea
              name="bio"
              placeholder="Write about your self"
              value={user.bio}
              disabled={!isEditing}
              onChange={handleChange}
              className=" bg-white/70 focus:bg-white w-full border rounded p-3 h-24 resize-none placeholder:text-gray-600 disabled:opacity-100 text-gray-400 focus:ring-2 focus:ring-purple-400"
            />
            {user?.role === "seeker" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Resume</span>
                </div>
                {user.resume ? (
                  <div className="flex items-center justify-between bg-white/70 px-4 py-3 rounded-lg">
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-600 hover:underline flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View Resume
                    </a>
                    <a href={user.resume} download>
                      <Button
                        variant="secondary"
                        className="hover:underline flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">No resume uploaded</p>
                )}
                {isEditing && (
                  <input type="file" onChange={handleResumeUpload} />
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  className="hover:scale-105 hover:bg-gray-300 "
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-200"
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 hover:bg-purple-700 hover:scale-105"
                >
                  Edit Profile
                </Button>{" "}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
