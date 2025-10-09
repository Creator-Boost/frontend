import React, { useState } from 'react';

interface UserAvatarProps {
  imageUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  imageUrl, 
  name, 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg', 
    lg: 'w-16 h-16 text-xl'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Show image if available and not errored
  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={`${name}'s avatar`}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 ${className}`}
        onError={handleImageError}
      />
    );
  }

  // Fallback to initials
  return (
    <div className={`${sizeClasses[size]} bg-emerald-100 rounded-full flex items-center justify-center ${className}`}>
      <span className={`font-medium text-emerald-600 ${
        size === 'sm' ? 'text-xs' : 
        size === 'md' ? 'text-sm' : 
        'text-lg'
      }`}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default UserAvatar;