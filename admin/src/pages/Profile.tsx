import React from "react";
import { useAdminAuthStore } from "../context/useAdminAuthStore";
import { User, Mail, Shield, CheckCircle, Edit3 } from "lucide-react";

// Helper for structured fields
const DataField: React.FC<{
  icon: React.FC<any>;
  label: string;
  value: string | React.ReactNode;
  isTag?: boolean;
  breakAll?: boolean;
}> = ({ icon: Icon, label, value, isTag = false, breakAll = false }) => {
  const getRoleTagClasses = (role: string) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "MODERATOR":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="flex flex-col p-3 border-b border-gray-100 last:border-b-0 md:p-0 md:border-b-0">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 uppercase mb-1">
        <Icon className="w-4 h-4 text-blue-500" />
        <span>{label}</span>
      </div>

      {isTag ? (
        <span
          className={`text-base font-bold px-2 py-0.5 self-start rounded-md border ${
            getRoleTagClasses(value as string)
          }`}
        >
          {value}
        </span>
      ) : (
        <span className={`text-gray-800 font-semibold text-base ${breakAll ? "break-all" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user } = useAdminAuthStore();

  if (!user) {
    return (
      <div className="text-center text-gray-500 mt-20 p-6 bg-white rounded-xl shadow-md max-w-sm mx-auto">
        <p className="text-lg">No User Data 🔒</p>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  const profileFields = [
    { label: "Full Name", value: user.name, icon: User },
    { label: "Email Address", value: user.email, icon: Mail, breakAll: true },
    { label: "Role", value: user.role, icon: Shield, isTag: true },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="bg-white shadow-xl rounded-xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="w-6 h-6 mr-3 text-blue-600" />
            Admin Profile
          </h2>
          <button
            className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition shadow-md shadow-blue-300/50"
            title="Edit Profile Information"
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col md:flex-row md:space-x-8">
          {/* Avatar */}
          <div className="flex-shrink-0 mb-6 md:mb-0 md:w-40 flex flex-col items-center">
            <div className="relative">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.name || "Admin"}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-extrabold border-4 border-blue-500 shadow-lg">
                  {initials}
                </div>
              )}
              {/* Status badge */}
              <div
                className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                title="Active"
              >
                <CheckCircle className="w-4 h-4 text-white fill-green-500" />
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">{user.name}</p>
            <p className="text-xs text-blue-500">{user.role}</p>
          </div>

          {/* Details Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {profileFields.map((field) => (
              <DataField key={field.label} {...field} />
            ))}

            {/* Status field */}
            <DataField
              icon={CheckCircle}
              label="Status"
              value={
                <span className="font-bold px-2 py-0.5 rounded-md border bg-green-100 text-green-800 border-green-300">
                  Active
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
