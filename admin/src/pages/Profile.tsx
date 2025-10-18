import React, { useEffect, useState } from "react";
import { useAdminAuthStore } from "../context/useAdminAuthStore";
import { User, Mail, Shield, CheckCircle, Edit3, Save, X, Upload, Loader, Camera, Award, Calendar, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = "http://localhost:8081";

// --- Helper Component: DataField (Enhanced) ---
const DataField: React.FC<{
  icon: React.FC<any>;
  label: string;
  value: string | React.ReactNode;
  isTag?: boolean;
  breakAll?: boolean;
  children?: React.ReactNode;
}> = ({ icon: Icon, label, value, isTag = false, breakAll = false, children }) => {
  const getTagClasses = (tagValue: string, isStatus: boolean) => {
    if (isStatus) {
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg";
    }
    if (tagValue.toUpperCase() === "ADMIN") {
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg";
    }
    return "bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0 shadow-lg";
  };

  const isStatus = label === "Status";

  return (
    <div className="flex flex-col p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-2 text-sm font-semibold text-blue-600 uppercase mb-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>

      {children ? (
        children
      ) : isTag ? (
        <span
          className={`text-sm font-bold px-4 py-2 self-start rounded-full border shadow-inner ${
            getTagClasses(value as string, isStatus)
          }`}
        >
          {value}
        </span>
      ) : (
        <span className={`text-gray-800 font-semibold text-lg ${breakAll ? "break-all" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
};

// --- Main Component: Profile ---
const Profile: React.FC = () => {
  const { user, checkAuth } = useAdminAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
  });

  // Stats data for the admin
  const [adminStats] = useState({
    totalApprovals: 47,
    pendingReviews: 8,
    activeProviders: 156,
    adminSince: "2024-01-15"
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-blue-100 max-w-sm w-full">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-lg text-gray-700 font-semibold">Loading Profile...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we load your data</p>
        </div>
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

  // --- Image Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setUploadProgress(0);
    const toastId = toast.loading("Uploading your profile image...");

    try {
      const data = new FormData();
      data.append("image", selectedFile);

      await axios.put(`${API_URL}/profile/image`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(Math.round(progress));
          }
        }
      });

      toast.success(" Profile image updated successfully!");
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      
      await checkAuth();
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      toast.error(err.response?.data?.message || "Failed to upload profile image", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  // --- Name Update Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (formData.name.trim() === user.name) {
        toast("No changes detected.", { icon: '📝' });
        setIsEditing(false);
        return;
    }
    
    if (!formData.name.trim()) {
        toast.error("Name cannot be empty.");
        return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Updating your profile...");

    try {
      await axios.put(
        `${API_URL}/profile`,
        {
          name: formData.name,
        },
        { withCredentials: true }
      );

      toast.success("✅ Profile updated successfully!", { id: toastId });
      setIsEditing(false);
      
      await checkAuth();
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  // --- Profile Fields Configuration ---
  const profileFields = [
    { 
      label: "Full Name", 
      value: user.name, 
      icon: User,
      editable: true,
      field: "name" as const
    },
    { 
      label: "Email Address", 
      value: user.email, 
      icon: Mail, 
      breakAll: true,
      editable: false, 
      field: "email" as const
    },
    { 
      label: "Role", 
      value: user.role, 
      icon: Shield, 
      isTag: true,
      editable: false, 
      field: "role" as const
    },
    {
      label: "Status",
      value: "Active",
      icon: CheckCircle,
      isTag: true, 
      editable: false, 
      field: "status" as const,
    }
  ];

  // --- Stats Cards ---
  const statCards = [
    {
      icon: ShieldCheck,
      label: "Total Approvals",
      value: adminStats.totalApprovals,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Award,
      label: "Pending Reviews",
      value: adminStats.pendingReviews,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50"
    },
    {
      icon: User,
      label: "Active Providers",
      value: adminStats.activeProviders,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Calendar,
      label: "Admin Since",
      value: new Date(adminStats.adminSince).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen  px-4 py-1">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">Admin Profile</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your administrator profile and view your platform statistics
          </p>
        </div>

        

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          
          {/* Header */}
<div className="bg-gradient-to-r from-gray-200 via-gray-100 to-blue-50 p-8 text-gray-900 border-b border-gray-500">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
      <div className="relative">
        {(previewUrl || user.imageUrl) ? (
          <img
            src={previewUrl || user.imageUrl}
            alt={user.name || "Admin"}
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-300 shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {initials}
          </div>
        )}

        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
          <CheckCircle className="w-5 h-5 text-green-500 fill-white stroke-1" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-gray-600 text-lg capitalize">{user.role}</p>
      </div>
    </div>

    <div className="flex space-x-3">
      {isEditing ? (
        <>
          <button
            onClick={handleSaveProfile}
            disabled={isLoading || (!!selectedFile && uploadProgress > 0)}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && !selectedFile ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Changes</span>
          </button>

          <button
            onClick={handleCancelEdit}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      )}
    </div>
  </div>
</div>


          {/* Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Avatar Section */}
              <div className="flex-shrink-0 lg:w-80">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-center">
                    <div className="relative inline-block">
                      {(previewUrl || user.imageUrl) ? (
                        <img
                          src={previewUrl || user.imageUrl}
                          alt={user.name || "Admin"}
                          className="w-52 h-52 rounded-full object-cover border-4 border-blue-500 shadow-2xl mx-auto"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-500 shadow-2xl mx-auto">
                          {initials}
                        </div>
                      )}
                      
                      {isEditing && !selectedFile && (
                        <label 
                          htmlFor="admin-profile-upload"
                          className="absolute bottom-2 right-2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 transition-all duration-200 shadow-lg border-2 border-white hover:scale-110"
                          title="Change profile picture"
                        >
                          <Camera className="h-5 w-5" />
                          <input
                            id="admin-profile-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                      </div>
                    )}

                    {/* Upload Controls */}
                    {selectedFile && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-gray-600 font-medium">
                          Ready to upload: {selectedFile.name}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-all flex-1 font-semibold shadow-lg disabled:opacity-50"
                          >
                            {isLoading ? (
                              <Loader className='w-4 h-4 animate-spin' />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            Upload Image
                          </button>
                          <button
                            onClick={handleCancelUpload}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <p className="text-2xl font-bold text-gray-800">{user.name}</p>
                      <p className="text-blue-600 font-semibold text-lg">{user.role}</p>
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {profileFields.map((field) => (
                    <DataField
                      key={field.label}
                      icon={field.icon}
                      label={field.label}
                      value={
                        isEditing && field.field === "name" ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-200"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            autoFocus
                          />
                        ) : (
                          field.value
                        )
                      }
                      isTag={field.isTag}
                      breakAll={field.breakAll}
                    />
                  ))}
                </div>

                
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;