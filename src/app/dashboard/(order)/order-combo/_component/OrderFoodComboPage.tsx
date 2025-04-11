'use client'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLoading } from '@/context/LoadingContext'
import { cn } from '@/lib/utils'
import { addDays, format, isAfter } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Format date to Vietnamese style
const formatVietnameseDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

// Function to get status text in Vietnamese
const getTextStatus = (status: string) => {
  const statusMap: any = {
    waiting_confirm_customer: 'Chờ xác nhận từ khách hàng',
    over_time_customer: 'Quá hạn xác nhận từ khách hàng',
    waiting_confirm_restaurant: 'Chờ nhà hàng xác nhận',
    waiting_shipping: 'Chờ giao hàng',
    shipping: 'Đang giao hàng',
    delivered_customer: 'Đã giao hàng đến khách hàng',
    received_customer: 'Khách hàng đã nhận hàng',
    cancel_customer: 'Khách hàng đã hủy đơn hàng',
    cancel_restaurant: 'Nhà hàng đã hủy đơn hàng',
    complaint: 'Khiếu nại',
    complaint_done: 'Khiếu nại đã giải quyết',
  }
  return statusMap[status] || status
}

// Function to determine badge variant based on status
const getStatusVariant = (status: string): 'default' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'over_time_customer':
    case 'cancel_customer':
    case 'cancel_restaurant':
    case 'complaint':
      return 'destructive';
    case 'delivered_customer':
    case 'received_customer':
    case 'complaint_done':
      return 'secondary';
    case 'waiting_confirm_customer':
    case 'waiting_confirm_restaurant':
    case 'waiting_shipping':
    case 'shipping':
      return 'default';
    default:
      return 'secondary';
  }
}

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea'
import { Pagination } from '@/components/Pagination'
import { IOrderFoodCombo } from '../order-food.interface'
import { getListOrderFoodCombo, restaurantCancelOrderFoodCombo, restaurantConfirmOrderFoodCombo, restaurantConfirmShipping, restaurantDeliveredOrderFoodCombo, restaurantFeedbackOrderFoodCombo, restaurantUpdateViewFeedbackOrderFoodCombo } from '../order-food.api'

const OrderCard: React.FC<{ order: IOrderFoodCombo; refresh: () => void }> = ({ order, refresh }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [isFeedbackViewActive, setIsFeedbackViewActive] = useState<boolean>(
    order.od_cb_feed_view === 'active'
  );
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');


  let totalComboPrice = 0;
  for (const item of order.orderItems) {
    const quantity = item.od_cb_it_quantity || 0;
    const price = item.foodComboSnap?.fcb_snp_price || 0;
    totalComboPrice += quantity * price;
  }
  const shippingPrice = order.od_cb_price_shipping || 0;
  const totalPrice = totalComboPrice + shippingPrice;

  const statusLabel = getTextStatus(order.od_cb_status);
  const statusVariant = getStatusVariant(order.od_cb_status);

  // Handle Confirm Order
  const handleConfirmOrder = async () => {
    const res = await restaurantConfirmOrderFoodCombo(order.od_cb_id);
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được xác nhận.',
        variant: 'default',
      });
      refresh(); // Refresh the order list
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể xác nhận đơn hàng.',
        variant: 'destructive',
      });
    }
  };

  // Handle Confirm Shipping
  const handleConfirmShipping = async () => {
    const res = await restaurantConfirmShipping(order.od_cb_id);
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đã xác nhận giao hàng.',
        variant: 'default',
      });
      refresh();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể xác nhận giao hàng.',
        variant: 'destructive',
      });
    }
  };

  // Handle Delivered Order
  const handleDeliveredOrder = async () => {
    const res = await restaurantDeliveredOrderFoodCombo(order.od_cb_id);
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được giao.',
        variant: 'default',
      });
      refresh();
    }
    else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể xác nhận giao hàng.',
        variant: 'destructive',
      });
    }
  };

  // Handle Cancel Order
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập lý do hủy đơn hàng.',
        variant: 'destructive',
      });
      return;
    }

    const res = await restaurantCancelOrderFoodCombo(order.od_cb_id, cancelReason);
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được hủy.',
        variant: 'default',
      });
      refresh();
      setIsCancelDialogOpen(false);
      setCancelReason('');
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể hủy đơn hàng.',
        variant: 'destructive',
      });
    }
  };
  // Handle Submit Feedback
  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập phản hồi trước khi gửi.',
        variant: 'destructive',
      });
      return;
    }

    const res = await restaurantFeedbackOrderFoodCombo(order.od_cb_id, feedback);
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: 'Phản hồi đã được gửi.',
        variant: 'default',
      });
      setFeedback('');
      refresh();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể gửi phản hồi.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFeedbackView = async () => {
    const newViewStatus = isFeedbackViewActive ? 'disable' : 'active';
    const res = await restaurantUpdateViewFeedbackOrderFoodCombo(order.od_cb_id, newViewStatus);
    if (res.statusCode === 200) {
      toast({
        title: 'Thành công',
        description: `Phản hồi đã được ${newViewStatus === 'active' ? 'hiển thị' : 'ẩn'}.`,
        variant: 'default',
      });
      setIsFeedbackViewActive(newViewStatus === 'active');
      refresh();
    } else {
      toast({
        title: 'Thất bại',
        description: res.message || 'Không thể cập nhật trạng thái hiển thị phản hồi.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="!py-0 !pt-6">
        <div className="flex justify-between items-start">
          <div className="w-2/3 flex flex-col">
            <div className="flex gap-2 items-center">
              <CardTitle>
                {order.od_cb_user_name} - {order.od_cb_user_phone || 'Không có'}
              </CardTitle>
              <CardDescription>({formatVietnameseDate(new Date(order.od_cb_created_at))})</CardDescription>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm italic text-muted-foreground">
                Tổng hóa đơn: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(totalPrice)}
              </span>
            </div>
            <span className="text-sm italic text-muted-foreground">
              Địa chỉ: {order.od_cb_user_address}, P.{order.od_cb_user_ward}, Q.{order.od_cb_user_district}, T.
              {order.od_cb_user_province}
            </span>
            <span className="text-sm italic text-muted-foreground">
              Feedback: {order.od_cb_feed_star} ⭐ - {order.od_cb_feed_content || 'Không có'}
            </span>
          </div>
          <div className="w-1/3">
            <Label className="font-semibold">Trạng thái</Label>
            <div className="mt-1">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
            <span className='text-sm italic text-muted-foreground'>
              Phản hồi: {order.od_cb_feed_reply || 'Chưa có phản hồi'}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {
                order.od_cb_status === 'waiting_confirm_restaurant' && (
                  <Button variant="outline" size="sm" onClick={handleConfirmOrder}>
                    Xác nhận đơn hàng
                  </Button>
                )
              }
              {
                order.od_cb_status === 'waiting_shipping' && (
                  <Button variant="outline" size="sm" onClick={handleConfirmShipping}>
                    Xác nhận giao hàng
                  </Button>
                )
              }
              {
                order.od_cb_status === 'shipping' && (
                  <Button variant="outline" size="sm" onClick={handleDeliveredOrder}>
                    Xác nhận đã giao hàng
                  </Button>
                )
              }
              {/* {
                order.od_cb_status === 'waiting_confirm_restaurant' || order.od_cb_status === 'waiting_shipping' ? (
                  <Button variant="outline" size="sm" onClick={handleCancelOrder}>
                    Hủy đơn hàng
                  </Button>
                ) : null
              } */}
              {(order.od_cb_status === 'waiting_confirm_restaurant' || order.od_cb_status === 'waiting_shipping') && (
                <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCancelDialogOpen(true)}
                    >
                      Hủy đơn hàng
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Lý do hủy đơn hàng</DialogTitle>
                      <DialogDescription>
                        Vui lòng nhập lý do bạn muốn hủy đơn hàng này. Lý do sẽ được gửi đến khách hàng.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Textarea
                        placeholder="Nhập lý do hủy..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCancelDialogOpen(false);
                          setCancelReason('');
                        }}
                      >
                        Đóng
                      </Button>
                      <Button onClick={handleCancelOrder}>Xác nhận hủy</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>

        {(order.od_cb_status === 'complaint' || order.od_cb_status === 'complaint_done') || (order.od_cb_feed_content && order.od_cb_feed_star) && (
          <div className="mt-4">
            {
              !order.od_cb_feed_reply &&
              <Label className="font-semibold">Phản hồi feedback</Label>
            }
            {
              !order.od_cb_feed_reply &&
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                className="mt-1"
              />}
            <div className="flex gap-2 mt-2">
              {
                !order.od_cb_feed_reply &&
                <Button size="sm" onClick={handleSubmitFeedback}>
                  Gửi phản hồi
                </Button>
              }
              <Button
                size="sm"
                variant={isFeedbackViewActive ? 'destructive' : 'default'}
                onClick={handleToggleFeedbackView}
              >
                {isFeedbackViewActive ? 'Ẩn phản hồi' : 'Hiển thị phản hồi'}
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="!py-0 !pt-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-blue-500 hover:underline">
              Xem chi tiết món ăn
            </AccordionTrigger>

            <AccordionContent>
              {order.orderItems.length > 0 ? (
                <div className="space-y-3 overflow-y-auto">
                  {order.orderItems.map((item, index) => {
                    return (
                      <div key={item.od_cb_it_id} className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-12 w-12 !rounded-md">
                          <AvatarImage
                            src={
                              item.foodComboSnap.fcb_snp_image
                                ? JSON.parse(item.foodComboSnap.fcb_snp_image)?.image_cloud
                                : '/placeholder-image.jpg'
                            }
                            alt="Food item"
                          />
                          <AvatarFallback>ITEM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            {item.foodComboSnap.fcb_snp_name} (
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(item.foodComboSnap.fcb_snp_price * item.od_cb_it_quantity)}
                            )
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Giá:
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(item.foodComboSnap.fcb_snp_price)}{' '}
                            x {item.od_cb_it_quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">Không có món ăn nào</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default function OrderFoodComboPage() {
  const today = new Date();
  const defaultToDate = new Date(today.setHours(0, 0, 0, 0));
  const defaultFromDate = new Date(defaultToDate);
  defaultFromDate.setDate(defaultFromDate.getDate() + 70);
  const [toDate, setToDate] = useState<Date>(defaultToDate);
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [meta, setMeta] = useState<{
    current: number;
    pageSize: number;
    totalPage: number;
    totalItem: number;
  }>({
    current: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  });
  const searchParam = useSearchParams().get('a');
  const [listOrderFoodCombo, setListOrderFoodCombo] = useState<IOrderFoodCombo[]>([]);

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(23);
      newDate.setMinutes(59);
      newDate.setSeconds(0);
      setFromDate(newDate);
    }
  };

  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      setToDate(newDate);
    }
  };

  const findListBookTable = async () => {
    const res: IBackendRes<IModelPaginate<IOrderFoodCombo>> = await getListOrderFoodCombo({
      current: pageIndex,
      pageSize: pageSize,
      toDate: toDate,
      fromDate: fromDate,
      status: status,
      q: query,
    });
    if (res.statusCode === 200 && res.data && res.data.result) {
      setListOrderFoodCombo(res.data.result);
      setMeta(res.data.meta);
    } else if (res.code === -10) {
      setListOrderFoodCombo([]);
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive',
      });
      await deleteCookiesAndRedirect();
    } else if (res.code === -11) {
      setListOrderFoodCombo([]);
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive',
      });
    } else {
      setListOrderFoodCombo([]);
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
  };

  const debouncedFindListOrder = useCallback(
    debounce(() => {
      findListBookTable();
    }, 300),
    [toDate, fromDate, pageIndex, pageSize, query, status]
  );

  useEffect(() => {
    debouncedFindListOrder();
    return () => {
      debouncedFindListOrder.cancel();
    };
  }, [toDate, fromDate, pageIndex, pageSize, query, status, debouncedFindListOrder]);

  useEffect(() => {
    debouncedFindListOrder();
    return () => {
      debouncedFindListOrder.cancel();
    };
  }, [searchParam]);

  return (
    <section>
      <div className="flex gap-4 mt-2 flex-wrap">
        <div className="flex gap-2 items-center">
          <Label className="mt-2">Từ</Label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant={'outline'}
                className={cn('w-[180px] justify-start text-left font-normal', !toDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? formatVietnameseDate(toDate) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectToDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm này</SelectItem>
                  <SelectItem value="-1">Ngày hôm qua</SelectItem>
                  <SelectItem value="-3">3 ngày trước</SelectItem>
                  <SelectItem value="-7">7 ngày trước</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={toDate} onSelect={handleSelectToDate} locale={vi} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 items-center">
          <Label className="mt-2">Đến</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn('w-[180px] justify-start text-left font-normal', !fromDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? formatVietnameseDate(fromDate) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectFromDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm này</SelectItem>
                  <SelectItem value="-1">Ngày hôm qua</SelectItem>
                  <SelectItem value="-3">3 ngày trước</SelectItem>
                  <SelectItem value="-7">7 ngày trước</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-md border">
                <Calendar mode="single" selected={fromDate} onSelect={handleSelectFromDate} locale={vi} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2 items-center">
          <Label className="mt-2">Tìm kiếm</Label>
          <Input
            placeholder="Nhập từ khóa tìm kiếm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Label className="mt-2">Trạng thái</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="waiting_confirm_customer">Chờ xác nhận từ khách hàng</SelectItem>
              <SelectItem value="over_time_customer">Quá hạn xác nhận từ khách hàng</SelectItem>
              <SelectItem value="waiting_confirm_restaurant">Chờ nhà hàng xác nhận</SelectItem>
              <SelectItem value="waiting_shipping">Chờ giao hàng</SelectItem>
              <SelectItem value="shipping">Đang giao hàng</SelectItem>
              <SelectItem value="delivered_customer">Đã giao hàng đến khách hàng</SelectItem>
              <SelectItem value="received_customer">Khách hàng đã nhận hàng</SelectItem>
              <SelectItem value="cancel_customer">Khách hàng đã hủy đơn hàng</SelectItem>
              <SelectItem value="cancel_restaurant">Nhà hàng đã hủy đơn hàng</SelectItem>
              <SelectItem value="complaint">Khiếu nại</SelectItem>
              <SelectItem value="complaint_done">Khiếu nại đã giải quyết</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        {listOrderFoodCombo.length > 0 ? (
          listOrderFoodCombo.map((order) => (
            <OrderCard key={order.od_cb_id} order={order} refresh={findListBookTable} />
          ))
        ) : (
          <p className="text-center text-gray-500">Không có đơn hàng nào để hiển thị.</p>
        )}
      </div>
      <div className='flex justify-end'>
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          meta={meta}
        />
      </div>
    </section>
  );
}