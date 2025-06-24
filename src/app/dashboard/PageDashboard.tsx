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
import { CalendarIcon, Loader2, Ticket } from 'lucide-react';
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
  getOrderStatusDistributionFoodCombo,
  getTop5ArticleByView,
  getCountToalViewBlog,
  getTopFoods,
  getTopCombos,
  getTopDishes,
  getTotalSpecialOffer,
  getTotalInventory,
  getTotalInventoryValue,
  getLowStockIngredients,
  getStockOutByTime,
  getStockInByTime,
  getStockMovementByIngredient,
  getTotalStockInCost,
  getTotalStockOutValue,
  getStockInBySupplier,
  getStockInCostBySupplier,
  getInventoryByCategory,
  getStockInCostByCategory,
} from './dashboard.api';
import { exportReportData } from './ExportReportData';
import * as XLSX from 'xlsx';
import { IArticle } from './(blog)/article/article.interface';
import { IUnit } from './(inventory)/units/unit.interface';


const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFCE56', '#36A2EB'];
function withTimer<T>(label: string, fn: () => Promise<T>): Promise<T> {
  console.time(label);
  return fn().then((res) => {
    console.timeEnd(label);
    return res;
  });
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function PageDashboard() {
  const [loadingExport, setLoadingExport] = useState(false);
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

  const [totalInventory, setTotalInventory] = useState<
    { igd_id: string; igd_name: string; total_quantity: number, unt_name: string }[]
  >([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState<
    { igd_id: string; igd_name: string; total_quantity: number; total_value: number }[]
  >([]);
  const [lowStockIngredients, setLowStockIngredients] = useState<
    { igd_id: string; igd_name: string; total_quantity: number, unt_name: string }[]
  >([]);
  const [stockInByTime, setStockInByTime] = useState<
    { date: string; total_amount: number, invoice_count: number }[]
  >([]);
  const [stockOutByTime, setStockOutByTime] = useState<
    { date: string; total_amount: number, invoice_count: number }[]
  >([]);
  const [stockMovementByIngredient, setStockMovementByIngredient] = useState<
    { igd_id: string; igd_name: string; total_in: number; total_out: number }[]
  >([]);
  const [totalStockInCost, setTotalStockInCost] = useState<number>(0);
  const [totalStockOutValue, setTotalStockOutValue] = useState<number>(0);
  const [stockInBySupplier, setStockInBySupplier] = useState<
    { spli_id: string; spli_name: string; total_quantity: number }[]
  >([]);
  const [stockInCostBySupplier, setStockInCostBySupplier] = useState<
    { spli_id: string; spli_name: string; total_cost: number }[]
  >([]);
  const [inventoryByCategory, setInventoryByCategory] = useState<
    { cat_igd_id: string; cat_igd_name: string; total_quantity: number }[]
  >([]);
  const [stockInCostByCategory, setStockInCostByCategory] = useState<
    { cat_igd_id: string; cat_igd_name: string; total_cost: number }[]
  >([]);

  const [topFoods, setTopFoods] = useState<
    { id: string; name: string; orders: number; revenue: number }[]
  >([]);
  const [topCombos, setTopCombos] = useState<
    { id: string; name: string; price: number; orders: number; revenue: number }[]
  >([]);
  const [topDishes, setTopDishes] = useState<
    { id: string; dishName: string; totalQuantity: number }[]
  >([]);
  const [totalSpecialOffer, setTotalSpecialOffer] = useState<number>(0);
  const [totalViewBlog, setTotalViewBlog] = useState<number>(0);
  const [top5Article, setTop5Article] = useState<
    { title: string; views: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [queryParams, setQueryParams] = useState<{
  //   startDate: string;
  //   endDate: string;
  // }>({
  //   startDate: '2025-06-12',
  //   endDate: '2025-06-14',
  // });
  const [queryParams, setQueryParams] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const today = new Date();

    const getDateString = (date: Date) => {
      return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    };

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 100);

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 10);

    setQueryParams({
      startDate: getDateString(pastDate),
      endDate: getDateString(futureDate),
    });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!queryParams.startDate || !queryParams.endDate) {
          return;
        }
        setLoading(true);

        // const promises = [
        //   getTotalReservations(queryParams),
        //   getReservationTrends(queryParams),
        //   getTotalRevenue(queryParams),
        //   getRevenueTrends(queryParams),
        //   getRecentOrders(queryParams),
        //   getTotalRevenueFood(queryParams),
        //   getRevenueTrendsFood(queryParams),
        //   getRecentOrdersFood(queryParams),
        //   getOrderStatusDistributionFood(queryParams),
        //   getTotalComboRevenue(queryParams),
        //   getComboRevenueTrends(queryParams),
        //   getRecentComboOrders(queryParams),
        //   getOrderStatusDistributionFoodCombo(queryParams),
        //   getTotalStockValue(queryParams),
        //   getLowStockIngredients({ ...queryParams, threshold: 10 }),
        //   getRecentStockTransactions(queryParams),
        //   getCountToalViewBlog(),
        //   getTop5ArticleByView(),
        // ];
        const promises = [
          withTimer("getTotalReservations", () => getTotalReservations(queryParams)),
          withTimer("getReservationTrends", () => getReservationTrends(queryParams)),
          withTimer("getTotalRevenue", () => getTotalRevenue(queryParams)),
          withTimer("getRevenueTrends", () => getRevenueTrends(queryParams)),
          withTimer("getRecentOrders", () => getRecentOrders(queryParams)),
          withTimer("getTotalRevenueFood", () => getTotalRevenueFood(queryParams)),
          withTimer("getRevenueTrendsFood", () => getRevenueTrendsFood(queryParams)),
          withTimer("getRecentOrdersFood", () => getRecentOrdersFood(queryParams)),
          withTimer("getOrderStatusDistributionFood", () => getOrderStatusDistributionFood(queryParams)),
          withTimer("getTotalComboRevenue", () => getTotalComboRevenue(queryParams)),
          withTimer("getComboRevenueTrends", () => getComboRevenueTrends(queryParams)),
          withTimer("getRecentComboOrders", () => getRecentComboOrders(queryParams)),
          withTimer("getOrderStatusDistributionFoodCombo", () => getOrderStatusDistributionFoodCombo(queryParams)),
          withTimer("getTotalStockValue", () => getTotalStockValue(queryParams)),


          withTimer("getTotalInventory", () => getTotalInventory()),
          withTimer("getTotalInventoryValue", () => getTotalInventoryValue()),
          withTimer("getLowStockIngredients", () => getLowStockIngredients({ ...queryParams, threshold: 10 })),
          withTimer("getStockInByTime", () => getStockInByTime(queryParams)),
          withTimer("getStockOutByTime", () => getStockOutByTime(queryParams)),
          withTimer("getStockMovementByIngredient", () => getStockMovementByIngredient()),
          withTimer("getTotalStockInCost", () => getTotalStockInCost(queryParams)),
          withTimer("getTotalStockOutValue", () => getTotalStockOutValue(queryParams)),
          withTimer("getStockInBySupplier", () => getStockInBySupplier(queryParams)),
          withTimer("getStockInCostBySupplier", () => getStockInCostBySupplier(queryParams)),
          withTimer("getInventoryByCategory", () => getInventoryByCategory()),
          withTimer("getStockInCostByCategory", () => getStockInCostByCategory(queryParams)),

          withTimer("getTopFoods", () => getTopFoods(queryParams)),
          withTimer("getTopCombos", () => getTopCombos(queryParams)),
          withTimer("getTopDishes", () => getTopDishes(queryParams)),
          withTimer("getTotalSpecialOffer", () => getTotalSpecialOffer()),
          withTimer("getCountToalViewBlog", () => getCountToalViewBlog()),
          withTimer("getTop5ArticleByView", () => getTop5ArticleByView()),
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

          totalInventoryRes,
          totalInventoryValueRes,
          lowStockIngredientsRes,
          stockInByTimeRes,
          stockOutByTimeRes,
          stockMovementByIngredientRes,
          totalStockInCostRes,
          totalStockOutValueRes,
          stockInBySupplierRes,
          stockInCostBySupplierRes,
          inventoryByCategoryRes,
          stockInCostByCategoryRes,

          topFoodsRes,
          topCombosRes,
          topDishesRes,
          totalSpecialOfferRes,
          totalViewBlogRes,
          top5ArticleRes,
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


        if (totalInventoryRes.statusCode === 200 && totalInventoryRes.data)
          setTotalInventory(totalInventoryRes.data);
        if (totalInventoryValueRes.statusCode === 200 && totalInventoryValueRes.data)
          setTotalInventoryValue(totalInventoryValueRes.data);
        if (lowStockIngredientsRes.statusCode === 200 && lowStockIngredientsRes.data)
          setLowStockIngredients(lowStockIngredientsRes.data);
        if (stockInByTimeRes.statusCode === 200 && stockInByTimeRes.data)
          setStockInByTime(stockInByTimeRes.data);
        if (stockOutByTimeRes.statusCode === 200 && stockOutByTimeRes.data)
          setStockOutByTime(stockOutByTimeRes.data);
        if (stockMovementByIngredientRes.statusCode === 200 && stockMovementByIngredientRes.data)
          setStockMovementByIngredient(stockMovementByIngredientRes.data);
        if (totalStockInCostRes.statusCode === 200 && totalStockInCostRes.data)
          setTotalStockInCost(totalStockInCostRes.data.total_cost);
        if (totalStockOutValueRes.statusCode === 200 && totalStockOutValueRes.data)
          setTotalStockOutValue(totalStockOutValueRes.data.total_value);
        if (stockInBySupplierRes.statusCode === 200 && stockInBySupplierRes.data)
          setStockInBySupplier(stockInBySupplierRes.data);
        if (stockInCostBySupplierRes.statusCode === 200 && stockInCostBySupplierRes.data)
          setStockInCostBySupplier(stockInCostBySupplierRes.data);
        if (inventoryByCategoryRes.statusCode === 200 && inventoryByCategoryRes.data)
          setInventoryByCategory(inventoryByCategoryRes.data);
        if (stockInCostByCategoryRes.statusCode === 200 && stockInCostByCategoryRes.data)
          setStockInCostByCategory(stockInCostByCategoryRes.data);




        if (topFoodsRes.statusCode === 200 && topFoodsRes.data)
          setTopFoods(topFoodsRes.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            orders: item.orders,
            revenue: item.revenue,
          })));

        if (topCombosRes.statusCode === 200 && topCombosRes.data)
          setTopCombos(topCombosRes.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            orders: item.orders,
            revenue: item.revenue,
          })));

        if (topDishesRes.statusCode === 200 && topDishesRes.data)
          setTopDishes(topDishesRes.data.map((item: any) => ({
            id: item.id,
            dishName: item.dishName,
            totalQuantity: item.totalQuantity,
          })));

        if (totalSpecialOfferRes.statusCode === 200 && totalSpecialOfferRes.data)
          setTotalSpecialOffer(totalSpecialOfferRes.data.totalRevenue || 0);

        if (totalViewBlogRes.statusCode === 200 && totalViewBlogRes.data)
          setTotalViewBlog(totalViewBlogRes.data);

        if (top5ArticleRes.statusCode === 200 && top5ArticleRes.data) {
          setTop5Article(top5ArticleRes.data.map((item: IArticle) => ({
            title: item.atlTitle,
            views: item.atlView,
          })));
        }

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

  const handleExportReport = async () => {
    try {
      setLoadingExport(true);
      const data = await exportReportData();

      // Prepare data for Excel
      const workbook = XLSX.utils.book_new();

      // Define common cell style
      const cellStyle = {
        font: { name: 'Times New Roman', sz: 13 },
        alignment: { horizontal: 'left', vertical: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };

      // Define header cell style
      const headerStyle = {
        font: { name: 'Times New Roman', sz: 13, bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: 'D3D3D3' } }, // Light gray background for headers
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        },
      };

      // Helper function to apply styles to a sheet
      const applyStylesToSheet = (sheet: any, colCount: number, rowCount: number) => {
        for (let row = 0; row < rowCount; row++) {
          for (let col = 0; col < colCount; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (!sheet[cellRef]) sheet[cellRef] = {};
            sheet[cellRef].s = row === 0 ? headerStyle : cellStyle;
          }
        }
      };

      // Sheet 1: Summary
      const summaryData = [
        ['Metric', 'Value'],
        ['Doanh Thu Tại Bàn', formatCurrency(data.totalRevenue)],
        ['Doanh Thu Online', formatCurrency(data.totalRevenueFood)],
        ['Doanh Thu Combo', formatCurrency(data.totalRevenueCombo)],
        ['Tổng Đặt Bàn', data.totalReservations],
        ['Giá Trị Tồn Kho', formatCurrency(data.totalStockValue)],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      applyStylesToSheet(summarySheet, 2, summaryData.length);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan');

      // Sheet 2: Reservation Trends
      const reservationTrendsData = [
        ['Ngày', 'Số Bàn Đặt'],
        ...data.reservationTrends.map((item: any) => [item.date, item.reservations]),
      ];
      const reservationSheet = XLSX.utils.aoa_to_sheet(reservationTrendsData);
      applyStylesToSheet(reservationSheet, 2, reservationTrendsData.length);
      XLSX.utils.book_append_sheet(workbook, reservationSheet, 'Xu Hướng Đặt Bàn');

      // Sheet 3: Revenue Trends (Dish)
      const revenueTrendsDishData = [
        ['Ngày', 'Doanh Thu'],
        ...data.revenueTrends.map((item: any) => [item.date, item.revenue]),
      ];
      const revenueDishSheet = XLSX.utils.aoa_to_sheet(revenueTrendsDishData);
      applyStylesToSheet(revenueDishSheet, 2, revenueTrendsDishData.length);
      XLSX.utils.book_append_sheet(workbook, revenueDishSheet, 'Doanh Thu Tại Bàn');

      // Sheet 4: Revenue Trends (Food)
      const revenueTrendsFoodData = [
        ['Ngày', 'Doanh Thu'],
        ...data.revenueTrendsFood.map((item: any) => [item.date, item.revenue]),
      ];
      const revenueFoodSheet = XLSX.utils.aoa_to_sheet(revenueTrendsFoodData);
      applyStylesToSheet(revenueFoodSheet, 2, revenueTrendsFoodData.length);
      XLSX.utils.book_append_sheet(workbook, revenueFoodSheet, 'Doanh Thu Online');

      // Sheet 5: Revenue Trends (Combo)
      const revenueTrendsComboData = [
        ['Ngày', 'Doanh Thu'],
        ...data.comboRevenueTrends.map((item: any) => [item.date, item.revenue]),
      ];
      const revenueComboSheet = XLSX.utils.aoa_to_sheet(revenueTrendsComboData);
      applyStylesToSheet(revenueComboSheet, 2, revenueTrendsComboData.length);
      XLSX.utils.book_append_sheet(workbook, revenueComboSheet, 'Doanh Thu Combo');

      // Sheet 6: Recent Orders (Dish)
      const recentOrdersDishData = [
        ['ID', 'Khách Hàng', 'Tổng Tiền', 'Trạng Thái'],
        ...data.recentOrders.map((item: any) => [
          item.id,
          item.customer,
          item.total,
          item.status,
        ]),
      ];
      const ordersDishSheet = XLSX.utils.aoa_to_sheet(recentOrdersDishData);
      applyStylesToSheet(ordersDishSheet, 4, recentOrdersDishData.length);
      XLSX.utils.book_append_sheet(workbook, ordersDishSheet, 'Đơn Tại Bàn');

      // Sheet 7: Recent Orders (Food)
      const recentOrdersFoodData = [
        ['ID', 'Khách Hàng', 'Tổng Tiền', 'Trạng Thái'],
        ...data.recentOrdersFood.map((item: any) => [
          item.id,
          item.customer,
          item.total,
          item.status,
        ]),
      ];
      const ordersFoodSheet = XLSX.utils.aoa_to_sheet(recentOrdersFoodData);
      applyStylesToSheet(ordersFoodSheet, 4, recentOrdersFoodData.length);
      XLSX.utils.book_append_sheet(workbook, ordersFoodSheet, 'Đơn Online');

      // Sheet 8: Recent Orders (Combo)
      const recentOrdersComboData = [
        ['ID', 'Khách Hàng', 'Tổng Tiền', 'Trạng Thái'],
        ...data.recentComboOrders.map((item: any) => [
          item.id,
          item.customer,
          item.total,
          item.status,
        ]),
      ];
      const ordersComboSheet = XLSX.utils.aoa_to_sheet(recentOrdersComboData);
      applyStylesToSheet(ordersComboSheet, 4, recentOrdersComboData.length);
      XLSX.utils.book_append_sheet(workbook, ordersComboSheet, 'Đơn Combo');

      // Sheet 9: Order Status Distribution (Food)
      const orderStatusData = [
        ['Trạng Thái', 'Số Lượng'],
        ...data.orderStatusDistribution.map((item: any) => [item.type, item.value]),
      ];
      const statusSheet = XLSX.utils.aoa_to_sheet(orderStatusData);
      applyStylesToSheet(statusSheet, 2, orderStatusData.length);
      XLSX.utils.book_append_sheet(workbook, statusSheet, 'Trạng Thái Đơn Online');

      // Sheet 10: Order Status Distribution (Combo)
      const orderStatusComboData = [
        ['Trạng Thái', 'Số Lượng'],
        ...data.orderStatusDistributionCombo.map((item: any) => [item.type, item.value]),
      ];
      const statusComboSheet = XLSX.utils.aoa_to_sheet(orderStatusComboData);
      applyStylesToSheet(statusComboSheet, 2, orderStatusComboData.length);
      XLSX.utils.book_append_sheet(workbook, statusComboSheet, 'Trạng Thái Đơn Combo');

      // Sheet 11: Low Stock Ingredients

      // Sheet 12: Recent Stock Transactions

      const sheets = [
        summarySheet,
        reservationSheet,
        revenueDishSheet,
        revenueFoodSheet,
        revenueComboSheet,
        ordersDishSheet,
        ordersFoodSheet,
        ordersComboSheet,
        statusSheet,
        statusComboSheet,
      ];
      sheets.forEach((sheet) => {
        const colWidths = [];
        for (let col = 0; col < 10; col++) {
          let maxWidth = 10; // Minimum width
          for (let row = 0; row < 100; row++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (sheet[cellRef] && sheet[cellRef].v) {
              const cellValue = sheet[cellRef].v.toString();
              maxWidth = Math.max(maxWidth, cellValue.length * 1.2); // Estimate width
            }
          }
          colWidths.push({ wch: maxWidth });
        }
        sheet['!cols'] = colWidths;
      });

      // Generate and download the Excel file
      const fileName = `BaoCao_5Thang_${format(new Date(), 'yyyyMMdd')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error: any) {
      setError(error.message || 'Lỗi khi xuất báo cáo');
    } finally {
      setLoadingExport(false);
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
        <Button className='mt-6' variant={'outline'} onClick={handleExportReport} disabled={loadingExport}>
          {loadingExport ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Đang xuất báo cáo...
            </>
          ) : (
            'Xuất báo cáo'
          )}

        </Button>
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
            title: 'Ưu Đãi Đặc Biệt',
            value: totalSpecialOffer,
            // change: '+10%',
            icon: Ticket,
            color: 'text-orange-600',
          },
          {
            title: 'Tồn Kho',
            value: formatCurrency(totalStockValue),
            // change: 'Cập nhật',
            icon: Package,
            color: '',
          },
          {
            title: 'Lượt Xem Bài Viết',
            value: totalViewBlog.toString(),
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
                <Tooltip formatter={(value: number) => `${value} đã bán`} />
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

        {/* <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-teal-600">
              Top Món Tại Bàn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={topDishes}
                  dataKey="totalQuantity"
                  nameKey="dishName"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {topDishes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} đã bán`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {topDishes.map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.dishName}: {item.totalQuantity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-purple-600">
              Top Món Ăn Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={topFoods}
                  dataKey="orders"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {topFoods.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} đã bán`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {topFoods.map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.name}: {item.orders}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-red-600">
              Top Combo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={topCombos}
                  dataKey="orders"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {topCombos.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} đã bán`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {topCombos.map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.name}: {item.orders}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card> */}


        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-teal-600">
              Top Món Tại Bàn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topDishes}>
                <XAxis dataKey="dishName" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} đã bán`} />
                <Bar dataKey="totalQuantity" fill="#14B8A6" />
              </BarChart>
            </ResponsiveContainer>
            {/* <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {topDishes.map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.dishName}: {item.totalQuantity}
                </Badge>
              ))}
            </div> */}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-purple-600">
              Top Món Ăn Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topFoods}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} đã bán`} />
                <Bar dataKey="orders" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
            {/* <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {topFoods.map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.name}: {item.orders}
                </Badge>
              ))}
            </div> */}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-red-600">
              Top Combo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topCombos}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} đã bán`} />
                <Bar dataKey="orders" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
            {/* <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {topCombos.map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.name}: {item.orders}
                </Badge>
              ))}
            </div> */}
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

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-blue-600">
              Xu Hướng Nhập Kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stockInByTime}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}đ`} />
                <Line
                  type="monotone"
                  dataKey="total_amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-red-600">
              Xu Hướng Xuất Kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stockOutByTime}>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value.toLocaleString()}đ`} />
                <Line
                  type="monotone"
                  dataKey="total_amount"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-green-600">
              Tồn Kho Theo Danh Mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={inventoryByCategory}
                  dataKey="total_quantity"
                  nameKey="cat_igd_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {inventoryByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} đơn vị`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {inventoryByCategory.map((item) => (
                <Badge key={item.cat_igd_id} variant="outline">
                  {item.cat_igd_name}: {item.total_quantity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* 
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-purple-600">
              Nhập Kho Theo Nhà Cung Cấp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockInBySupplier}>
                <XAxis dataKey="spli_name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip formatter={(value: number) => `${value} đơn vị`} />
                <Bar dataKey="total_quantity" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-orange-600">
              Nguyên Liệu Sắp Hết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockIngredients.sort((a, b) => a.total_quantity - b.total_quantity).length ? (
                lowStockIngredients.map((item) => (
                  <div key={item.igd_id} className="flex justify-between border-b py-1 text-sm">
                    <span>{item.igd_name}</span>
                    <Badge variant="destructive">{item.total_quantity} {item.unt_name}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm">Không có nguyên liệu sắp hết.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Inventory Card */}
        {/* <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-teal-600">
              Tổng Tồn Kho
            </CardTitle>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={totalInventory}>
                  <XAxis dataKey="igd_name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip formatter={(value: number) => `${value} đơn vị`} />
                  <Bar dataKey="total_quantity" fill="#14B8A6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </CardHeader>
        </Card> */}


        {/* Stock Movement by Ingredient Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-blue-600">
              Di Chuyển Kho Theo Nguyên Liệu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockMovementByIngredient}>
                <XAxis dataKey="igd_name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    `${value} (${name === 'total_in' ? 'Nhập' : 'Xuất'})`
                  }
                />
                <Bar dataKey="total_in" fill="#3B82F6" name="Nhập" />
                <Bar dataKey="total_out" fill="#EF4444" name="Xuất" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Total Stock In/Out Cost Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium text-purple-600">
              Tổng Chi Phí Nhập/Xuất Kho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Chi Phí Nhập', value: totalStockInCost },
                    { name: 'Giá Trị Xuất', value: totalStockOutValue },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  <Cell fill="#8B5CF6" />
                  <Cell fill="#F87171" />
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-2 justify-center">
              <Badge variant="outline">Nhập: {formatCurrency(totalStockInCost)}</Badge>
              <Badge variant="outline">Xuất: {formatCurrency(totalStockOutValue)}</Badge>
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
              <LineChart data={top5Article}>
                <XAxis dataKey="title" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'views' ? 'Lượt xem' : '',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-2 justify-center">
              <Badge variant="outline">
                Xem: {top5Article.reduce((sum, item) => sum + item.views, 0)}
              </Badge>
              {/* <Badge variant="outline">
                Thích: {top5Article.reduce((sum, item) => sum + item.likes, 0)}
              </Badge> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}