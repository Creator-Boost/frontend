import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  Download,
  FileText,
  Image,
  File,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/orderService';

interface FileInfo {
  url: string;
  filename: string;
}

interface FileUploadManagerProps {
  orderId: string;
  files: FileInfo[];
  userRole: 'client' | 'expert';
  onFilesUpdate?: () => void;
  className?: string;
}

const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  orderId,
  files,
  userRole,
  onFilesUpdate,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (fileList: FileList) => {
    if (!fileList.length) return;

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate file sizes (max 10MB per file)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const invalidFiles = Array.from(fileList).filter(file => file.size > maxSize);
      
      if (invalidFiles.length > 0) {
        throw new Error(`Files too large. Maximum size is 10MB. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`);
      }

      // Upload files using the delivery-files endpoint
      await orderService.addDeliveryFiles(orderId, fileList);
      
      // Show success message
      const fileCount = fileList.length;
      setSuccessMessage(`${fileCount} file${fileCount > 1 ? 's' : ''} uploaded successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Notify parent to refresh files
      if (onFilesUpdate) {
        onFilesUpdate();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  }, [orderId, onFilesUpdate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  }, [handleFileUpload]);

  const handleFileDownload = useCallback((fileUrl: string, filename: string) => {
    // Open file in new tab for download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const getFileIcon = (filename: string) => {
    const extension = filename.toLowerCase().split('.').pop();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    
    if (imageExtensions.includes(extension || '')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (documentExtensions.includes(extension || '')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <div>
            <div className="font-medium">Upload Error</div>
            <div className="text-sm">{error}</div>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Success Message Display */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
          </div>
          <div className="font-medium">{successMessage}</div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-3">
          <div className="flex justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-gray-600 font-medium">
              {uploading ? 'Uploading files...' : `Upload files as ${userRole}`}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop files here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={uploading}
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maximum file size: 10MB per file
            </p>
          </div>
        </div>
      </div>

      {/* Files Display */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Uploaded Files ({files.length})</h4>
        
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.filename)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.filename}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFileDownload(file.url, file.filename)}
                    className="p-1 text-blue-600 hover:text-blue-800 rounded"
                    title="Download file"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium mb-1">No files uploaded yet</p>
            <p className="text-sm text-gray-500">
              Upload files to share documents, images, or other materials for this order
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadManager;
