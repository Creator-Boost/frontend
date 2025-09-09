import React from 'react';
import { Star, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Service } from '../types/Service';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const lowestPrice = Math.min(...service.packages.map(pkg => pkg.price));
  const fastestDelivery = Math.min(...service.packages.map(pkg => pkg.deliveryDays));

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] dark:bg-gray-900 dark:border-white/[0.2] border-gray-200 w-full h-auto rounded-lg border shadow-md transition-all duration-300">
        {/* Platform Badge */}
        <CardItem
          translateZ="80"
          className="absolute top-3 left-3 z-10"
        >
          <span className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {service.platform}
          </span>
        </CardItem>

        {/* Service Image */}
        <CardItem translateZ="100" className="w-full">
          <img
            src={service.thumbnail || service.images[0]?.url}
            alt={service.title}
            className="w-full h-48 object-cover rounded-t-lg group-hover/card:shadow-xl transition-shadow duration-300"
          />
        </CardItem>
        
        <div className="p-4">
          {/* Expert Info */}
          <CardItem
            translateZ="60"
            className="flex items-center mb-3"
          >
            <img
              src={service.expert.avatar}
              alt={service.expert.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{service.expert.name}</p>
              <p className="text-xs text-emerald-600 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                {service.expert.level}
              </p>
            </div>
          </CardItem>
          
          {/* Service Title */}
          <CardItem
            translateZ="50"
            className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2"
            as="h3"
          >
            {service.title}
          </CardItem>
          
          {/* Service Description */}
          <CardItem
            translateZ="40"
            className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2"
            as="p"
          >
            {service.description}
          </CardItem>
          
          {/* Rating and Delivery */}
          <CardItem
            translateZ="30"
            className="flex items-center justify-between mb-3"
          >
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">{service.rating}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({service.reviews})</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {fastestDelivery} day{fastestDelivery !== 1 ? 's' : ''}
            </div>
          </CardItem>
          
          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <CardItem
              translateZ="20"
              className="text-lg font-bold text-gray-900 dark:text-white"
            >
              From ${lowestPrice}
            </CardItem>
            <CardItem
              translateZ="20"
              as={Link}
              to={`/service/${service.id}`}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              View Details
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default ServiceCard;