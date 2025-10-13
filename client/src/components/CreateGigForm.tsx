import React, { useState } from 'react';
import { X, Plus, Upload, Trash2, Save } from 'lucide-react';
import { useAuthStore } from '../context/store/authStore';
import { gigService } from '../services/gigService';

interface GigImage {
  url: string;
  isPrimary: boolean;
}

interface GigPackage {
  name: string;
  price: number;
  deliveryDays: number;
  description: string;
}

interface GigFAQ {
  question: string;
  answer: string;
}

interface GigFormData {
  sellerId: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  images: GigImage[];
  packages: GigPackage[];
  faqs: GigFAQ[];
}

interface CreateGigFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: GigFormData) => void;
}

const CreateGigForm: React.FC<CreateGigFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<GigFormData>({
    sellerId: user?.userId || '',
    title: '',
    description: '',
    platform: '',
    category: '',
    status: 'ACTIVE',
    images: [],
    packages: [{ name: 'Basic', price: 0, deliveryDays: 1, description: '' }],
    faqs: []
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platforms = [
    'YouTube', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn', 
    'Twitter', 'Pinterest', 'Snapchat', 'Twitch', 'Other'
  ];

  const categories = [
    'Audit', 'Strategy', 'Content Creation', 'Growth', 'Management',
    'Analytics', 'SEO', 'Advertising', 'Consulting', 'Other'
  ];

  const handleInputChange = (field: keyof GigFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await gigService.uploadImage(file);
      
      const newImage: GigImage = {
        url: response.imageUrl,
        isPrimary: formData.images.length === 0 // First image is primary
      };

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      handleImageUpload(file);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If we removed the primary image, make the first remaining image primary
      if (newImages.length > 0 && prev.images[index].isPrimary) {
        newImages[0].isPrimary = true;
      }
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const setPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { name: '', price: 0, deliveryDays: 1, description: '' }]
    }));
  };

  const updatePackage = (index: number, field: keyof GigPackage, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const removePackage = (index: number) => {
    if (formData.packages.length > 1) {
      setFormData(prev => ({
        ...prev,
        packages: prev.packages.filter((_, i) => i !== index)
      }));
    }
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFAQ = (index: number, field: keyof GigFAQ, value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title for your gig');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description for your gig');
      return;
    }
    
    if (!formData.platform) {
      alert('Please select a platform');
      return;
    }
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    
    if (formData.images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    if (formData.packages.some(pkg => !pkg.name.trim() || pkg.price <= 0)) {
      alert('Please fill in all package details with valid prices');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await gigService.createGig({
        ...formData,
        sellerId: user?.userId || formData.sellerId
      });

      console.log('Gig created successfully:', result);
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      // Reset form
      setFormData({
        sellerId: user?.userId || '',
        title: '',
        description: '',
        platform: '',
        category: '',
        status: 'ACTIVE',
        images: [],
        packages: [{ name: 'Basic', price: 0, deliveryDays: 1, description: '' }],
        faqs: []
      });
      
      alert('Gig created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating gig:', error);
      alert(error instanceof Error ? error.message : 'Failed to create gig. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create New Gig</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Gig Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="I will provide excellent social media strategy..."
                maxLength={80}
              />
              <p className="mt-1 text-xs text-gray-500">{formData.title.length}/80 characters</p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe your service in detail..."
                maxLength={1200}
              />
              <p className="mt-1 text-xs text-gray-500">{formData.description.length}/1200 characters</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Platform *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Images</h3>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Gig image ${index + 1}`}
                    className="object-cover w-full h-32 border rounded-lg"
                  />
                  {image.isPrimary && (
                    <span className="absolute px-2 py-1 text-xs text-white rounded top-2 left-2 bg-emerald-500">
                      Primary
                    </span>
                  )}
                  <div className="absolute flex gap-1 top-2 right-2">
                    {!image.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="p-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                        title="Set as primary"
                      >
                        ★
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              
              {formData.images.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-32 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-emerald-500"></div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="mt-1 text-sm text-gray-500">Upload Image</span>
                    </>
                  )}
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">Upload up to 5 images. First image will be the primary image.</p>
          </div>

          {/* Packages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Packages</h3>
              <button
                type="button"
                onClick={addPackage}
                className="flex items-center gap-1 px-3 py-1 text-sm text-white rounded bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="w-4 h-4" />
                Add Package
              </button>
            </div>

            {formData.packages.map((pkg, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Package {index + 1}</h4>
                  {formData.packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePackage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Package Name
                    </label>
                    <input
                      type="text"
                      value={pkg.name}
                      onChange={(e) => updatePackage(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., Basic, Premium"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => updatePackage(index, 'price', parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Delivery (Days)
                    </label>
                    <input
                      type="number"
                      value={pkg.deliveryDays}
                      onChange={(e) => updatePackage(index, 'deliveryDays', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={pkg.description}
                    onChange={(e) => updatePackage(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe what's included in this package..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">FAQs (Optional)</h3>
              <button
                type="button"
                onClick={addFAQ}
                className="flex items-center gap-1 px-3 py-1 text-sm text-white rounded bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>

            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">FAQ {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeFAQ(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your question..."
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter your answer..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 text-white transition-colors rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Gig
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGigForm;
