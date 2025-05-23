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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { format, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { vi } from 'date-fns/locale';
import {
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
  getRecentOrders,
  getTotalRevenueFood,
  getRevenueTrendsFood,
  getRecentOrdersFood,
  getOrderStatusDistributionFood,
  getTotalComboRevenue,
  getComboRevenueTrends,
  getRecentComboOrders,
  getTotalStockValue,
  getLowStockIngredients,
  getRecentStockTransactions,
  getOrderStatusDistributionFoodCombo,
} from './dashboard.api';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFCE56', '#36A2EB'];
const blogPerformance = [
  { title: 'Top món ăn mùa hè', views: 1200, likes: 150 },
  { title: 'Cách làm phở ngon', views: 800, likes: 90 },
  { title: 'Chuyện nhà hàng', views: 600, likes: 70 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function PageDashboard() {
  const [totalReservations, setTotalReservations] = useState<number>(0);
  const [reservationTrends, setReservationTrends] = useState<
    { date: string; reservations: number }[]
  >([]);
  const [totalRevenueDish, setTotalRevenueDish] = useState<number>(0);
  const [revenueTrendsDish, setRevenueTrendsDish] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [recentOrdersDish, setRecentOrdersDish] = useState<
    { id: string; customer: string; total: number; status: string }[]
  >([]);
  const [totalRevenueFood, setTotalRevenueFood] = useState<number>(0);
  const [revenueTrendsFood, setRevenueTrendsFood] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [recentOrdersFood, setRecentOrdersFood] = useState<
    { id: string; customer: string; total: number; status: string }[]
  >([]);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState<
    { type: string; value: number }[]
  >([]);
  const [orderStatusDistributionCombo, setOrderStatusDistributionCombo] = useState<
    { type: string; value: number }[]
  >([]);
  const [totalRevenueCombo, setTotalRevenueCombo] = useState<number>(0);
  const [revenueTrendsCombo, setRevenueTrendsCombo] = useState<
    { date: string; revenue: number }[]
  >([]);
  const [recentOrdersCombo, setRecentOrdersCombo] = useState<
    { id: string; customer: string; total: number; status: string }[]
  >([]);
  const [totalStockValue, setTotalStockValue] = useState<number>(0);
  const [lowStockIngredients, setLowStockIngredients] = useState<
    { igd_name: string; stock: number; unit: string }[]
  >([]);
  const [recentStockTransactions, setRecentStockTransactions] = useState<
    { id: string; code: string; ingredient: string; quantity: number; date: string; type: 'in' | 'out' }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '2024-01-01',
    endDate: '2026-04-12',
  });
  // const queryParams = {
  //   startDate: '2024-01-01',
  //   endDate: '2026-04-12',
  // };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const promises = [
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
          getLowStockIngredients({ ...queryParams, threshold: 10 }),
          getRecentStockTransactions(queryParams)
        ];

        const [
          totalRes,
          trendsRes,
          totalRevenueDishRes,
          revenueTrendsDishRes,
          recentOrdersDishRes,
          totalRevenueFoodRes,
          revenueTrendsFoodRes,
          recentOrdersFoodRes,
          statusDistributionRes,
          totalRevenueComboRes,
          revenueTrendsComboRes,
          recentOrdersComboRes,
          statusDistributionResCombo,
          totalStockRes,
          lowStockRes,
          recentStockRes
        ] = await Promise.all(promises);

        if (totalRes.statusCode === 200 && totalRes.data)
          setTotalReservations(totalRes.data.totalReservations);

        if (trendsRes.statusCode === 200 && trendsRes.data)
          setReservationTrends(trendsRes.data);

        if (totalRevenueDishRes.statusCode === 200 && totalRevenueDishRes.data)
          setTotalRevenueDish(totalRevenueDishRes.data.totalRevenue);

        if (revenueTrendsDishRes.statusCode === 200 && revenueTrendsDishRes.data)
          setRevenueTrendsDish(revenueTrendsDishRes.data);

        if (recentOrdersDishRes.statusCode === 200 && recentOrdersDishRes.data)
          setRecentOrdersDish(recentOrdersDishRes.data);

        if (totalRevenueFoodRes.statusCode === 200 && totalRevenueFoodRes.data)
          setTotalRevenueFood(totalRevenueFoodRes.data.totalRevenue);

        if (revenueTrendsFoodRes.statusCode === 200 && revenueTrendsFoodRes.data)
          setRevenueTrendsFood(revenueTrendsFoodRes.data);

        if (recentOrdersFoodRes.statusCode === 200 && recentOrdersFoodRes.data)
          setRecentOrdersFood(recentOrdersFoodRes.data);

        if (statusDistributionRes.statusCode === 200 && statusDistributionRes.data)
          setOrderStatusDistribution(statusDistributionRes.data);

        if (totalRevenueComboRes.statusCode === 200 && totalRevenueComboRes.data)
          setTotalRevenueCombo(totalRevenueComboRes.data.totalComboRevenue);

        if (revenueTrendsComboRes.statusCode === 200 && revenueTrendsComboRes.data)
          setRevenueTrendsCombo(revenueTrendsComboRes.data);

        if (recentOrdersComboRes.statusCode === 200 && recentOrdersComboRes.data)
          setRecentOrdersCombo(recentOrdersComboRes.data);

        if (statusDistributionResCombo.statusCode === 200 && statusDistributionResCombo.data)
          setOrderStatusDistributionCombo(statusDistributionResCombo.data);

        if (totalStockRes.statusCode === 200 && totalStockRes.data)
          setTotalStockValue(totalStockRes.data.totalStockValue);

        if (lowStockRes.statusCode === 200 && lowStockRes.data)
          setLowStockIngredients(lowStockRes.data);

        if (recentStockRes.statusCode === 200 && recentStockRes.data)
          setRecentStockTransactions(recentStockRes.data);

        setError(null);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryParams]);

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setQueryParams((prev) => ({
        ...prev,
        [field]: format(date, 'yyyy-MM-dd'),
      }));
    }
  };


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-screen">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Từ ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {queryParams.startDate
                  ? format(parse(queryParams.startDate, 'yyyy-MM-dd', new Date()), 'PPP', { locale: vi })
                  : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parse(queryParams.startDate, 'yyyy-MM-dd', new Date())}
                onSelect={(date) => handleDateChange('startDate', date)}
                locale={vi}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Đến ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {queryParams.endDate
                  ? format(parse(queryParams.endDate, 'yyyy-MM-dd', new Date()), 'PPP', { locale: vi })
                  : 'Chọn ngày'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parse(queryParams.endDate, 'yyyy-MM-dd', new Date())}
                onSelect={(date) => handleDateChange('endDate', date)}
                locale={vi}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button className='mt-6' variant={'outline'}>Xuất báo cáo</Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[
          {
            title: 'Doanh Thu Tại Bàn',
            value: formatCurrency(totalRevenueDish),
            // change: '+20%',
            icon: Utensils,
            color: 'text-green-600',
          },
          {
            title: 'Doanh Thu Online',
            value: formatCurrency(totalRevenueFood),
            // change: '+18%',
            icon: ShoppingCart,
            color: 'text-yellow-600',
          },
          {
            title: 'Doanh Thu Combo',
            value: formatCurrency(totalRevenueCombo),
            // change: '+15%',
            icon: Pizza,
            color: 'text-red-600',
          },
          {
            title: 'Đặt Bàn',
            value: totalReservations.toString(),
            // change: '+12%',
            icon: Table,
            color: 'text-teal-600',
          },
          {
            title: 'Tồn Kho',
            value: formatCurrency(totalStockValue),
            // change: 'Cập nhật',
            icon: Package,
            color: '',
          },
          {
            title: 'Lượt Xem Blog',
            value: '2600',
            // change: '+25%',
            icon: BookOpen,
            color: 'text-purple-600',
          },
        ].map((metric) => (
          <Card key={metric.title} className=" shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium ">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 " />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-semibold ${metric.color}`}>
                {metric.value}
              </div>
              {/* <p className="text-xs ">{metric.change}</p> */}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className=" shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-indigo-600">
              Doanh Thu Tại Bàn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueTrendsDish}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#6B7280"
                  fontSize={10}
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

        <Card className=" shadow-md">
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
                  fontSize={10}
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

        <Card className=" shadow-md">
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
                  fontSize={10}
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
        <Card className=" shadow-md">
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

        <Card className=" shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-yellow-600">
              Nguyên Liệu Sắp Hết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockIngredients.length ? (
                lowStockIngredients.slice(0, 8).map((item) => (
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
                <p className="text-sm ">Không có nguyên liệu sắp hết.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className=" shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium ">
              Giao Dịch Kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentStockTransactions.length ? (
                recentStockTransactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between border-b py-1 text-sm"
                  >
                    <div>
                      <p>{transaction.ingredient}</p>
                      <p className="text-xs ">{transaction.code}</p>
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
                <p className="text-sm ">Không có giao dịch.</p>
              )}
            </div>
          </CardContent>
        </Card>


        <Card className=" shadow-md">
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

        <Card className=" shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-orange-600">
              Trạng Thái Đơn Combo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStatusDistributionCombo}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {orderStatusDistributionCombo.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} đơn`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {orderStatusDistributionCombo.map((entry) => (
                <Badge key={entry.type} variant="outline">
                  {entry.type}: {entry.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>



        <Card className=" shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium ">
              Đơn Tại Bàn Gần Đây
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
                <p className="text-sm ">Không có đơn hàng.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className=" shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium ">
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
                      <Badge>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm ">Không có đơn hàng.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className=" shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium ">
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
                <p className="text-sm ">Không có đơn hàng.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className=" shadow-md">
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