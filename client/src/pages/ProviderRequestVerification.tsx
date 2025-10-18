import React, { useEffect, useState } from "react";
import { useAuthStore } from "../context/store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  Award, 
  Shield, 
  CheckCircle, 
  Clock, 
  Lightbulb, 
  Loader
} from "lucide-react";
import { requestApproval, VerificationRequest } from "../services/providerVerificationService";

const ProviderNoteForm: React.FC = () => {
  const { user, createOrUpdateNote, getNoteByProvider } = useAuthStore();
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      getNoteByProvider(user.email)
        .then(res => {
          setNote(res.note || "");
          setCharacterCount(res.note?.length || 0);
        })
        .catch(() => {});
    }
  }, [user, getNoteByProvider]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    setCharacterCount(e.target.value.length);
  };

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }, [file]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user?.email) {
      toast.error("You must be signed in as a provider");
      setIsSubmitting(false);
      return;
    }

    if (!note.trim()) {
      toast.error("Please provide some information for verification");
      setIsSubmitting(false);
      return;
    }

    try {
      await createOrUpdateNote(user.email, note, file || undefined);
      const verificationData: VerificationRequest = {
        userId: user.userId,
        name: user.name,
        
      };

      // 3️⃣ Call backend approval endpoint
      await requestApproval(verificationData);

      toast.success(" Verification request submitted successfully!");
      setTimeout(() => {
        if (user.userId) navigate(`/profile/${user.userId}`);
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Failed to submit verification request");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Provider Verification</h1>
          </div>
         {/* Progress Steps */}
        <div className="flex justify-center mt-6 mb-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-500 text-white rounded-full shadow-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
              <span className="ml-3 font-semibold text-emerald-600">Profile Setup</span>
            </div>
            <div className="w-16 h-1 bg-emerald-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-emerald-500 text-white rounded-full shadow-lg">
                <span className="font-bold">2</span>
              </div>
              <span className="ml-3 font-semibold text-emerald-600">Verification</span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-500 rounded-full">
                <span className="font-bold">3</span>
              </div>
              <span className="ml-3 font-semibold text-gray-400">Review</span>
            </div>
          </div>
        </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              
              {/* Form Header */}
              <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <Award className="h-6 w-6 text-emerald-500" />
                <h2 className="text-xl font-bold text-gray-900">Verification Application</h2>
              </div>

              {/* Form Body */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* File Upload */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">Supporting Documents</label>
                    {!file ? (
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all text-center"
                      >
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        <span className="text-gray-700 font-medium">Upload Document</span>
                        <span className="text-gray-500 text-sm">PNG, JPG, PDF, DOC up to 10MB</span>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileSelect}
                          accept="image/*,.pdf,.doc,.docx"
                        />
                      </label>
                    ) : (
                      <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FileText className="h-10 w-10 text-emerald-600" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button type="button" onClick={removeFile} className="text-red-500 hover:text-red-700 p-1 rounded-full">
                          ✕
                        </button>
                      </div>
                    )}
                    {preview && (
                      <div className="mt-4 max-w-xs border rounded-lg overflow-hidden">
                        <img src={preview} alt="Preview" className="w-full h-auto" />
                      </div>
                    )}
                  </div>

                  {/* Note */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-lg font-semibold text-gray-900">Professional Summary</label>
                      <span className={`text-sm ${characterCount > 500 ? "text-green-600" : "text-gray-500"}`}>
                        {characterCount}/1000
                      </span>
                    </div>
                    <textarea
                      value={note}
                      onChange={handleNoteChange}
                      maxLength={1000}
                      rows={6}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-gray-400"
                      placeholder="Include achievements, metrics, skills, and experiences..."
                    />
                    <p className="text-sm text-gray-500 mt-1">Minimum 100 characters recommended.</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting || !note.trim() || characterCount < 20}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow hover:shadow-lg disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <Loader className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                      {isSubmitting ? "Submitting..." : "Submit Verification"}
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => navigate(-1)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-900">Application Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Include metrics: "Increased engagement by 300%"</li>
                <li>Attach portfolios, case studies, certificates</li>
                <li>Highlight specific skills and technologies</li>
                <li>Keep a professional, clear, and concise tone</li>
              </ul>
            </div>

            {/* Review Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Review Process</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Pending Submission</span>
                </div>
                <p><strong>Timeline:</strong> 2-3 business days</p>
                <p><strong>Notification:</strong> Email & in-app</p>
                <p><strong>Next Steps:</strong> Admin review → Approval</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderNoteForm;
