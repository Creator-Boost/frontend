import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/store/authStore';


interface UserCardProps {
  user: {
    userId: string;
    name: string;
    imageUrl?: string;
  };
}

interface ProfileResponse {
	email: string;
	name: string;
	role: string;
	accountVerified: boolean;
	userId: string;
	imageUrl?: string;
	providerProfile?: ProviderProfile;
  	clientProfile?: ClientProfile;

}



interface ProviderProfile {
  title: string;
  location: string;
  description: string;
  languages: string[];
  skills: string[];
  certifications: string[];
}

interface ClientProfile {
  location: string;
  preferences: string;
  description: string;
}




const UserCard = ({ user }: UserCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/profile/${user.userId}`)}
      className="flex items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <img
        src={user.imageUrl || 'https://via.placeholder.com/150'}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div>
        <h3 className="font-medium text-gray-900">{user.name}</h3>
      </div>
    </div>
  );
};

const UsersList = () => {
  const [users, setUsers] = useState<ProfileResponse[]>([]);
  const { getAllUsers, isLoading, error } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Users</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <UserCard 
            key={user.userId} 
            user={{
              userId: user.userId,
              name: user.name,
              imageUrl: user.imageUrl
            }} 
          />
         
        ))}
      </div>
    </div>
  );
};

export default UsersList;