import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Check, Award, MessageCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { id } = useParams();

  // Mock profile data
  const profile = {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Social Media Growth Expert',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Los Angeles, CA',
    memberSince: 'January 2020',
    rating: 4.9,
    reviewCount: 127,
    completedOrders: 250,
    responseTime: '2 hours',
    languages: ['English', 'Spanish'],
    skills: ['YouTube Growth', 'Instagram Marketing', 'Content Strategy', 'SEO', 'Analytics'],
    description: `I'm a passionate social media strategist with over 5 years of experience helping creators and businesses grow their online presence. I specialize in YouTube channel optimization, Instagram growth strategies, and comprehensive social media audits.

My approach is data-driven and results-focused. I've helped over 250 clients achieve their social media goals, from small creators to established brands. Whether you're just starting out or looking to scale your existing presence, I'm here to help you succeed.`,
    certifications: [
      'Google Analytics Certified',
      'Facebook Blueprint Certified',
      'YouTube Creator Academy Graduate'
    ],
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
    ]
  };

  const services = [
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
  ];

  const reviews = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600">{profile.title}</p>
                <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.location}
                </div>
              </div>

              {/* Stats */}
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

              {/* Contact Button */}
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Me
              </button>

              {/* Quick Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">Member since {profile.memberSince}</span>
                </div>
                <div>
                  <span className="text-gray-600">Languages: </span>
                  <span className="text-gray-900">{profile.languages.join(', ')}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
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
              </div>

              {/* Certifications */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                <div className="space-y-2">
                  {profile.certifications.map((cert) => (
                    <div key={cert} className="flex items-center text-sm">
                      <Award className="h-4 w-4 text-emerald-500 mr-2" />
                      <span className="text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <div className="text-gray-700 whitespace-pre-line">{profile.description}</div>
            </div>

            {/* Portfolio */}
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

            {/* Services */}
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

            {/* Reviews */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;