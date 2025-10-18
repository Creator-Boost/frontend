export interface ServicePackage {
  id?: string;
  name: string;
  price: number;
  deliveryDays: number;
  description: string;
}

export interface ServiceImage {
  url: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviews: number;
  expert: {
    name: string;
    avatar: string;
    level: string;
  };
  thumbnail: string;
  images: ServiceImage[];
  packages: ServicePackage[];
  faqs: ServiceFAQ[];
}