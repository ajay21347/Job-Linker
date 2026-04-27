import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Briefcase, Mail, User2 } from "lucide-react";
import React, { useState } from "react";

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(storedUser);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6 flex justify-center items-center">
      <Card className="w-full max-w-xl shadow-xl">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500">{user?.role}</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <User2 className="w-5 h-5 text-gray-500" />
              <Input
                name="name"
                value={user?.name}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <Input
                name="email"
                value={user?.email}
                disabled={!isEditing}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <Input value={user?.role} disabled />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>

                <Button
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 scale-105"
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 hover:bg-purple-700 scale-105"
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
