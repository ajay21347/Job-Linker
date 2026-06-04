import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import {
  Camera,
  Download,
  Eye,
  FileText,
  History,
  Mail,
  Pencil,
  Phone,
  User2,
  ChevronDown,
  Lock,
  EyeOff,
  Trash2,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicLoading, setProfilePicLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState(false);

  const [showSecurity, setShowSecurity] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const resumeUploadRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    ...storedUser,
    phone: storedUser?.phone || "",
    preferences: storedUser?.preferences || "",
    bio: storedUser?.bio || "",
    resume: storedUser?.resume || {},
    profilePic: storedUser?.profilePic || {},
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    setResumeFile(file);
  };

  const updateResume = async () => {
    try {
      if (!resumeFile) {
        return toast.error("Select a resume first");
      }

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const res = await api.put("/user/upload-resume", formData);

      const updatedUser = {
        ...user,
        resume: res.data.resume,
      };

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setResumeFile(null);

      toast.success("Resume updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Resume update failed");
    }
  };

  const analyzeResumeAI = async () => {
    try {
      setLoadingAI(true);

      const res = await api.post("/ai/analyze-resume");

      toast.success("Resume analyzed successfully");
      navigate("/resume-analysis", {
        state: { analysis: res.data.analysis },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "AI analysis failed");

      if (error.response?.data?.message === "Please upload resume first") {
        setIsEditing(true);

        setTimeout(() => {
          resumeUploadRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    } finally {
      setLoadingAI(false);
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfilePicFile(file);
  };

  const updateProfilePic = async () => {
    try {
      if (profilePicLoading) return;

      setProfilePicLoading(true);

      if (!profilePicFile) {
        return toast.error("Select an image first");
      }

      const formData = new FormData();

      formData.append("profilePic", profilePicFile);

      const res = await api.put("/user/upload-profile-pic", formData, {
        onUploadProgress: (ProgressEvent) => {
          const percent = Math.round(
            (ProgressEvent.loaded * 100) / ProgressEvent.total,
          );

          setUploadProgress(percent);
        },
      });

      const updatedUser = { ...user, profilePic: res.data.profilePic };

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfilePicFile(null);

      toast.success("Profile picture updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile picture",
      );
    } finally {
      setProfilePicLoading(false);
      setUploadProgress(0);
    }
  };

  const deleteProfilePic = async () => {
    try {
      const res = await api.delete("/user/delete-profile-pic");

      const updatedUser = { ...user, profilePic: res.data.profilePic };

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove picture");
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const res = await api.put("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success(res.data.message);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const getProfileCompletion = () => {
    let score = 0;

    if (user?.name) score += 20;
    if (user?.email) score += 20;
    if (user?.phone) score += 15;
    if (user?.bio) score += 15;
    if (user?.profilePic?.url) score += 15;
    if (user?.role === "seeker" && user?.resume?.url) score += 15;
    if (user?.role !== "seeker") score += 15;

    return score;
  };

  const handleSave = async () => {
    try {
      const profileData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
      };

      const res = await api.put("/user/profile", profileData);

      const updatedUser = {
        ...user,
        ...res.data.user,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");

      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-blue-200 to-cyan-200 p-6 flex justify-center items-center">
      <Card className="w-full max-w-2xl hover:shadow-xl bg-white/60 backdrop-blur-md border border-purple-200">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  className="hover:scale-105 hover:bg-gray-300 "
                  onClick={() => {
                    setIsEditing(false);
                    setShowSecurity(false);
                    setShowPasswords(false);

                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
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
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="hover:bg-green-500 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-md hover:shadow-green-300 border-green-200 "
                >
                  <Pencil className="w-4 h-4 mr-2" />
                </Button>{" "}
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {user?.profilePic?.url ? (
                <img
                  src={user.profilePic.url}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105
                  hover:shadow-purple-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}{" "}
              {isEditing && (
                <>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center cursor-pointer text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-300">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>

            <h2 className="text-xl font-semibold">{user?.name}</h2>

            {isEditing && user?.profilePic?.url && (
              <Button
                size="sm"
                variant="destructive"
                onClick={deleteProfilePic}
                className="h-7 px-3 text-xs text-red-500 hover:text-red-700 hover:scale-105 transition-all duration-300"
              >
                <Trash2 className="w-3 h-3 " />
                Remove
              </Button>
            )}
            <p className="text-gray-500 uppercase font-bold">{user?.role}</p>

            <div className="w-full max-w-xs mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Profile Completion</span>

                <span
                  className={`font-semibold ${getProfileCompletion() === 100 ? "text-green-600" : "text-purple-600"}`}
                >
                  {getProfileCompletion()}%
                </span>
              </div>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-700"
                  style={{
                    width: `${getProfileCompletion()}%`,
                  }}
                />
              </div>
              {getProfileCompletion() === 100 && (
                <p className="text-green-600 text-sm mt-2 font-medium text-center">
                  {" "}
                  ✓ Profile Complete
                </p>
              )}
            </div>

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
            {isEditing && (
              <div className="flex flex-col gap-2">
                {profilePicFile && (
                  <>
                    <img
                      src={URL.createObjectURL(profilePicFile)}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border "
                    />
                    {profilePicLoading && (
                      <div className="w-full mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 transition-all duration-300"
                            style={{
                              width: `${uploadProgress}%`,
                            }}
                          />
                        </div>

                        <p className="text-xs text-center mt-1 text-gray-600">
                          Uploading {uploadProgress}%
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={updateProfilePic}
                      disabled={profilePicLoading}
                      className="bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-purple-300 disabled:opacity-50 disabled:cursor-not-allowed  disabled:hover:scale-100 "
                    >
                      {profilePicLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Update Profile Picture"
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}
            {user?.role === "seeker" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Resume</span>
                </div>
                {user.resume?.url ? (
                  <div className="flex items-center justify-between bg-white/70 px-4 py-3 rounded-lg">
                    <Button
                      variant="outline"
                      className="bg-blue-500 hover:bg-blue-400 border-none rounded-xl shadow-sm hover:scale-105"
                      onClick={() =>
                        window.open(
                          `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(user.resume?.url)}`,
                          "_blank",
                        )
                      }
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Resume
                    </Button>

                    <Button
                      onClick={analyzeResumeAI}
                      disabled={loadingAI}
                      className="bg-green-500 hover:bg-green-400 rounded-xl hover:scale-105 border-none shadow-sm"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      {loadingAI ? "Analyzing..." : "Quick ATS Analysis"}
                    </Button>

                    <Button
                      onClick={() => navigate("/history")}
                      className="bg-yellow-500 hover:bg-yellow-400 rounded-xl hover:scale-105 border-none shadow-sm"
                    >
                      <History className="w-4 h-4" />
                      History Center
                    </Button>

                    <a href={user.resume?.url} download>
                      <Button
                        variant="secondary"
                        className="bg-purple-500 rounded-xl hover:bg-purple-400 border-none shadow-sm hover:scale-105 "
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
                  <div ref={resumeUploadRef} className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                    {resumeFile && (
                      <Button
                        onClick={updateResume}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        Update
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
            {isEditing && (
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 mt-4">
                <button
                  onClick={() => setShowSecurity(!showSecurity)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold">Change Password</h3>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      showSecurity ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showSecurity && (
                  <div className="space-y-4 mt-5 animate-in fade-in duration-300">
                    {/* Current Password */}
                    <div className="relative">
                      <Input
                        type={showPasswords ? "text" : "password"}
                        placeholder="Current Password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="pr-10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                      >
                        {showPasswords ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <Input
                        type={showPasswords ? "text" : "password"}
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="pr-10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                      >
                        {showPasswords ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <Input
                        type={showPasswords ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="pr-10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
                      >
                        {showPasswords ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={passwordLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] transition-all duration-300"
                    >
                      {passwordLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
