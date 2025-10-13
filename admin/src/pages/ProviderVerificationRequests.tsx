import React, { useEffect, useState } from "react";
import { useAdminAuthStore } from "../context/useAdminAuthStore";
import toast from "react-hot-toast";

const PendingProviders: React.FC = () => {
  const { getPendingProviders, approveProvider } = useAdminAuthStore();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await getPendingProviders();
      setProviders(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveProvider(userId);
      toast.success("Provider approved successfully!");
      await loadProviders();
      setSelectedProvider(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'document';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    return 'unknown';
  };

  const renderFilePreview = (provider: any) => {
    if (!provider.fileUrl) {
      return (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
          No file uploaded
        </div>
      );
    }

    const fileType = getFileType(provider.fileUrl);

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">File Type: {fileType}</span>
          <button
            onClick={() => setFilePreview(provider.fileUrl)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
          >
            Preview File
          </button>
        </div>
        
        {fileType === 'image' && (
          <div className="border rounded-lg p-2 bg-gray-50">
            <img
              src={provider.fileUrl}
              alt="Uploaded file"
              className="w-full h-32 object-contain rounded"
            />
          </div>
        )}
        
        <a
          href={provider.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Original File
        </a>
      </div>
    );
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending Provider Approvals
          </h2>
          <p className="text-gray-600">Review and approve service providers waiting for verification</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : providers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Providers</h3>
            <p className="text-gray-500">All providers have been reviewed and approved.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {providers.map((p) => (
              <div
                key={p.userId}
                className="bg-white rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-all duration-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">{p.name}</h3>
                      <p className="text-sm text-gray-600">{p.email}</p>
                      {p.title && (
                        <p className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full mt-1 inline-block">
                          {p.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProvider(p)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Provider Details Modal */}
        {selectedProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedProvider(null)}
            />

            <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {selectedProvider.imageUrl && (
                      <img
                        src={selectedProvider.imageUrl}
                        alt="provider"
                        className="w-16 h-16 object-cover rounded-full border-4 border-white/20"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold">{selectedProvider.name}</h3>
                      <p className="text-blue-100">{selectedProvider.email}</p>
                      {selectedProvider.title && (
                        <p className="text-blue-200 mt-1">{selectedProvider.title}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProvider(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Close"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        About / Description
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedProvider.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm">{selectedProvider.location || "Not specified"}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Note</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm">{selectedProvider.note || "No note"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Media & Files
                      </h4>
                      {renderFilePreview(selectedProvider)}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Status
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">Approval Status:</span>
    <span
      className={`text-sm font-medium ${
        selectedProvider.approvalRequested ? "text-green-600" : "text-red-500"
      }`}
    >
      {selectedProvider.approvalRequested ? "Request Submitted" : "Not Requested"}
    </span>
  </div>

  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">Admin Decision:</span>
    <span
      className={`text-sm font-medium ${
        selectedProvider.approvedByAdmin ? "text-green-600" : "text-yellow-500"
      }`}
    >
      {selectedProvider.approvedByAdmin ? "Approved" : "Pending Review"}
    </span>
  </div>
</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mr-3"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedProvider.userId)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve Provider
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {filePreview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setFilePreview(null)}
            />

            <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white flex justify-between items-center">
                <h3 className="text-lg font-semibold">File Preview</h3>
                <button
                  onClick={() => setFilePreview(null)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {getFileType(filePreview) === 'image' ? (
                  <div className="flex justify-center">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-w-full max-h-[60vh] object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                    <a
                      href={filePreview}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download File
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  File type: {getFileType(filePreview).toUpperCase()}
                </span>
                <a
                  href={filePreview}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingProviders;