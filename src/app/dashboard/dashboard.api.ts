'use server'

import { sendRequest } from "@/lib/api";
import { IArticle } from "./(blog)/article/article.interface";

export interface IGetStatsDto {
  startDate?: string;
  endDate?: string;
}


export const getTotalReservations = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/total-reservations`,
    method: 'GET',
    queryParams: data
  })
  return res
}

export const getReservationTrends = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/reservation-trends`,
    method: 'GET',
    queryParams: data
  })

  return res
}

export const getCustomerDistribution = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/customer-distribution`,
    method: 'GET',
    queryParams: data
  })

  return res
}

export const getBookingStatusDistribution = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/status-distribution`,
    method: 'GET',
    queryParams: data
  })

  return res
}

export const getAveragePartySize = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/book-table/average-party-size`,
    method: 'GET',
    queryParams: data
  })

  return res
}

export const getTotalRevenue = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/total-revenue`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getRevenueTrends = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/revenue-trends`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getTopDishes = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/top-dishes`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// export const getTopCombos = async (data: IGetStatsDto) => {
//   const res: IBackendRes<any> = await sendRequest({
//     url: `${process.env.URL_SERVER}/order-dish-summary/top-combos`,
//     method: 'GET',
//     queryParams: data,
//   });
//   return res;
// };

export const getRecentOrders = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER}/order-dish-summary/recent-orders`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getTotalRevenueFood = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/total-revenue`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getRevenueTrendsFood = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/revenue-trends`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getTopFoods = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/top-foods`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getRecentOrdersFood = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/recent-orders`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getOrderStatusDistributionFood = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food/status-distribution`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getTotalComboRevenue = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/total-revenue`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getComboRevenueTrends = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/revenue-trends`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getTopCombos = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/top-combos`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getRecentComboOrders = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/recent-orders`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getOrderStatusDistributionFoodCombo = async (data: IGetStatsDto) => {
  const res: IBackendRes<any> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/order-food-combo/status-distribution`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getTotalSpecialOffer = async () => {
  const res: IBackendRes<{
    totalRevenue: number;
  }> = await sendRequest({
    url: `${process.env.URL_SERVER_ORDER}/special-offers/total-special-offer`,
    method: 'GET',
  });
  return res;
};


export const getTotalStockValue = async (data: IGetStatsDto) => {
  const res: IBackendRes<{ totalStockValue: number }> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/total-stock-value`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get total inventory by ingredient
export const getTotalInventory = async () => {
  const res: IBackendRes<Array<{ igd_id: string; igd_name: string; total_quantity: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/total-inventory`,
    method: 'GET',
  });
  return res;
};

// Get total inventory value by ingredient
export const getTotalInventoryValue = async () => {
  const res: IBackendRes<Array<{ igd_id: string; igd_name: string; total_quantity: number; total_value: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/total-inventory-value`,
    method: 'GET',
  });
  return res;
};

// Get low stock ingredients
export const getLowStockIngredients = async (data: IGetStatsDto & { threshold?: number }) => {
  const res: IBackendRes<Array<{ igd_id: string; igd_name: string; total_quantity: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/low-stock`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get stock-in by time
export const getStockInByTime = async (data: IGetStatsDto) => {
  const res: IBackendRes<Array<{ date: string; total_quantity: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/stock-in-by-time`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get stock-out by time
export const getStockOutByTime = async (data: IGetStatsDto) => {
  const res: IBackendRes<Array<{ date: string; total_quantity: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/stock-out-by-time`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get stock movement by ingredient
export const getStockMovementByIngredient = async () => {
  const res: IBackendRes<Array<{ igd_id: string; igd_name: string; total_in: number; total_out: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/stock-movement-by-ingredient`,
    method: 'GET',
  });
  return res;
};

// Get total stock-in cost
export const getTotalStockInCost = async (data: IGetStatsDto) => {
  const res: IBackendRes<{ total_cost: number }> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/total-stock-in-cost`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get total stock-out value
export const getTotalStockOutValue = async (data: IGetStatsDto) => {
  const res: IBackendRes<{ total_value: number }> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/total-stock-out-value`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get stock-in by supplier
export const getStockInBySupplier = async (data: IGetStatsDto) => {
  const res: IBackendRes<Array<{ spli_id: string; spli_name: string; total_quantity: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/stock-in-by-supplier`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get stock-in cost by supplier
export const getStockInCostBySupplier = async (data: IGetStatsDto) => {
  const res: IBackendRes<Array<{ spli_id: string; spli_name: string; total_cost: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/stock-in-cost-by-supplier`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

// Get inventory by category
export const getInventoryByCategory = async () => {
  const res: IBackendRes<Array<{ cat_igd_id: string; cat_igd_name: string; total_quantity: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/inventory-by-category`,
    method: 'GET',
  });
  return res;
};

// Get stock-in cost by category
export const getStockInCostByCategory = async (data: IGetStatsDto) => {
  const res: IBackendRes<Array<{ cat_igd_id: string; cat_igd_name: string; total_cost: number }>> = await sendRequest({
    url: `${process.env.URL_SERVER_INVENTORY}/ingredients/stock-in-cost-by-category`,
    method: 'GET',
    queryParams: data,
  });
  return res;
};

export const getCountToalViewBlog = async () => {
  const res: IBackendRes<number> = await sendRequest({
    url: `${process.env.URL_SERVER_BLOG}/articles/count-total-view`,
    method: 'GET',
  });
  return res;
}

export const getTop5ArticleByView = async () => {
  const res: IBackendRes<IArticle[]> = await sendRequest({
    url: `${process.env.URL_SERVER_BLOG}/articles/top-5-article-by-view`,
    method: 'GET',
  });
  return res;
}