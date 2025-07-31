import React from 'react';
import { Star, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '../types/Service';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const lowestPrice = Math.min(...service.packages.map(pkg => pkg.price));
  const fastestDelivery = Math.min(...service.packages.map(pkg => pkg.deliveryDays));

  return (
    <Link to={`/service/${service.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={service.thumbnail || service.images[0]?.url}
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {service.platform}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img
            src={service.expert.avatar}
            alt={service.expert.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{service.expert.name}</p>
            <p className="text-xs text-emerald-600 flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              {service.expert.level}
            </p>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900 ml-1">{service.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({service.reviews})</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {fastestDelivery} day{fastestDelivery !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">From ${lowestPrice}</span>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            View Details
          </button>
        </div>
      </div>
      </div>
    </Link>
  );
};

export default ServiceCard;