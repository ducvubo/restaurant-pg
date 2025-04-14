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
  getTotalStockValue,
  getStockInTrends,
  getStockOutTrends,
  getLowStockIngredients,
  getTopIngredients,
  getRecentStockTransactions,
  getStockByCategory,
} from './dashboard.api';

// Constants
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFCE56', '#36A2EB'];
const blogPerformance = [
  { title: 'Top món ăn mùa hè', views: 1200, likes: 150 },
  { title: 'Cách làm phở ngon', views: 800, likes: 90 },
  { title: 'Chuyện nhà hàng', views: 600, likes: 70 },
];

// Utility function
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function PageDashboard() {
  // State declarations (unchanged for brevity)
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
  const [totalStockValue, setTotalStockValue] = useState<number>(0);
  const [stockInTrends, setStockInTrends] = useState<
    { date: string; quantity: number; value: number }[]
  >([]);
  const [stockOutTrends, setStockOutTrends] = useState<
    { date: string; quantity: number; value: number }[]
  >([]);
  const [lowStockIngredients, setLowStockIngredients] = useState<
    { igd_name: string; stock: number; unit: string }[]
  >([]);
  const [topIngredients, setTopIngredients] = useState<
    { igd_name: string; quantity: number; value: number }[]
  >([]);
  const [recentStockTransactions, setRecentStockTransactions] = useState<
    { id: string; code: string; ingredient: string; quantity: number; date: string; type: 'in' | 'out' }[]
  >([]);
  const [stockByCategory, setStockByCategory] = useState<
    { category: string; stock: number; value: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const restaurantId = '123';
  const queryParams = {
    restaurantId,
    startDate: '2024-01-01',
    endDate: '2026-04-12',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch data (unchanged for brevity, same API calls)
        const totalRes = await getTotalReservations(queryParams);
        if (totalRes.statusCode === 200 && totalRes.data) {
          setTotalReservations(totalRes.data.totalReservations);
        }
        const trendsRes = await getReservationTrends(queryParams);
        if (trendsRes.statusCode === 200 && trendsRes.data) {
          setReservationTrends(trendsRes.data);
        }
        const customerRes = await getCustomerDistribution(queryParams);
        if (customerRes.statusCode === 200 && customerRes.data) {
          setCustomerData([
            { type: 'Khách mới', value: customerRes.data.newCustomers },
            { type: 'Khách quen', value: customerRes.data.returningCustomers },
          ]);
        }
        const totalRevenueDishRes = await getTotalRevenue(queryParams);
        if (totalRevenueDishRes.statusCode === 200 && totalRevenueDishRes.data) {
          setTotalRevenueDish(totalRevenueDishRes.data.totalRevenue);
        }
        const revenueTrendsDishRes = await getRevenueTrends(queryParams);
        if (revenueTrendsDishRes.statusCode === 200 && revenueTrendsDishRes.data) {
          setRevenueTrendsDish(revenueTrendsDishRes.data);
        }
        const topDishesRes = await getTopDishes(queryParams);
        if (topDishesRes.statusCode === 200 && topDishesRes.data) {
          setTopDishes(topDishesRes.data);
        }
        const recentOrdersDishRes = await getRecentOrders(queryParams);
        if (recentOrdersDishRes.statusCode === 200 && recentOrdersDishRes.data) {
          setRecentOrdersDish(recentOrdersDishRes.data);
        }
        const totalRevenueFoodRes = await getTotalRevenueFood(queryParams);
        if (totalRevenueFoodRes.statusCode === 200 && totalRevenueFoodRes.data) {
          setTotalRevenueFood(totalRevenueFoodRes.data.totalRevenue);
        }
        const revenueTrendsFoodRes = await getRevenueTrendsFood(queryParams);
        if (revenueTrendsFoodRes.statusCode === 200 && revenueTrendsFoodRes.data) {
          setRevenueTrendsFood(revenueTrendsFoodRes.data);
        }
        const topFoodsRes = await getTopFoods(queryParams);
        if (topFoodsRes.statusCode === 200 && topFoodsRes.data) {
          setTopFoods(topFoodsRes.data);
        }
        const recentOrdersFoodRes = await getRecentOrdersFood(queryParams);
        if (recentOrdersFoodRes.statusCode === 200 && recentOrdersFoodRes.data) {
          setRecentOrdersFood(recentOrdersFoodRes.data);
        }
        const statusDistributionRes = await getOrderStatusDistributionFood(queryParams);
        if (statusDistributionRes.statusCode === 200 && statusDistributionRes.data) {
          setOrderStatusDistribution(statusDistributionRes.data);
        }
        const totalRevenueComboRes = await getTotalComboRevenue(queryParams);
        if (totalRevenueComboRes.statusCode === 200 && totalRevenueComboRes.data) {
          setTotalRevenueCombo(totalRevenueComboRes.data.totalComboRevenue);
        }
        const revenueTrendsComboRes = await getComboRevenueTrends(queryParams);
        if (revenueTrendsComboRes.statusCode === 200 && revenueTrendsComboRes.data) {
          setRevenueTrendsCombo(revenueTrendsComboRes.data);
        }
        const topCombosRes = await getTopCombos(queryParams);
        if (topCombosRes.statusCode === 200 && topCombosRes.data) {
          setTopCombos(topCombosRes.data);
        }
        const recentOrdersComboRes = await getRecentComboOrders(queryParams);
        if (recentOrdersComboRes.statusCode === 200 && recentOrdersComboRes.data) {
          setRecentOrdersCombo(recentOrdersComboRes.data);
        }
        const totalStockRes = await getTotalStockValue(queryParams);
        if (totalStockRes.statusCode === 200 && totalStockRes.data) {
          setTotalStockValue(totalStockRes.data.totalStockValue);
        }
        const stockInTrendsRes = await getStockInTrends(queryParams);
        if (stockInTrendsRes.statusCode === 200 && stockInTrendsRes.data) {
          setStockInTrends(stockInTrendsRes.data);
        }
        const stockOutTrendsRes = await getStockOutTrends(queryParams);
        if (stockOutTrendsRes.statusCode === 200 && stockOutTrendsRes.data) {
          setStockOutTrends(stockOutTrendsRes.data);
        }
        const lowStockRes = await getLowStockIngredients({
          ...queryParams,
          threshold: 10,
        });
        if (lowStockRes.statusCode === 200 && lowStockRes.data) {
          setLowStockIngredients(lowStockRes.data);
        }
        const topIngredientsRes = await getTopIngredients(queryParams);
        if (topIngredientsRes.statusCode === 200 && topIngredientsRes.data) {
          setTopIngredients(topIngredientsRes.data);
        }
        const recentStockRes = await getRecentStockTransactions(queryParams);
        if (recentStockRes.statusCode === 200 && recentStockRes.data) {
          setRecentStockTransactions(recentStockRes.data);
        }
        const stockByCategoryRes = await getStockByCategory(queryParams);
        if (stockByCategoryRes.statusCode === 200 && stockByCategoryRes.data) {
          setStockByCategory(stockByCategoryRes.data);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-indigo-600">Dashboard Nhà Hàng</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tổng quan kinh doanh, đặt bàn, kho hàng
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[
          {
            title: 'Doanh Thu Món',
            value: formatCurrency(totalRevenueDish),
            change: '+20%',
            icon: Utensils,
            color: 'text-green-600',
          },
          {
            title: 'Doanh Thu Online',
            value: formatCurrency(totalRevenueFood),
            change: '+18%',
            icon: ShoppingCart,
            color: 'text-yellow-600',
          },
          {
            title: 'Doanh Thu Combo',
            value: formatCurrency(totalRevenueCombo),
            change: '+15%',
            icon: Pizza,
            color: 'text-red-600',
          },
          {
            title: 'Khách Hàng',
            value: customerData.reduce((sum, item) => sum + item.value, 0).toString(),
            change: '+15%',
            icon: Users,
            color: 'text-blue-600',
          },
          {
            title: 'Đặt Bàn',
            value: totalReservations.toString(),
            change: '+12%',
            icon: Table,
            color: 'text-teal-600',
          },
          {
            title: 'Tồn Kho',
            value: formatCurrency(totalStockValue),
            change: 'Cập nhật',
            icon: Package,
            color: 'text-gray-600',
          },
          {
            title: 'Lượt Xem Blog',
            value: '2600',
            change: '+25%',
            icon: BookOpen,
            color: 'text-purple-600',
          },
        ].map((metric) => (
          <Card key={metric.title} className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium text-gray-700">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-semibold ${metric.color}`}>
                {metric.value}
              </div>
              <p className="text-xs text-gray-500">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Dish Revenue */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-indigo-600">
              Doanh Thu Món
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueTrendsDish}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Dishes */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-green-600">
              Top Món Ăn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topDishes}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Food Revenue */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-purple-600">
              Doanh Thu Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueTrendsFood}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Foods */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-amber-600">
              Top Món Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topFoods}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Combo Revenue */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-pink-600">
              Doanh Thu Combo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueTrendsCombo}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Combos */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-red-600">
              Top Combo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topCombos}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock In Trends */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-green-600">
              Nhập Kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stockInTrends}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} đơn vị`} />
                <Line
                  type="monotone"
                  dataKey="quantity"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Out Trends */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-red-600">
              Xuất Kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stockOutTrends}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} đơn vị`} />
                <Line
                  type="monotone"
                  dataKey="quantity"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Stock Ingredients */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-yellow-600">
              Nguyên Liệu Sắp Hết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockIngredients.length ? (
                lowStockIngredients.map((item) => (
                  <div
                    key={item.igd_name}
                    className="flex justify-between border-b py-1 text-sm"
                  >
                    <span>{item.igd_name}</span>
                    <Badge variant="outline">
                      {item.stock} {item.unit}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có nguyên liệu sắp hết.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Ingredients */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-blue-600">
              Nguyên Liệu Phổ Biến
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topIngredients}>
                <XAxis dataKey="igd_name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} đơn vị`} />
                <Bar dataKey="quantity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Stock Transactions */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-gray-600">
              Giao Dịch Kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentStockTransactions.length ? (
                recentStockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between border-b py-1 text-sm"
                  >
                    <div>
                      <p>{transaction.ingredient}</p>
                      <p className="text-xs text-gray-500">{transaction.code}</p>
                    </div>
                    <div className="text-right">
                      <p>{transaction.quantity} đơn vị</p>
                      <Badge
                        variant={transaction.type === 'in' ? 'default' : 'destructive'}
                      >
                        {transaction.type === 'in' ? 'Nhập' : 'Xuất'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có giao dịch.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stock by Category */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-purple-600">
              Tồn Kho Theo Loại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stockByCategory}
                  dataKey="stock"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {stockByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} đơn vị`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {stockByCategory.map((entry) => (
                <Badge key={entry.category} variant="outline">
                  {entry.category}: {entry.stock}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-orange-600">
              Trạng Thái Đơn Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStatusDistribution}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {orderStatusDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} đơn`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {orderStatusDistribution.map((entry) => (
                <Badge key={entry.type} variant="outline">
                  {entry.type}: {entry.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Distribution */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-cyan-600">
              Loại Khách Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={customerData}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {customerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} khách`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {customerData.map((entry) => (
                <Badge key={entry.type} variant="outline">
                  {entry.type}: {entry.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reservation Trends */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-teal-600">
              Đặt Bàn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={reservationTrends}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} bàn`} />
                <Line
                  type="monotone"
                  dataKey="reservations"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Dish Orders */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-gray-600">
              Đơn Món Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrdersDish.length ? (
                recentOrdersDish.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between border-b py-1 text-sm"
                  >
                    <span>{order.customer}</span>
                    <div className="text-right">
                      <p>{formatCurrency(order.total)}</p>
                      <Badge
                        variant={
                          order.status === 'Hoàn thành'
                            ? 'default'
                            : order.status === 'Từ chối'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có đơn hàng.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Food Orders */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-gray-600">
              Đơn Online Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrdersFood.length ? (
                recentOrdersFood.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between border-b py-1 text-sm"
                  >
                    <span>{order.customer}</span>
                    <div className="text-right">
                      <p>{formatCurrency(order.total)}</p>
                      <Badge
                        variant={
                          order.status === 'Hoàn thành'
                            ? 'default'
                            : order.status.includes('hủy')
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có đơn hàng.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Combo Orders */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-gray-600">
              Đơn Combo Gần Đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrdersCombo.length ? (
                recentOrdersCombo.map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between border-b py-1 text-sm"
                  >
                    <span>{order.customer}</span>
                    <div className="text-right">
                      <p>{formatCurrency(order.total)}</p>
                      <Badge
                        variant={
                          order.status === 'Hoàn thành'
                            ? 'default'
                            : order.status.includes('hủy')
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Không có đơn hàng.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Blog Performance */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-orange-600">
              Hiệu Suất Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={blogPerformance}>
                <XAxis dataKey="title" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'views' ? 'Lượt xem' : 'Lượt thích',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-2 justify-center">
              <Badge variant="outline">
                Xem: {blogPerformance.reduce((sum, item) => sum + item.views, 0)}
              </Badge>
              <Badge variant="outline">
                Thích: {blogPerformance.reduce((sum, item) => sum + item.likes, 0)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}