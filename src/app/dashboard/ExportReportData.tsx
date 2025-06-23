import { format } from "date-fns";
import {
  getTotalReservations,
  getReservationTrends,
  getTotalRevenue,
  getRevenueTrends,
  getRecentOrders,
  getTotalRevenueFood,
  getRevenueTrendsFood,
  getRecentOrdersFood,
  getOrderStatusDistributionFood,
  getTotalComboRevenue,
  getComboRevenueTrends,
  getRecentComboOrders,
  getTotalStockValue,
  getOrderStatusDistributionFoodCombo,
} from './dashboard.api';

export const exportReportData = async () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 5);

  const queryParams = {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
  };

  try {
    const [
      totalReservations,
      reservationTrends,
      totalRevenue,
      revenueTrends,
      recentOrders,
      totalRevenueFood,
      revenueTrendsFood,
      recentOrdersFood,
      orderStatusDistribution,
      totalRevenueCombo,
      comboRevenueTrends,
      recentComboOrders,
      orderStatusDistributionCombo,
      totalStockValue,
    ] = await Promise.all([
      getTotalReservations(queryParams),
      getReservationTrends(queryParams),
      getTotalRevenue(queryParams),
      getRevenueTrends(queryParams),
      getRecentOrders(queryParams),
      getTotalRevenueFood(queryParams),
      getRevenueTrendsFood(queryParams),
      getRecentOrdersFood(queryParams),
      getOrderStatusDistributionFood(queryParams),
      getTotalComboRevenue(queryParams),
      getComboRevenueTrends(queryParams),
      getRecentComboOrders(queryParams),
      getOrderStatusDistributionFoodCombo(queryParams),
      getTotalStockValue(queryParams),
    ]);

    return {
      totalReservations: totalReservations.data?.totalReservations || 0,
      reservationTrends: reservationTrends.data || [],
      totalRevenue: totalRevenue.data?.totalRevenue || 0,
      revenueTrends: revenueTrends.data || [],
      recentOrders: recentOrders.data || [],
      totalRevenueFood: totalRevenueFood.data?.totalRevenue || 0,
      revenueTrendsFood: revenueTrendsFood.data || [],
      recentOrdersFood: recentOrdersFood.data || [],
      orderStatusDistribution: orderStatusDistribution.data || [],
      totalRevenueCombo: totalRevenueCombo.data?.totalComboRevenue || 0,
      comboRevenueTrends: comboRevenueTrends.data || [],
      recentComboOrders: recentComboOrders.data || [],
      orderStatusDistributionCombo: orderStatusDistributionCombo.data || [],
      totalStockValue: totalStockValue.data?.totalStockValue || 0,
    };
  } catch (error) {
    throw new Error('Lỗi khi xuất dữ liệu báo cáo');
  }
};