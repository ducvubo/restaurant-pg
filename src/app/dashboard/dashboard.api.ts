'use server'

import { sendRequest } from "@/lib/api";

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
  console.log("🚀 ~ getTotalReservations ~ res:", res)
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
  console.log("🚀 ~ getTotalRevenue ~ res:", res)
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