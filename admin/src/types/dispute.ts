export interface Dispute {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdDate: string;
  resolved?: boolean;
}

export interface OrderWithDisputes {
  id: string;
  gigId: string;
  gigPackageId: string;
  buyerId: string;
  sellerId: string;
  buyerName?: string;
  sellerName?: string;
  amount: number;
  packageName: string;
  requirements: string;
  status: string;
  orderDate: string;
  deliveryDate: string;
  gigTitle?: string;
  gigDescription?: string;
  packageDescription?: string;
  deliveredFiles?: string;
  payments: any[];
  review: any;
  disputes: Dispute[];
}

export interface DisputeWithOrder extends Dispute {
  order: OrderWithDisputes;
  priority: 'high' | 'medium' | 'low';
}