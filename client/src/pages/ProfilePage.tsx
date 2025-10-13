import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Upload, X, Award, MessageCircle, Loader, Save, Edit } from 'lucide-react';
import { useAuthStore } from '../context/store/authStore';
import toast from 'react-hot-toast';
import { useChatStore } from '../context/store/chatStore';

interface ProfileResponse {
  email: string;
  name: string;
  role: string;
  accountVerified: boolean;
  userId: string;
  imageUrl?: string;
  providerProfile?: {
    title: string;
    location: string;
    description: string;
    languages: string[];
    skills: string[];
    certifications: string[];
  approvalRequested?: boolean;
  approvedByAdmin?: boolean;
  };
  clientProfile?: {
    location: string;
    preferences: string;
    description: string;
  };
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  results: string;
}

interface Service {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  deliveryTime: string;
  description: string;
}

interface Review {
  id: string;
  client: string;
  avatar: string;
  rating: number;
  date: string;
  service: string;
  review: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const { 
    user, 
    uploadProfileImage, 
    isLoading, 
    updateProviderProfile, 
    updateClientProfile, 
    getProfile,
    getProfileById 
  } = useAuthStore();

   const { startConversation, isConnected, initializeChat } = useChatStore();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const navigate = useNavigate();

  const isCurrentUserProfile = user?.userId === id;

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        let profile;
        
        if (isCurrentUserProfile) {
          profile = await getProfile();
          console.log("Fetched current user profile:", profile);
        } else {
          profile = await getProfileById(id!);
          console.log("Fetched other user profile:", profile);
        }
        
        setProfileData(profile);
        console.log("Fetched profile data:", profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [id, isCurrentUserProfile, getProfile, getProfileById]);


  // Initialize chat when user is logged in
  useEffect(() => {
    if (user?.userId && !isConnected) {
      initializeChat(user.userId);
    }
  }, [user?.userId, isConnected, initializeChat]);

  // Initialize chat when user is logged in
  useEffect(() => {
    if (user?.userId && !isConnected) {
      initializeChat(user.userId);
    }
  }, [user?.userId, isConnected, initializeChat]);

  const handleContactMe = () => {
    if (!user) {
      toast.error("Please log in to start a conversation");
      return;
    }

    if (!profileData) {
      toast.error("Profile data not loaded");
      return;
    }

    // Start conversation
    startConversation(
      profileData.userId,
      profileData.name,
      profileData.imageUrl || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    );

    // Navigate to messages page
    navigate('/messages');
    toast.success(`Started conversation with ${profileData.name}`);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await uploadProfileImage(selectedFile);
        toast.success("Profile image uploaded successfully");
        setSelectedFile(null);
        setPreviewUrl(null);
        // Refresh profile data
        const updatedProfile = await getProfile();
        setProfileData(updatedProfile);
      } catch (err) {
        console.error("Failed to upload image:", err);
        toast.error("Failed to upload image");
      }
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleAddLanguage = () => {
    if (newLanguage && !profileData?.providerProfile?.languages.includes(newLanguage)) {
      setProfileData(prev => ({
        ...prev!,
        providerProfile: {
          ...prev!.providerProfile!,
          languages: [...prev!.providerProfile!.languages, newLanguage]
        }
      }));
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setProfileData(prev => ({
      ...prev!,
      providerProfile: {
        ...prev!.providerProfile!,
        languages: prev!.providerProfile!.languages.filter(l => l !== language)
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill && !profileData?.providerProfile?.skills.includes(newSkill)) {
      setProfileData(prev => ({
        ...prev!,
        providerProfile: {
          ...prev!.providerProfile!,
          skills: [...prev!.providerProfile!.skills, newSkill]
        }
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev!,
      providerProfile: {
        ...prev!.providerProfile!,
        skills: prev!.providerProfile!.skills.filter(s => s !== skill)
      }
    }));
  };

  const handleAddCertification = () => {
    if (newCertification && !profileData?.providerProfile?.certifications.includes(newCertification)) {
      setProfileData(prev => ({
        ...prev!,
        providerProfile: {
          ...prev!.providerProfile!,
          certifications: [...prev!.providerProfile!.certifications, newCertification]
        }
      }));
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (certification: string) => {
    setProfileData(prev => ({
      ...prev!,
      providerProfile: {
        ...prev!.providerProfile!,
        certifications: prev!.providerProfile!.certifications.filter(c => c !== certification)
      }
    }));
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;
    
    try {
      if (profileData.role === 'PROVIDER' && profileData.providerProfile) {
        await updateProviderProfile({
          title: profileData.providerProfile.title,
          location: profileData.providerProfile.location,
          description: profileData.providerProfile.description,
          languages: profileData.providerProfile.languages,
          skills: profileData.providerProfile.skills,
          certifications: profileData.providerProfile.certifications
        });
      } else if (profileData.role === 'CLIENT' && profileData.clientProfile) {
        await updateClientProfile({
          location: profileData.clientProfile.location,
          preferences: profileData.clientProfile.preferences,
          description: profileData.clientProfile.description,
        });
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
      
      // Refresh profile data
      const updatedProfile = await getProfile();
      setProfileData(updatedProfile);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const profile = useMemo(() => {
    if (!profileData) return null;

    return {
      id: profileData.userId,
      name: profileData.name,
      title: isEditing && isCurrentUserProfile && profileData.role === 'PROVIDER' 
        ? profileData.providerProfile?.title || '' 
        : profileData.role === 'PROVIDER' 
          ? profileData.providerProfile?.title 
          : 'Client',
      avatar: previewUrl || profileData.imageUrl || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: isEditing && isCurrentUserProfile
        ? profileData.role === 'PROVIDER'
          ? profileData.providerProfile?.location
          : profileData.clientProfile?.location
        : profileData.role === 'PROVIDER'
          ? profileData.providerProfile?.location
          : profileData.clientProfile?.location || 'Unknown',
      memberSince: 'January 2020',
      rating: 4.9,
      reviewCount: 127,
      completedOrders: 250,
      responseTime: '2 hours',
      languages: isEditing && isCurrentUserProfile && profileData.role === 'PROVIDER'
        ? profileData.providerProfile?.languages || []
        : profileData.role === 'PROVIDER'
          ? profileData.providerProfile?.languages || ['English']
          : [],
      skills: isEditing && isCurrentUserProfile && profileData.role === 'PROVIDER'
        ? profileData.providerProfile?.skills || []
        : profileData.role === 'PROVIDER'
          ? profileData.providerProfile?.skills || []
          : [],
      description: isEditing && isCurrentUserProfile
        ? profileData.role === 'PROVIDER'
          ? profileData.providerProfile?.description
          : profileData.clientProfile?.description
        : profileData.role === 'PROVIDER'
          ? profileData.providerProfile?.description
          : profileData.clientProfile?.description || '',
      certifications: isEditing && isCurrentUserProfile && profileData.role === 'PROVIDER'
        ? profileData.providerProfile?.certifications || []
        : profileData.role === 'PROVIDER'
          ? profileData.providerProfile?.certifications || []
          : [],
      preferences: isEditing && isCurrentUserProfile && profileData.role === 'CLIENT'
        ? profileData.clientProfile?.preferences || ''
        : profileData.role === 'CLIENT'
          ? profileData.clientProfile?.preferences || ''
          : '',
      role: profileData.role,
      portfolio: [
        {
          id: '1',
          title: 'Tech Channel Growth',
          description: 'Helped a tech channel grow from 1K to 50K subscribers in 6 months',
          image: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=400',
          results: '+4900% subscriber growth'
        },
        {
          id: '2',
          title: 'Instagram Business Growth',
          description: 'Increased engagement rate by 300% for a local business',
          image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
          results: '+300% engagement rate'
        }
      ] as PortfolioItem[]
    };
  }, [profileData, isEditing, isCurrentUserProfile, previewUrl]);

  const services: Service[] = profileData?.role === 'PROVIDER' ? [
    {
      id: '1',
      title: 'YouTube Channel Growth Strategy',
      price: 299,
      rating: 4.9,
      reviews: 45,
      deliveryTime: '3 days',
      description: 'Complete channel audit and personalized growth plan'
    },
    {
      id: '2',
      title: 'Social Media Content Calendar',
      price: 199,
      rating: 4.8,
      reviews: 32,
      deliveryTime: '2 days',
      description: '30-day content calendar with post ideas and optimal timing'
    },
    {
      id: '3',
      title: 'Instagram Hashtag Research',
      price: 99,
      rating: 4.9,
      reviews: 28,
      deliveryTime: '1 day',
      description: 'Targeted hashtag strategy for maximum reach'
    }
  ] : [];

  const reviews: Review[] = profileData?.role === 'PROVIDER' ? [
    {
      id: '1',
      client: 'John Smith',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      date: '2 weeks ago',
      service: 'YouTube Channel Growth Strategy',
      review: 'Sarah provided incredible insights that helped my channel grow exponentially. Her strategy was detailed and easy to implement. Highly recommended!'
    },
    {
      id: '2',
      client: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      date: '1 month ago',
      service: 'Instagram Content Strategy',
      review: 'Amazing work! Sarah helped me understand my audience better and create content that actually engages. My follower count has doubled since implementing her suggestions.'
    },
    {
      id: '3',
      client: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      date: '1 month ago',
      service: 'Social Media Audit',
      review: 'Professional, thorough, and results-driven. Sarah identified areas I never would have thought of and provided actionable solutions.'
    }
  ] : [];

  if (isLoadingProfile || !profileData || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-10 w-10 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  {isCurrentUserProfile && (
                    <label 
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-600 transition"
                      title="Change profile picture"
                    >
                      <Upload className="h-4 w-4" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {selectedFile && (
                  <div className="flex justify-center gap-2 mt-2">
                    <button
                      onClick={handleUpload}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white rounded text-sm"
                    >
                      {isLoading ? (
                        <Loader className='w-3 h-3 animate-spin' />
                      ) : (
                        <>
                          <Upload className="h-3 w-3" />
                          Upload
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelUpload}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm flex items-center gap-1"
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                {profile.role === 'PROVIDER' && (isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={profileData.providerProfile?.title || ''}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      providerProfile: {
                        ...profileData.providerProfile!,
                        title: e.target.value
                      }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="Your title"
                  />
                ) : (
                  <p className="text-gray-600">{profile.title}</p>
                ))}
                <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profile.role === 'PROVIDER' 
                        ? profileData.providerProfile?.location || '' 
                        : profileData.clientProfile?.location || ''}
                      onChange={(e) => {
                        if (profile.role === 'PROVIDER') {
                          setProfileData({
                            ...profileData,
                            providerProfile: {
                              ...profileData.providerProfile!,
                              location: e.target.value
                            }
                          });
                        } else {
                          setProfileData({
                            ...profileData,
                            clientProfile: {
                              ...profileData.clientProfile!,
                              location: e.target.value
                            }
                          });
                        }
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Your location"
                    />
                  ) : (
                    <span>{profile.location}</span>
                  )}
                </div>
              </div>

              {/* Stats - Only for providers */}
              {profile.role === 'PROVIDER' && (
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{profile.rating}</span>
                      <span className="ml-1 text-gray-600">({profile.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-gray-900">{profile.completedOrders}</div>
                      <div className="text-gray-600">Orders Completed</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{profile.responseTime}</div>
                      <div className="text-gray-600">Avg. Response</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact/Edit Button Section */}
                {isCurrentUserProfile ? (
                  <div className="space-y-3 mb-4">
                    {/* Edit/Save Profile Button */}
                    <div>
                      {isEditing ? (
                        <button
                          onClick={handleSaveProfile}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {/* Verification Section */}
                    {profileData.role === 'PROVIDER' && profileData.providerProfile && !isEditing && (
                      <div className="space-y-3">
                        {/* Request Verification Button - Show when not requested and not approved */}
                        {!profileData.providerProfile.approvalRequested && !profileData.providerProfile.approvedByAdmin && (
                          <div className="text-center">
                            <button
                              onClick={() => navigate('/provider/request-verification')}
                              className="w-full flex items-center justify-center gap-2 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                              <Award className="h-4 w-4" />
                              Get Verified Account
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                              Boost your credibility with a verified badge
                            </p>
                          </div>
                        )}

                        {/* Approved - Premium Verified Badge */}
                        {profileData.providerProfile.approvedByAdmin && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center gap-2 text-green-700 mb-1">
                              <Award className="h-5 w-5" />
                              <span className="font-semibold">Verified Professional</span>
                            </div>
                            <p className="text-xs text-green-600">
                              ✓ Identity verified • Trusted provider
                            </p>
                          </div>
                        )}

                        {/* Pending Approval Status */}
                        {profileData.providerProfile.approvalRequested && !profileData.providerProfile.approvedByAdmin && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center gap-2 text-amber-700 mb-1">
                              <div className="h-3 w-3 bg-amber-500 rounded-full animate-pulse" />
                              <span className="font-semibold">Verification in Progress</span>
                            </div>
                            <p className="text-xs text-amber-600">
                              Your verification request is being reviewed
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Other User's Profile */
                    <div className="space-y-3 mb-4">
                      {/* Contact Button for Other Users */}
                      <button
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                        onClick={handleContactMe}
                      >
                        <MessageCircle className="h-5 w-5" />
                        Contact Me
                      </button>

                      {/* Show Verified Badge for Other Providers if Approved */}
                      {profileData.role === 'PROVIDER' && profileData.providerProfile?.approvedByAdmin && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center gap-2 text-green-700 mb-1">
                            <Award className="h-5 w-5" />
                            <span className="font-semibold">Verified Professional</span>
                          </div>
                          <p className="text-xs text-green-600">
                            ✓ Identity verified • Trusted provider
                          </p>
                        </div>
                      )}
                    </div>
                )}

              {/* Quick Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Member since {profile.memberSince}</span>
                </div>
                
                {/* Languages - Only for providers */}
                {profile.role === 'PROVIDER' && (
                  <div>
                    <span className="text-gray-600">Languages: </span>
                    {isEditing ? (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {profileData.providerProfile?.languages.map((language) => (
                            <span
                              key={language}
                              className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center"
                            >
                              {language}
                              <button
                                type="button"
                                onClick={() => handleRemoveLanguage(language)}
                                className="ml-1 text-red-500 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            placeholder="Add language"
                          />
                          <button
                            type="button"
                            onClick={handleAddLanguage}
                            className="px-2 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-900">{profile.languages.join(', ')}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Preferences - Only for clients */}
              {profile.role === 'CLIENT' && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Preferences</h3>
                  {isEditing ? (
                    <textarea
                      name="preferences"
                      value={profileData.clientProfile?.preferences || ''}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        clientProfile: {
                          ...profileData.clientProfile!,
                          preferences: e.target.value
                        }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Tell us about your preferences"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">
                      {profile.preferences || 'No preferences provided.'}
                    </p>
                  )}
                </div>
              )}

              {/* Skills - Only for providers */}
              {profile.role === 'PROVIDER' && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                  {isEditing ? (
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profileData.providerProfile?.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs flex items-center"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          placeholder="Add skill"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-2 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Certifications - Only for providers */}
              {profile.role === 'PROVIDER' && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      {profileData.providerProfile?.certifications.map((cert) => (
                        <div key={cert} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-emerald-500 mr-2" />
                            <span className="text-gray-700">{cert}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(cert)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          placeholder="Add certification"
                        />
                        <button
                          type="button"
                          onClick={handleAddCertification}
                          className="px-2 py-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {profile.certifications.map((cert) => (
                        <div key={cert} className="flex items-center text-sm">
                          <Award className="h-4 w-4 text-emerald-500 mr-2" />
                          <span className="text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  name="description"
                  value={profile.role === 'PROVIDER' 
                    ? profileData.providerProfile?.description || '' 
                    : profileData.clientProfile?.description || ''}
                  onChange={(e) => {
                    if (profile.role === 'PROVIDER') {
                      setProfileData({
                        ...profileData,
                        providerProfile: {
                          ...profileData.providerProfile!,
                          description: e.target.value
                        }
                      });
                    } else {
                      setProfileData({
                        ...profileData,
                        clientProfile: {
                          ...profileData.clientProfile!,
                          description: e.target.value
                        }
                      });
                    }
                  }}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Tell us about yourself and your services"
                />
              ) : (
                <div className="text-gray-700 whitespace-pre-line">
                  {profile.description || (profile.role === 'CLIENT' ? 'No description provided' : '')}
                </div>
              )}
            </div>

            {/* Portfolio - Only for providers */}
            {profile.role === 'PROVIDER' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.portfolio.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-sm inline-block">
                          {item.results}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services - Only for providers */}
            {profile.role === 'PROVIDER' && services.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium">{service.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({service.reviews})</span>
                        </div>
                        <span className="text-sm text-gray-500">{service.deliveryTime} delivery</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">From ${service.price}</span>
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm">
                          Order Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews - Only for providers */}
            {profile.role === 'PROVIDER' && reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Reviews ({profile.reviewCount})
                </h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start">
                        <img
                          src={review.avatar}
                          alt={review.client}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.client}</h4>
                              <p className="text-sm text-gray-600">{review.service}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;