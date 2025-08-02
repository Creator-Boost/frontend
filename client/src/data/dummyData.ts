import { Service } from '../types/Service';

export const featuredServices: Service[] = [
    {
      id: '1',
      sellerId: 'seller1',
      title: 'YouTube Channel Growth Strategy',
      description: 'I will provide a comprehensive YouTube channel analysis and create a detailed growth strategy to boost your subscribers, views, and overall performance. With over 5 years of experience in YouTube marketing, I\'ve helped hundreds of creators achieve their goals.',
      platform: 'YouTube',
      category: 'Audit',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.9,
      reviews: 127,
      expert: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Top Rated'
      },
      thumbnail: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      packages: [
        { name: 'Basic', price: 99, deliveryDays: 3, description: 'Quick channel audit with basic recommendations' },
        { name: 'Standard', price: 199, deliveryDays: 5, description: 'Detailed audit with SEO optimization and content strategy' },
        { name: 'Premium', price: 299, deliveryDays: 7, description: 'Full audit & comprehensive growth plan with competitor analysis' }
      ],
      faqs: [
        {
          question: 'What do you need from me to get started?',
          answer: 'Just your YouTube channel link and any specific goals you want to achieve. No passwords or private access required.'
        },
        {
          question: 'Do you provide ongoing support?',
          answer: 'The Premium package includes 30 days of follow-up support via messages to help implement the strategy.'
        },
        {
          question: 'How quickly will I see results?',
          answer: 'Most clients see improvements within 2-4 weeks of implementing the recommendations, with significant growth in 2-3 months.'
        }
      ]
    },
    {
      id: '2',
      sellerId: 'seller2',
      title: 'Instagram Content & Hashtag Strategy',
      description: 'I will create a comprehensive Instagram content strategy and provide targeted hashtag research to boost your engagement, reach, and follower growth. My data-driven approach has helped over 200 accounts achieve their Instagram goals.',
      platform: 'Instagram',
      category: 'Content',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.8,
      reviews: 89,
      expert: {
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Level 2'
      },
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      packages: [
        { name: 'Basic', price: 49, deliveryDays: 2, description: 'Targeted hashtag research with 100+ hashtags' },
        { name: 'Standard', price: 99, deliveryDays: 4, description: 'Content strategy + hashtag research + posting schedule' },
        { name: 'Premium', price: 149, deliveryDays: 6, description: 'Complete Instagram audit + content strategy + hashtag research + competitor analysis' }
      ],
      faqs: [
        {
          question: 'Do you create the actual content?',
          answer: 'I provide content ideas, captions, and strategy. The Standard and Premium packages include detailed content templates you can customize.'
        },
        {
          question: 'How do you research hashtags?',
          answer: 'I use professional tools and manual research to find hashtags with optimal reach-to-competition ratios for your niche.'
        },
        {
          question: 'Will this work for business accounts?',
          answer: 'Absolutely! My strategies work for both personal brands and business accounts across all industries.'
        }
      ]
    },
    {
      id: '3',
      sellerId: 'seller3',
      title: 'TikTok Viral Content Creation',
      description: 'I will teach you the proven strategies and techniques to create viral TikTok content that drives massive engagement and follower growth. My methods have generated over 50M views for my clients.',
      platform: 'TikTok',
      category: 'Content',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.9,
      reviews: 156,
      expert: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Top Rated'
      },
      thumbnail: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      packages: [
        { name: 'Basic', price: 79, deliveryDays: 2, description: '20 viral content ideas with trending hashtags' },
        { name: 'Standard', price: 149, deliveryDays: 4, description: 'Viral content strategy + 30 content ideas + posting schedule' },
        { name: 'Premium', price: 199, deliveryDays: 6, description: 'Complete TikTok growth plan + viral content strategy + trend analysis + 50 content ideas' }
      ],
      faqs: [
        {
          question: 'Do you guarantee viral content?',
          answer: 'While I can\'t guarantee virality, my strategies significantly increase your chances. Most clients see 300%+ engagement improvement.'
        },
        {
          question: 'What niches do you work with?',
          answer: 'I work with all niches including lifestyle, business, education, entertainment, and more. Each strategy is customized to your audience.'
        },
        {
          question: 'Do you help with TikTok ads?',
          answer: 'The Premium package includes basic TikTok ads guidance, but I also offer separate ad management services.'
        }
      ]
    },
    {
      id: '4',
      sellerId: 'seller4',
      title: 'LinkedIn Business Growth',
      description: 'I will optimize your LinkedIn presence and create a comprehensive B2B growth strategy to generate quality leads, build professional networks, and establish thought leadership in your industry.',
      platform: 'LinkedIn',
      category: 'Growth',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.7,
      reviews: 73,
      expert: {
        name: 'David Park',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Level 2'
      },
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      packages: [
        { name: 'Basic', price: 149, deliveryDays: 3, description: 'LinkedIn profile optimization with keyword research' },
        { name: 'Standard', price: 299, deliveryDays: 5, description: 'Profile optimization + content strategy + connection outreach plan' },
        { name: 'Premium', price: 399, deliveryDays: 7, description: 'Complete LinkedIn growth strategy + lead generation system + content calendar + networking plan' }
      ],
      faqs: [
        {
          question: 'Do you help with LinkedIn ads?',
          answer: 'The Premium package includes LinkedIn ads strategy. I also offer separate ad management services for ongoing campaigns.'
        },
        {
          question: 'How do you generate leads?',
          answer: 'I create a systematic approach using optimized content, strategic networking, and targeted outreach to attract quality B2B leads.'
        },
        {
          question: 'What industries do you specialize in?',
          answer: 'I work with B2B companies across all industries including SaaS, consulting, finance, healthcare, and professional services.'
        }
      ]
    }
  ];