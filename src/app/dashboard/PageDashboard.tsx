'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Users,
  Utensils,
  BookOpen,
  Package,
  Table,
  ShoppingCart,
  Pizza,
} from 'lucide-react';
import {
  getTotalReservations,
  getReservationTrends,
  getCustomerDistribution,
  getTotalRevenue,
  getRevenueTrends,
  getTopDishes,
  getRecentOrders,
  getTotalRevenueFood,
  getRevenueTrendsFood,
  getTopFoods,
  getRecentOrdersFood,
  getOrderStatusDistributionFood,
  getTotalComboRevenue,
  getComboRevenueTrends,
  getTopCombos,
  getRecentComboOrders,
} from './dashboard.api';

// Static sample data
const blogPerformance = [
  { title: 'Top món ăn mùa hè', views: 1200, likes: 150 },
  { title: 'Cách làm phở ngon', views: 800, likes: 90 },
  { title: 'Chuyện nhà hàng', views: 600, likes: 70 },
];

const inventoryData = [
  { item: 'Thịt bò', stock: 50, unit: 'kg' },
  { item: 'Gạo', stock: 200, unit: 'kg' },
  { item: 'Rau xanh', stock: 30, unit: 'kg' },
  { item: 'Nước mắm', stock: 20, unit: 'lít' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFCE56',
  '#36A2EB',
  '#FF6384',
  '#4BC0C0',
  '#9966FF',
  '#C9CB3F',
  '#FF9F40',
];

export default function PageDashboard() {
  const [totalReservations, setTotalReservations] = useState<number>(0);
  const [reservationTrends, setReservationTrends] = useState<
    { date: string; reservations: number }[]
  >([]);
  const [customerData, setCustomerData] = useState<
    { type: string; value: number }[]
  >([]);
  const [totalRevenueDish, setTotalRevenueDish] = useState<number>(0);
  const [revenueTrendsDish, setRevenueTrendsDish] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [topDishes, setTopDishes] = useState<
    { name: string; orders: number; revenue: number }[]
  >([]);
  const [recentOrdersDish, setRecentOrdersDish] = useState<
    { id: string; customer: string; total: number; status: string }[]
  >([]);
  const [totalRevenueFood, setTotalRevenueFood] = useState<number>(0);
  const [revenueTrendsFood, setRevenueTrendsFood] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [topFoods, setTopFoods] = useState<
    { name: string; orders: number; revenue: number }[]
  >([]);
  const [recentOrdersFood, setRecentOrdersFood] = useState<
    { id: string; customer: string; total: number; status: string }[]
  >([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState<
    { type: string; value: number }[]
  >([]);
  const [totalRevenueCombo, setTotalRevenueCombo] = useState<number>(0);
  const [revenueTrendsCombo, setRevenueTrendsCombo] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [topCombos, setTopCombos] = useState<
    { name: string; orders: number; revenue: number }[]
  >([]);
  const [recentOrdersCombo, setRecentOrdersCombo] = useState<
    { id: string; customer: string; total: number; status: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const restaurantId = '123'; // TODO: Replace with dynamic restaurant ID
  const queryParams = {
    restaurantId,
    startDate: '2024-01-01',
    endDate: '2026-04-07',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Booking APIs
        const totalRes = await getTotalReservations(queryParams);
        if (totalRes.statusCode === 200 && totalRes.data) {
          setTotalReservations(totalRes.data.totalReservations);
        } else {
        }

        const trendsRes = await getReservationTrends(queryParams);
        if (trendsRes.statusCode === 200 && trendsRes.data) {
          setReservationTrends(trendsRes.data);
        } else {
        }

        const customerRes = await getCustomerDistribution(queryParams);
        if (customerRes.statusCode === 200 && customerRes.data) {
          setCustomerData([
            { type: 'Khách mới', value: customerRes.data.newCustomers },
            { type: 'Khách quen', value: customerRes.data.returningCustomers },
          ]);
        } else {
        }

        // Dish APIs
        const totalRevenueDishRes = await getTotalRevenue(queryParams);
        if (totalRevenueDishRes.statusCode === 200 && totalRevenueDishRes.data) {
          setTotalRevenueDish(totalRevenueDishRes.data.totalRevenue);
        } else {
        }

        const revenueTrendsDishRes = await getRevenueTrends(queryParams);
        if (revenueTrendsDishRes.statusCode === 200 && revenueTrendsDishRes.data) {
          setRevenueTrendsDish(revenueTrendsDishRes.data);
        } else {
        }

        const topDishesRes = await getTopDishes(queryParams);
        if (topDishesRes.statusCode === 200 && topDishesRes.data) {
          setTopDishes(topDishesRes.data);
        } else {
        }

        const recentOrdersDishRes = await getRecentOrders(queryParams);
        if (recentOrdersDishRes.statusCode === 200 && recentOrdersDishRes.data) {
          setRecentOrdersDish(recentOrdersDishRes.data);
        } else {
        }

        // Food APIs
        const totalRevenueFoodRes = await getTotalRevenueFood(queryParams);
        if (totalRevenueFoodRes.statusCode === 200 && totalRevenueFoodRes.data) {
          setTotalRevenueFood(totalRevenueFoodRes.data.totalRevenue);
        } else {
        }

        const revenueTrendsFoodRes = await getRevenueTrendsFood(queryParams);
        if (revenueTrendsFoodRes.statusCode === 200 && revenueTrendsFoodRes.data) {
          setRevenueTrendsFood(revenueTrendsFoodRes.data);
        } else {
        }

        const topFoodsRes = await getTopFoods(queryParams);
        if (topFoodsRes.statusCode === 200 && topFoodsRes.data) {
          setTopFoods(topFoodsRes.data);
        } else {
        }

        const recentOrdersFoodRes = await getRecentOrdersFood(queryParams);
        if (recentOrdersFoodRes.statusCode === 200 && recentOrdersFoodRes.data) {
          setRecentOrdersFood(recentOrdersFoodRes.data);
        } else {
        }

        const statusDistributionRes = await getOrderStatusDistributionFood(queryParams);
        if (statusDistributionRes.statusCode === 200 && statusDistributionRes.data) {
          setOrderStatusDistribution(statusDistributionRes.data);
        } else {
        }

        // Combo APIs
        const totalRevenueComboRes = await getTotalComboRevenue(queryParams);
        if (totalRevenueComboRes.statusCode === 200 && totalRevenueComboRes.data) {
          setTotalRevenueCombo(totalRevenueComboRes.data.totalComboRevenue);
        } else {
        }

        const revenueTrendsComboRes = await getComboRevenueTrends(queryParams);
        if (revenueTrendsComboRes.statusCode === 200 && revenueTrendsComboRes.data) {
          setRevenueTrendsCombo(revenueTrendsComboRes.data);
        } else {
        }

        const topCombosRes = await getTopCombos(queryParams);
        if (topCombosRes.statusCode === 200 && topCombosRes.data) {
          setTopCombos(topCombosRes.data);
        } else {
        }

        const recentOrdersComboRes = await getRecentComboOrders(queryParams);
        if (recentOrdersComboRes.statusCode === 200 && recentOrdersComboRes.data) {
          setRecentOrdersCombo(recentOrdersComboRes.data);
        } else {
        }

        setError(null);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Gradient for hover effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="gradient-revenue-dish" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-dishes" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#34D399', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-revenue-food" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#D946EF', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-foods" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-revenue-combo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F472B6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-combos" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F87171', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-blog" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EF4444', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-reservations" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#14B8A6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#22D3EE', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient-status" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FF9F40', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Dashboard Quản Lý Nhà Hàng
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Tổng quan hoạt động kinh doanh món ăn, món ăn online và combo
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {[
          {
            title: 'Doanh Thu Món Ăn',
            value: formatCurrency(totalRevenueDish),
            change: '+20%',
            icon: Utensils,
            color: 'from-green-400 to-emerald-600',
          },
          {
            title: 'Doanh Thu Online',
            value: formatCurrency(totalRevenueFood),
            change: '+18%',
            icon: ShoppingCart,
            color: 'from-yellow-400 to-amber-600',
          },
          {
            title: 'Doanh Thu Combo',
            value: formatCurrency(totalRevenueCombo),
            change: '+15%',
            icon: Pizza,
            color: 'from-red-400 to-pink-600',
          },
          {
            title: 'Số Khách Hàng',
            value: customerData.reduce((sum, item) => sum + item.value, 0).toString(),
            change: '+15%',
            icon: Users,
            color: 'from-blue-400 to-indigo-600',
          },
          {
            title: 'Đặt Bàn',
            value: totalReservations.toString(),
            change: '+12%',
            icon: Table,
            color: 'from-teal-400 to-cyan-600',
          },
          {
            title: 'Lượt Xem Blog',
            value: '2600',
            change: '+25%',
            icon: BookOpen,
            color: 'from-purple-400 to-violet-600',
          },
          {
            title: 'Tồn Kho',
            value: '4 mặt hàng',
            change: 'Cần bổ sung: 1',
            icon: Package,
            color: 'from-red-400 to-pink-600',
          },
        ].map((metric) => (
          <Card
            key={metric.title}
            className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${metric.color}`}
              >
                {metric.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 !p-0">
        {/* Dish Revenue Chart */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">
              Doanh Thu Món Ăn Theo Ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendsDish}>
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #C7D2FE',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#gradient-revenue-dish)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'url(#gradient-revenue-dish)' }}
                  activeDot={{ r: 8, fill: 'url(#gradient-revenue-dish)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Dishes Chart */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-700">
              Top Món Ăn Được Yêu Thích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDishes}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #6EE7B7',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" fill="url(#gradient-dishes)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Food Revenue Chart */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700">
              Doanh Thu Món Ăn Online Theo Ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendsFood}>
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #C4B5FD',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#gradient-revenue-food)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'url(#gradient-revenue-food)' }}
                  activeDot={{ r: 8, fill: 'url(#gradient-revenue-food)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Foods Chart */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-amber-700">
              Top Món Ăn Online Được Yêu Thích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topFoods}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #FBBF24',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" fill="url(#gradient-foods)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Combo Revenue Chart */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-pink-700">
              Doanh Thu Combo Online Theo Ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendsCombo}>
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #F9A8D4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#gradient-revenue-combo)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'url(#gradient-revenue-combo)' }}
                  activeDot={{ r: 8, fill: 'url(#gradient-revenue-combo)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Combos Chart */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-700">
              Top Combo Online Được Yêu Thích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topCombos}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" fill="url(#gradient-combos)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-orange-700">
              Phân Bố Trạng Thái Đơn Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusDistribution}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {orderStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #FDBA74',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => `${value} đơn`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4">
              {orderStatusDistribution.map((entry) => (
                <Badge key={entry.type} className="bg-orange-100 text-orange-800">
                  {entry.type}: {entry.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Distribution */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-cyan-700">
              Phân Loại Khách Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerData}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value} khách`}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #A5F3FC',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => `${value} khách`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4">
              {customerData.map((entry) => (
                <Badge
                  key={entry.type}
                  className={
                    entry.type === 'Khách mới'
                      ? 'bg-cyan-100 text-cyan-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }
                >
                  {entry.type}: {entry.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reservation Trends */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-teal-700">
              Xu Hướng Đặt Bàn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reservationTrends}>
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #5EEAD4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => `${value} bàn`}
                />
                <Line
                  type="monotone"
                  dataKey="reservations"
                  stroke="url(#gradient-reservations)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'url(#gradient-reservations)' }}
                  activeDot={{ r: 8, fill: 'url(#gradient-reservations)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Dish Orders */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg !p-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Đơn Hàng Món Ăn Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrdersDish.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2 gap-2"
                >
                  <div>
                    {/* <p className="font-medium text-gray-800">{order.id.slice(0, 8)}</p> */}
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-800">
                      {formatCurrency(order.total)}
                    </p>
                    <Badge
                      className={
                        order.status === 'Hoàn thành'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Từ chối'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Food Orders */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg !p-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Đơn Hàng Món Ăn Online Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrdersFood.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2 gap-2"
                >
                  <div>
                    {/* <p className="font-medium text-gray-800">{order.id.slice(0, 8)}</p> */}
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-800">
                      {formatCurrency(order.total)}
                    </p>
                    <Badge
                      className={
                        order.status === 'Hoàn thành'
                          ? 'bg-green-100 text-green-800'
                          : order.status.includes('hủy')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Combo Orders */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg !p-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Đơn Hàng Combo Online Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrdersCombo.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2 gap-2"
                >
                  <div>
                    {/* <p className="font-medium text-gray-800">{order.id.slice(0, 8)}</p> */}
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-gray-800">
                      {formatCurrency(order.total)}
                    </p>
                    <Badge
                      className={
                        order.status === 'Hoàn thành'
                          ? 'bg-green-100 text-green-800'
                          : order.status.includes('hủy')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-700">
              Trạng Thái Kho Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData.map((item) => ({
                    name: item.item,
                    value: item.stock,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {inventoryData.map((item) => (
                <div key={item.item} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.item}</span>
                  <Badge
                    className={
                      item.stock < 50
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }
                  >
                    {item.stock} {item.unit}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blog Performance */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-orange-700">
              Hiệu Suất Bài Viết Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={blogPerformance}>
                <XAxis dataKey="title" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #FDBA74',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="url(#gradient-blog)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'url(#gradient-blog)' }}
                  activeDot={{ r: 8, fill: 'url(#gradient-blog)' }}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#EF4444' }}
                  activeDot={{ r: 8, fill: '#EF4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4">
              <Badge className="bg-orange-100 text-orange-800">
                Tổng lượt xem: 2600
              </Badge>
              <Badge className="bg-red-100 text-red-800">
                Tổng lượt thích: 310
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}