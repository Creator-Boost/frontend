import axios from 'axios';

const ORDER_API_URL = 'http://localhost:8085/api/orders';
const USER_API_URL = 'http://localhost:8080/api/users';

// Set up axios to include credentials
axios.defaults.withCredentials = true;

export interface RevenueData {
  month: string;
  revenue: number;
  orderCount: number;
}

export interface PopularService {
  gigId: string;
  gigTitle: string;
  bookings: number;
  revenue: number;
  growth: string;
  category: string;
}

export interface ReportsSummary {
  monthlyRevenue: number;
  monthlyRevenueGrowth: number;
  commissionEarned: number;
  commissionRate: number;
  averageTransaction: number;
  averageTransactionGrowth: number;
  totalOrders: number;
  completedOrders: number;
}

export interface ReportsData {
  summary: ReportsSummary;
  revenueData6Months: RevenueData[];
  revenueData1Year: RevenueData[];
  popularServices: PopularService[];
}

class AdminReportsService {
  private readonly COMMISSION_RATE = 0.10; // 10% commission

  /**
   * Get comprehensive reports data
   */
  async getReportsData(): Promise<ReportsData> {
    try {
      // Fetch all orders
      const ordersResponse = await axios.get(`${ORDER_API_URL}`);
      const orders = ordersResponse.data;

      // Process the data
      const summary = this.calculateSummary(orders);
      const revenueData = this.processRevenueData(orders);
      const popularServices = await this.getPopularServices(orders);

      return {
        summary,
        revenueData6Months: revenueData.sixMonths,
        revenueData1Year: revenueData.oneYear,
        popularServices
      };
    } catch (error) {
      console.error('Error fetching reports data:', error);
      throw new Error('Failed to fetch reports data');
    }
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(orders: any[]): ReportsSummary {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Filter orders for current month
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= currentMonth && orderDate < nextMonth;
    });

    // Filter orders for last month
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= lastMonth && orderDate < currentMonth;
    });

    // Calculate current month revenue
    const monthlyRevenue = currentMonthOrders.reduce((sum, order) => {
      return sum + (order.amount || 0);
    }, 0);

    // Calculate last month revenue
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => {
      return sum + (order.amount || 0);
    }, 0);

    // Calculate growth
    const monthlyRevenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Calculate commission
    const commissionEarned = monthlyRevenue * this.COMMISSION_RATE;

    // Calculate average transaction
    const averageTransaction = currentMonthOrders.length > 0 
      ? monthlyRevenue / currentMonthOrders.length 
      : 0;

    const lastMonthAverage = lastMonthOrders.length > 0 
      ? lastMonthRevenue / lastMonthOrders.length 
      : 0;

    const averageTransactionGrowth = lastMonthAverage > 0 
      ? ((averageTransaction - lastMonthAverage) / lastMonthAverage) * 100 
      : 0;

    // Count completed orders
    const completedOrders = orders.filter(order => 
      order.status === 'completed'
    ).length;

    return {
      monthlyRevenue,
      monthlyRevenueGrowth,
      commissionEarned,
      commissionRate: this.COMMISSION_RATE,
      averageTransaction,
      averageTransactionGrowth,
      totalOrders: orders.length,
      completedOrders
    };
  }

  /**
   * Process revenue data for charts
   */
  private processRevenueData(orders: any[]): { sixMonths: RevenueData[], oneYear: RevenueData[] } {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    // Generate month arrays
    const sixMonthsData: RevenueData[] = [];
    const oneYearData: RevenueData[] = [];

    // Process 6 months data
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= month && orderDate < nextMonth;
      });

      const revenue = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      
      sixMonthsData.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue,
        orderCount: monthOrders.length
      });
    }

    // Process 12 months data
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= month && orderDate < nextMonth;
      });

      const revenue = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
      
      oneYearData.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue,
        orderCount: monthOrders.length
      });
    }

    return { sixMonths: sixMonthsData, oneYear: oneYearData };
  }

  /**
   * Get popular services data
   */
  private async getPopularServices(orders: any[]): Promise<PopularService[]> {
    // Group orders by gigId
    const gigStats: { [gigId: string]: { 
      bookings: number, 
      revenue: number, 
      gigTitle: string,
      category: string
    } } = {};

    // Process orders to count bookings and revenue per gig
    orders.forEach(order => {
      const gigId = order.gigId;
      if (!gigId) return;

      if (!gigStats[gigId]) {
        gigStats[gigId] = {
          bookings: 0,
          revenue: 0,
          gigTitle: order.gigTitle || 'Unknown Service',
          category: 'General'
        };
      }

      gigStats[gigId].bookings += 1;
      gigStats[gigId].revenue += order.amount || 0;
    });

    // Convert to array and sort by bookings
    const popularServices: PopularService[] = Object.entries(gigStats)
      .map(([gigId, stats]) => ({
        gigId,
        gigTitle: stats.gigTitle,
        bookings: stats.bookings,
        revenue: stats.revenue,
        growth: this.calculateGrowth(gigId, orders), // Simple growth calculation
        category: stats.category
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10); // Top 10 services

    return popularServices;
  }

  /**
   * Calculate growth for a specific gig (simplified)
   */
  private calculateGrowth(gigId: string, orders: any[]): string {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return order.gigId === gigId && orderDate >= currentMonth && orderDate < nextMonth;
    }).length;

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return order.gigId === gigId && orderDate >= lastMonth && orderDate < currentMonth;
    }).length;

    if (lastMonthOrders === 0) {
      return currentMonthOrders > 0 ? '+100%' : '0%';
    }

    const growth = ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100;
    return growth >= 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  }

  /**
   * Export reports data as CSV
   */
  async exportReportsCSV(): Promise<void> {
    try {
      const data = await this.getReportsData();
      
      // Create CSV content
      const csvContent = this.generateCSVContent(data);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reports_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw new Error('Failed to export CSV');
    }
  }

  /**
   * Generate CSV content from reports data
   */
  private generateCSVContent(data: ReportsData): string {
    let csv = 'Reports Summary\n';
    csv += `Monthly Revenue,${data.summary.monthlyRevenue}\n`;
    csv += `Monthly Revenue Growth,${data.summary.monthlyRevenueGrowth.toFixed(2)}%\n`;
    csv += `Commission Earned,${data.summary.commissionEarned}\n`;
    csv += `Average Transaction,${data.summary.averageTransaction}\n`;
    csv += `Total Orders,${data.summary.totalOrders}\n`;
    csv += `Completed Orders,${data.summary.completedOrders}\n\n`;

    csv += 'Popular Services\n';
    csv += 'Service Name,Bookings,Revenue,Growth\n';
    data.popularServices.forEach(service => {
      csv += `"${service.gigTitle}",${service.bookings},${service.revenue},"${service.growth}"\n`;
    });

    csv += '\nRevenue Data (6 Months)\n';
    csv += 'Month,Revenue,Orders\n';
    data.revenueData6Months.forEach(item => {
      csv += `${item.month},${item.revenue},${item.orderCount}\n`;
    });

    return csv;
  }
}

export const adminReportsService = new AdminReportsService();