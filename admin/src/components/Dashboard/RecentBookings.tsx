import React, { useEffect, useState } from 'react';
import { Calendar, DollarSign, User } from 'lucide-react';
import { useAdminAuthStore } from '../../context/useAdminAuthStore';

interface Order {
  id: string;
  gigId: string;
  gigPackageId: string;
  buyerId: string;
  sellerId: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  packageName: string;
  requirements: string;
  status: string;
  orderDate: string;
  deliveryDate: string;
  gigTitle: string | null;
  gigDescription: string | null;
  packageDescription: string | null;
  deliveryFiles?: string[];
  deliveredFiles?: string;
  payments: any[];
  review: any;
  createdAt?: string;
}

interface OrderWithUserDetails extends Order {
  clientName?: string;
  providerName?: string;
  clientImageUrl?: string;
  providerImageUrl?: string;
}

const RecentBookings: React.FC = () => {
  const getAllOrders = useAdminAuthStore((state) => state.getAllOrders);
  const getUserProfile = useAdminAuthStore((state) => state.getUserProfile);
  const [recentBookings, setRecentBookings] = useState<OrderWithUserDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersWithUserDetails = async () => {
      try {
        const orders = await getAllOrders();
        console.log('Fetched orders:', orders);
        
        // Sort by creation date (most recent first) and take only the first 5
        const sortedOrders = orders
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.orderDate).getTime();
            const dateB = new Date(b.createdAt || b.orderDate).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);

        console.log('Sorted orders:', sortedOrders);

        // Fetch user details for each order
        const ordersWithUserDetails = await Promise.all(
          sortedOrders.map(async (order) => {
            try {
              console.log(`Processing order ${order.id}:`, order);
              
              // First, try to use the names that are already in the order
              if (order.buyerName && order.sellerName) {
                return {
                  ...order,
                  clientName: order.buyerName,
                  providerName: order.sellerName,
                  clientImageUrl: undefined,
                  providerImageUrl: undefined
                };
              }

              // If names are not available in order, try to fetch user profiles
              console.log(`Order buyerId: ${order.buyerId}, sellerId: ${order.sellerId}`);
              
              // Check if buyerId and sellerId exist and are not undefined
              if (!order.buyerId || !order.sellerId) {
                console.warn(`Order ${order.id} missing buyerId or sellerId:`, {
                  buyerId: order.buyerId,
                  sellerId: order.sellerId
                });
                return {
                  ...order,
                  clientName: 'Unknown Client',
                  providerName: 'Unknown Provider',
                  clientImageUrl: undefined,
                  providerImageUrl: undefined
                };
              }

              const [clientProfile, providerProfile] = await Promise.all([
                getUserProfile(order.buyerId).catch((error) => {
                  console.error(`Error fetching client profile for ${order.buyerId}:`, error);
                  return null;
                }),
                getUserProfile(order.sellerId).catch((error) => {
                  console.error(`Error fetching provider profile for ${order.sellerId}:`, error);
                  return null;
                })
              ]);

              console.log(`Client profile for ${order.buyerId}:`, clientProfile);
              console.log(`Provider profile for ${order.sellerId}:`, providerProfile);

              return {
                ...order,
                clientName: clientProfile?.name || order.buyerName || 'Unknown Client',
                providerName: providerProfile?.name || order.sellerName || 'Unknown Provider',
                clientImageUrl: clientProfile?.imageUrl,
                providerImageUrl: providerProfile?.imageUrl
              };
            } catch (error) {
              console.error('Error fetching user details for order:', order.id, error);
              return {
                ...order,
                clientName: order.buyerName || 'Unknown Client',
                providerName: order.sellerName || 'Unknown Provider',
                clientImageUrl: undefined,
                providerImageUrl: undefined
              };
            }
          })
        );

        console.log('Orders with user details:', ordersWithUserDetails);
        setRecentBookings(ordersWithUserDetails);
      } catch (err) {
        console.error('Failed to fetch recent bookings', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrdersWithUserDetails();
  }, [getAllOrders, getUserProfile]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarUrl = (imageUrl: string | undefined, userName: string): string => {
    if (imageUrl) {
      return imageUrl;
    }
    // Fallback to a default avatar with initials
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&size=32`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <span className="text-gray-500">Loading recent bookings...</span>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-4">
            <span className="text-gray-500">No recent bookings found</span>
          </div>
        ) : (
          recentBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-600 truncate max-w-[200px]">
                  {booking.requirements || 'No requirements specified'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status.toLowerCase())}`}>
                  {booking.status.replace('-', ' ')}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={getAvatarUrl(booking.clientImageUrl, booking.clientName || 'Client')} 
                      alt={booking.clientName || 'Client'}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getAvatarUrl(undefined, booking.clientName || 'Client');
                      }}
                    />
                    <span className="text-sm text-gray-600">{booking.clientName}</span>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={getAvatarUrl(booking.providerImageUrl, booking.providerName || 'Provider')} 
                      alt={booking.providerName || 'Provider'}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getAvatarUrl(undefined, booking.providerName || 'Provider');
                      }}
                    />
                    <span className="text-sm text-gray-600">{booking.providerName}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {booking.gigTitle || booking.packageName || 'Service'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-bold text-gray-900">${booking.amount}</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {new Date(booking.createdAt || booking.orderDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View All Bookings
        </button>
      </div>
    </div>
  );
};

export default RecentBookings;