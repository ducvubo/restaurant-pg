'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { Input } from '@/components/ui/input'
import { IBookRoom, BookRoomStatus, IMenuItemsSnap, IAmenitiesSnap } from '../book-room.interface'
import {
  restaurantConfirmDepositBookRoom,
  restaurantConfirmBookRoom,
  restaurantCancelBookRoom,
  restaurantCheckInBookRoom,
  restaurantInUseBookRoom,
  restaurantNoShowBookRoom,
  restaurantRefundDepositBookRoom,
  restaurantRefundOneThirdDepositBookRoom,
  restaurantRefundOneTwoDepositBookRoom,
  restaurantNoDepositBookRoom,
  restaurantCheckOutBookRoom,
  restaurantCheckOutOvertimeBookRoom,
  restaurantConfirmPaymentBookRoom,
  restaurantExceptionBookRoom,
  restaurantFeedbackBookRoom,
  getListBookRoomRestaurantPagination,
  doneComplaintBookRoom,
  addMenuItemsToBookRoom,
  addAmenitiesToBookRoom,
  getAllAmenities,
  getAllMenuItems
} from '../book-room.api'
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Pagination } from '@/components/Pagination'
import { IAmenities } from '@/app/dashboard/(rooms)/amenities/amenities.interface'
import { IMenuItems } from '@/app/dashboard/(rooms)/menu-items/menu-items.interface'

const formatVietnameseDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

const getTextStatus = (status: BookRoomStatus) => {
  const statusMap: Record<BookRoomStatus, string> = {
    [BookRoomStatus.NEW_CREATED]: 'Mới tạo',
    [BookRoomStatus.OVERTIME_GUEST]: 'Quá hạn khách hàng',
    [BookRoomStatus.CANCEL_GUEST]: 'Khách hàng hủy',
    [BookRoomStatus.WAITING_RESTAURANT]: 'Chờ nhà hàng xác nhận',
    [BookRoomStatus.RESTAURANT_CONFIRM_DEPOSIT]: 'Nhà hàng xác nhận đặt cọc',
    [BookRoomStatus.CANCEL_RESTAURANT]: 'Nhà hàng hủy',
    [BookRoomStatus.RESTAURANT_CONFIRM]: 'Nhà hàng xác nhận',
    [BookRoomStatus.GUEST_CHECK_IN]: 'Khách hàng check-in',
    [BookRoomStatus.GUEST_CHECK_OUT]: 'Khách hàng check-out',
    [BookRoomStatus.GUEST_CHECK_OUT_OVERTIME]: 'Khách hàng check-out quá giờ',
    [BookRoomStatus.NO_SHOW]: 'Khách không đến',
    [BookRoomStatus.RESTAURANT_REFUND_DEPOSIT]: 'Hoàn cọc đầy đủ',
    [BookRoomStatus.RESTAURANT_REFUND_ONE_THIRD_DEPOSIT]: 'Hoàn 1/3 cọc',
    [BookRoomStatus.RESTAURANT_REFUND_ONE_TWO_DEPOSITE]: 'Hoàn 1/2 cọc',
    [BookRoomStatus.RESTAURANT_NO_DEPOSIT]: 'Không hoàn cọc',
    [BookRoomStatus.IN_USE]: 'Đang sử dụng',
    [BookRoomStatus.RESTAURANT_CONFIRM_PAYMENT]: 'Xác nhận thanh toán',
    [BookRoomStatus.GUEST_COMPLAINT]: 'Khiếu nại',
    [BookRoomStatus.DONE_COMPLAINT]: 'Khiếu nại đã giải quyết',
    [BookRoomStatus.RESTAURANT_EXCEPTION]: 'Ngoại lệ nhà hàng',
    [BookRoomStatus.GUEST_EXCEPTION]: 'Ngoại lệ khách hàng',
  }
  return statusMap[status] || status
}

const getStatusVariant = (status: BookRoomStatus): 'default' | 'destructive' | 'secondary' => {
  switch (status) {
    case BookRoomStatus.OVERTIME_GUEST:
    case BookRoomStatus.CANCEL_GUEST:
    case BookRoomStatus.CANCEL_RESTAURANT:
    case BookRoomStatus.NO_SHOW:
    case BookRoomStatus.GUEST_COMPLAINT:
      return 'destructive'
    case BookRoomStatus.GUEST_CHECK_OUT:
    case BookRoomStatus.DONE_COMPLAINT:
    case BookRoomStatus.RESTAURANT_CONFIRM_PAYMENT:
      return 'secondary'
    default:
      return 'default'
  }
}

const BookRoomCard: React.FC<{ bookRoom: IBookRoom; refresh: () => void }> = ({ bookRoom, refresh }) => {
  const [feedback, setFeedback] = useState<string>('')
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [isConfirmPaymentDialogOpen, setIsConfirmPaymentDialogOpen] = useState(false)
  const [plusPrice, setPlusPrice] = useState<string>('')
  const [isAddMenuItemsDialogOpen, setIsAddMenuItemsDialogOpen] = useState(false)
  const [isAddAmenitiesDialogOpen, setIsAddAmenitiesDialogOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<IMenuItems[]>([])
  const [amenities, setAmenities] = useState<IAmenities[]>([])
  const [selectedMenuItems, setSelectedMenuItems] = useState<{ id: string; quantity: number }[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<{ id: string; quantity: number }[]>([])

  const totalPrice = (bookRoom.bkr_plus_price || 0) +
    (bookRoom.menuItems?.reduce((sum, item: IMenuItemsSnap) => sum + (item.mitems_snap_price * item.mitems_snap_quantity), 0) || 0) +
    (bookRoom.amenities?.reduce((sum, item: IAmenitiesSnap) => sum + (item.ame_snap_price * item.ame_snap_quantity), 0) || 0) + bookRoom.bkr_plus_price

  const statusLabel = getTextStatus(bookRoom.bkr_status)
  const statusVariant = getStatusVariant(bookRoom.bkr_status)

  const fetchMenuItems = async () => {
    const res = await getAllMenuItems()
    if (res.statusCode === 200 && res.data) {
      setMenuItems(res.data)
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể tải danh sách món ăn.', variant: 'destructive' })
    }
  }

  const fetchAmenities = async () => {
    const res = await getAllAmenities()
    if (res.statusCode === 200 && res.data) {
      setAmenities(res.data)
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể tải danh sách tiện ích.', variant: 'destructive' })
    }
  }

  const handleAddMenuItems = async () => {
    await fetchMenuItems()
    setIsAddMenuItemsDialogOpen(true)
  }

  const handleAddAmenities = async () => {
    await fetchAmenities()
    setIsAddAmenitiesDialogOpen(true)
  }

  const handleMenuItemQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return
    setSelectedMenuItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.id !== id)
        }
        return prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      }
      return [...prev, { id, quantity }]
    })
  }

  const handleAmenityQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return
    setSelectedAmenities((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.id !== id)
        }
        return prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      }
      return [...prev, { id, quantity }]
    })
  }

  const handleSubmitMenuItems = async () => {
    if (selectedMenuItems.length === 0) {
      toast({ title: 'Lỗi', description: 'Vui lòng chọn ít nhất một món ăn.', variant: 'destructive' })
      return
    }
    const payload: { menu_id: string; bkr_menu_quantity: number }[] = selectedMenuItems.map((item) => ({
      menu_id: item.id,
      bkr_menu_quantity: item.quantity,
    }))
    const res = await addMenuItemsToBookRoom(bookRoom.bkr_id!, payload)
    if (res.statusCode === 200 || res.statusCode === 201) {
      toast({ title: 'Thành công', description: 'Đã thêm món ăn vào đặt phòng.', variant: 'default' })
      setIsAddMenuItemsDialogOpen(false)
      setSelectedMenuItems([])
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể thêm món ăn.', variant: 'destructive' })
    }
  }

  const handleSubmitAmenities = async () => {
    if (selectedAmenities.length === 0) {
      toast({ title: 'Lỗi', description: 'Vui lòng chọn ít nhất một tiện ích.', variant: 'destructive' })
      return
    }
    const payload: { ame_id: string; bkr_ame_quantity: number }[] = selectedAmenities.map((item) => ({
      ame_id: item.id,
      bkr_ame_quantity: item.quantity,
    }))
    const res = await addAmenitiesToBookRoom(bookRoom.bkr_id!, payload)
    if (res.statusCode === 200 || res.statusCode === 201) {
      toast({ title: 'Thành công', description: 'Đã thêm tiện ích vào đặt phòng.', variant: 'default' })
      setIsAddAmenitiesDialogOpen(false)
      setSelectedAmenities([])
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể thêm tiện ích.', variant: 'destructive' })
    }
  }

  const handleConfirmDeposit = async () => {
    const res = await restaurantConfirmDepositBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận đặt cọc.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận đặt cọc.', variant: 'destructive' })
    }
  }

  const handleConfirmBooking = async () => {
    const res = await restaurantConfirmBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận đặt phòng.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận đặt phòng.', variant: 'destructive' })
    }
  }

  const handleCheckIn = async () => {
    const res = await restaurantCheckInBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận check-in.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận check-in.', variant: 'destructive' })
    }
  }

  const handleInUse = async () => {
    const res = await restaurantInUseBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận đang sử dụng.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận trạng thái đang sử dụng.', variant: 'destructive' })
    }
  }

  const handleNoShow = async () => {
    const res = await restaurantNoShowBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã ghi nhận khách không đến.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể ghi nhận trạng thái khách không đến.', variant: 'destructive' })
    }
  }

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập lý do hủy đặt phòng.', variant: 'destructive' })
      return
    }
    const res = await restaurantCancelBookRoom(bookRoom.bkr_id!, cancelReason)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đặt phòng đã được hủy.', variant: 'default' })
      refresh()
      setIsCancelDialogOpen(false)
      setCancelReason('')
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể hủy đặt phòng.', variant: 'destructive' })
    }
  }

  const handleRefundDeposit = async () => {
    const res = await restaurantRefundDepositBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận hoàn cọc đầy đủ.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể hoàn cọc.', variant: 'destructive' })
    }
  }

  const handleRefundOneThirdDeposit = async () => {
    const res = await restaurantRefundOneThirdDepositBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận hoàn 1/3 cọc.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể hoàn 1/3 cọc.', variant: 'destructive' })
    }
  }

  const handleRefundOneTwoDeposit = async () => {
    const res = await restaurantRefundOneTwoDepositBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận hoàn 1/2 cọc.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể hoàn 1/2 cọc.', variant: 'destructive' })
    }
  }

  const handleNoDeposit = async () => {
    const res = await restaurantNoDepositBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận không hoàn cọc.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận không hoàn cọc.', variant: 'destructive' })
    }
  }

  const handleCheckOut = async () => {
    const res = await restaurantCheckOutBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận check-out.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận check-out.', variant: 'destructive' })
    }
  }

  const handleCheckOutOvertime = async () => {
    const res = await restaurantCheckOutOvertimeBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận check-out quá giờ.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận check-out quá giờ.', variant: 'destructive' })
    }
  }

  const handleConfirmPayment = async () => {
    if (Number(plusPrice) > Number(totalPrice)) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập số tiền hợp lệ.', variant: 'destructive' })
      return
    }
    const res = await restaurantConfirmPaymentBookRoom(bookRoom.bkr_id!, plusPrice)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã xác nhận thanh toán.', variant: 'default' })
      refresh()
      setIsConfirmPaymentDialogOpen(false)
      setPlusPrice('')
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể xác nhận thanh toán.', variant: 'destructive' })
    }
  }

  const handleRestaurantException = async () => {
    const res = await restaurantExceptionBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Đã ghi nhận ngoại lệ nhà hàng.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể ghi nhận ngoại lệ.', variant: 'destructive' })
    }
  }

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập phản hồi trước khi gửi.', variant: 'destructive' })
      return
    }
    const res = await restaurantFeedbackBookRoom(bookRoom.bkr_id!, feedback)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Phản hồi đã được gửi.', variant: 'default' })
      setFeedback('')
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể gửi phản hồi.', variant: 'destructive' })
    }
  }

  const handleDoneComplaint = async () => {
    const res = await doneComplaintBookRoom(bookRoom.bkr_id!)
    if (res.statusCode === 200) {
      toast({ title: 'Thành công', description: 'Khiếu nại đã được giải quyết.', variant: 'default' })
      refresh()
    } else {
      toast({ title: 'Thất bại', description: res.message || 'Không thể giải quyết khiếu nại.', variant: 'destructive' })
    }
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader className="!py-0 !pt-6">
        <div className="flex justify-between items-start">
          <div className="w-2/3 flex flex-col">
            <div className="flex gap-2 items-center">
              <CardTitle>{bookRoom.bkr_ame}: {bookRoom.bkr_email} - {bookRoom.bkr_phone || 'Không có'}</CardTitle>
              <CardDescription>({formatVietnameseDate(new Date(bookRoom.bkr_created_at!))})</CardDescription>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm italic text-muted-foreground">
                Tổng hóa đơn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
              </span>
            </div>
            <span className="text-sm italic text-muted-foreground">
              Thời gian: Từ {formatVietnameseDate(new Date(bookRoom.bkr_time_start!))} đến{' '}
              {formatVietnameseDate(new Date(bookRoom.bkr_time_end!))}
            </span>
            <span className="text-sm italic text-muted-foreground">
              Feedback: {bookRoom.bkr_star} ⭐ - {bookRoom.bkr_feedback || 'Không có'}
            </span>
          </div>
          <div className="w-1/3">
            <Label className="font-semibold">Trạng thái</Label>
            <div className="mt-1">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
            <span className="text-sm italic text-muted-foreground">
              Phản hồi: {bookRoom.bkr_reply || 'Chưa có phản hồi'}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              {bookRoom.bkr_status === BookRoomStatus.WAITING_RESTAURANT && (
                <>
                  <Button variant="outline" size="sm" onClick={handleConfirmDeposit}>
                    Xác nhận đặt cọc
                  </Button>
                  <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setIsCancelDialogOpen(true)}>
                        Hủy đặt phòng
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Lý do hủy đặt phòng</DialogTitle>
                        <DialogDescription>
                          Vui lòng nhập lý do bạn muốn hủy đặt phòng này. Lý do sẽ được gửi đến khách hàng.
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
                        <Button variant="outline" onClick={() => { setIsCancelDialogOpen(false); setCancelReason('') }}>
                          Đóng
                        </Button>
                        <Button onClick={handleCancelBooking}>Xác nhận hủy</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {bookRoom.bkr_status === BookRoomStatus.RESTAURANT_CONFIRM_DEPOSIT && (
                <Button variant="outline" size="sm" onClick={handleConfirmBooking}>
                  Xác nhận đặt phòng
                </Button>
              )}
              {bookRoom.bkr_status === BookRoomStatus.RESTAURANT_CONFIRM && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCheckIn}>
                    Xác nhận check-in
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNoShow}>
                    Khách không đến
                  </Button>
                </>
              )}
              {bookRoom.bkr_status === BookRoomStatus.GUEST_CHECK_IN && (
                <Button variant="outline" size="sm" onClick={handleInUse}>
                  Đang sử dụng
                </Button>
              )}
              {bookRoom.bkr_status === BookRoomStatus.IN_USE && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCheckOut}>
                    Xác nhận check-out
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCheckOutOvertime}>
                    Check-out quá giờ
                  </Button>
                  <Dialog open={isAddMenuItemsDialogOpen} onOpenChange={setIsAddMenuItemsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleAddMenuItems}>
                        Thêm món ăn
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Thêm món ăn</DialogTitle>
                        <DialogDescription>
                          Chọn món ăn và số lượng để thêm vào đặt phòng.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
                        {menuItems.map((item) => (
                          <div key={item.mitems_id} className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={item.mitems_image || '/placeholder-image.jpg'} alt={item.mitems_name} />
                              <AvatarFallback>{item.mitems_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{item.mitems_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.mitems_price || 0)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMenuItemQuantityChange(item.mitems_id!, (selectedMenuItems.find((i) => i.id === item.mitems_id)?.quantity || 0) - 1)}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min="0"
                                value={selectedMenuItems.find((i) => i.id === item.mitems_id)?.quantity || 0}
                                onChange={(e) => handleMenuItemQuantityChange(item.mitems_id!, parseInt(e.target.value) || 0)}
                                className="w-16 text-center"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMenuItemQuantityChange(item.mitems_id!, (selectedMenuItems.find((i) => i.id === item.mitems_id)?.quantity || 0) + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsAddMenuItemsDialogOpen(false); setSelectedMenuItems([]); }}>
                          Đóng
                        </Button>
                        <Button onClick={handleSubmitMenuItems}>Xác nhận</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isAddAmenitiesDialogOpen} onOpenChange={setIsAddAmenitiesDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleAddAmenities}>
                        Thêm tiện ích
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Thêm tiện ích</DialogTitle>
                        <DialogDescription>
                          Chọn tiện ích và số lượng để thêm vào đặt phòng.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
                        {amenities.map((item) => (
                          <div key={item.ame_id} className="flex items-center gap-4">
                            <div className="flex-1">
                              <p className="font-medium">{item.ame_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.ame_price || 0)} x
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAmenityQuantityChange(item.ame_id!, (selectedAmenities.find((i) => i.id === item.ame_id)?.quantity || 0) - 1)}
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min="0"
                                value={selectedAmenities.find((i) => i.id === item.ame_id)?.quantity || 0}
                                onChange={(e) => handleAmenityQuantityChange(item.ame_id!, parseInt(e.target.value) || 0)}
                                className="w-16 text-center"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAmenityQuantityChange(item.ame_id!, (selectedAmenities.find((i) => i.id === item.ame_id)?.quantity || 0) + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsAddAmenitiesDialogOpen(false); setSelectedAmenities([]); }}>
                          Đóng
                        </Button>
                        <Button onClick={handleSubmitAmenities}>Xác nhận</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {(bookRoom.bkr_status === BookRoomStatus.GUEST_CHECK_OUT || bookRoom.bkr_status === BookRoomStatus.GUEST_CHECK_OUT_OVERTIME) && (
                <Dialog open={isConfirmPaymentDialogOpen} onOpenChange={setIsConfirmPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setIsConfirmPaymentDialogOpen(true)}>
                      Xác nhận thanh toán
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Nhập số tiền bổ sung</DialogTitle>
                      <DialogDescription>
                        Vui lòng nhập số tiền bổ sung (có thể nhập số âm để giảm bớt hóa đơn) để xác nhận thanh toán.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        type="number"
                        placeholder="Nhập số tiền (VND)..."
                        value={plusPrice}
                        onChange={(e) => setPlusPrice(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => { setIsConfirmPaymentDialogOpen(false); setPlusPrice('') }}>
                        Đóng
                      </Button>
                      <Button onClick={handleConfirmPayment}>Xác nhận</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {(bookRoom.bkr_status === BookRoomStatus.CANCEL_GUEST || bookRoom.bkr_status === BookRoomStatus.NO_SHOW) && (
                <>
                  <Button variant="outline" size="sm" onClick={handleRefundDeposit}>
                    Hoàn cọc đầy đủ
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefundOneThirdDeposit}>
                    Hoàn 1/3 cọc
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefundOneTwoDeposit}>
                    Hoàn 1/2 cọc
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNoDeposit}>
                    Không hoàn cọc
                  </Button>
                </>
              )}
              {(bookRoom.bkr_status === BookRoomStatus.GUEST_EXCEPTION || bookRoom.bkr_status === BookRoomStatus.RESTAURANT_EXCEPTION) && (
                <>
                  <Button variant="outline" size="sm" onClick={handleRefundOneThirdDeposit}>
                    Hoàn 1/3 cọc
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefundOneTwoDeposit}>
                    Hoàn 1/2 cọc
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNoDeposit}>
                    Không hoàn cọc
                  </Button>
                </>
              )}{
                bookRoom.bkr_status === BookRoomStatus.RESTAURANT_CONFIRM && <Button variant="outline" size="sm" onClick={handleRestaurantException}>
                  Ngoại lệ nhà hàng
                </Button>
              }

            </div>
          </div>
        </div>
        {(bookRoom.bkr_status === BookRoomStatus.GUEST_COMPLAINT || bookRoom.bkr_status === BookRoomStatus.DONE_COMPLAINT || (bookRoom.bkr_feedback && bookRoom.bkr_star)) && (
          <div className="mt-4">
            {!bookRoom.bkr_reply && <Label className="font-semibold">Phản hồi feedback</Label>}
            {!bookRoom.bkr_reply && (
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                className="mt-1"
              />
            )}
            <div className="flex gap-2 mt-2">
              {!bookRoom.bkr_reply && (
                <Button size="sm" onClick={handleSubmitFeedback}>
                  Gửi phản hồi
                </Button>
              )}
              {bookRoom.bkr_status === BookRoomStatus.GUEST_COMPLAINT && (
                <Button size="sm" onClick={handleDoneComplaint}>
                  Giải quyết khiếu nại
                </Button>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="!py-0 !pt-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="menu-items">
            <AccordionTrigger className="text-blue-500 hover:underline">
              Xem chi tiết thực đơn
            </AccordionTrigger>
            <AccordionContent>
              {bookRoom.menuItems?.length > 0 ? (
                <div className="space-y-3">
                  {bookRoom.menuItems.map((item) => {
                    return (
                      <div key={item.mitems_snap_id} className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-12 w-12 !rounded-md">
                          <AvatarImage
                            src={item.mitems_snap_image ? JSON.parse(item.mitems_snap_image)?.image_cloud : '/placeholder-image.jpg'}
                            alt="Menu item"
                          />
                          <AvatarFallback>ITEM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            {item.mitems_snap_name} (
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.mitems_snap_price * item.mitems_snap_quantity)}
                            )
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.mitems_snap_price)} x {item.mitems_snap_quantity}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">Không có món ăn nào</p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="amenities">
            <AccordionTrigger className="text-blue-500 hover:underline">
              Xem chi tiết tiện ích
            </AccordionTrigger>
            <AccordionContent>
              {bookRoom.amenities?.length > 0 ? (
                <div className="space-y-3">
                  {bookRoom.amenities.map((item) => (
                    <div key={item.ame_snap_id} className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">
                          {item.ame_snap_name} (
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.ame_snap_price * item.ame_snap_quantity)}
                          )
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.ame_snap_price)} x {item.ame_snap_quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">Không có tiện ích nào</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default function BookRoomPage() {
  const today = new Date()
  const defaultToDate = new Date(today.setHours(0, 0, 0, 0))
  defaultToDate.setDate(defaultToDate.getDate() - 70)
  const defaultFromDate = new Date(defaultToDate)
  defaultFromDate.setDate(defaultFromDate.getDate() + 70)
  const [toDate, setToDate] = useState<Date>(defaultToDate)
  const [fromDate, setFromDate] = useState<Date>(defaultFromDate)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [meta, setMeta] = useState<{
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }>({
    current: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0,
  })
  const searchParam = useSearchParams().get('a')
  const [listBookRoom, setListBookRoom] = useState<IBookRoom[]>([])

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(23)
      newDate.setMinutes(59)
      newDate.setSeconds(0)
      setFromDate(newDate)
    }
  }

  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(0)
      newDate.setMinutes(0)
      newDate.setSeconds(0)
      setToDate(newDate)
    }
  }

  const findListBookRoom = async () => {
    const res: IBackendRes<IModelPaginate<IBookRoom>> = await getListBookRoomRestaurantPagination({
      pageIndex,
      pageSize,
      keyword: query,
      bkr_status: status,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      setListBookRoom(res.data.result)
      setMeta(res.data.meta)
    } else if (res.code === -10) {
      setListBookRoom([])
      toast({ title: 'Thông báo', description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', variant: 'destructive' })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListBookRoom([])
      toast({ title: 'Thông báo', description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết', variant: 'destructive' })
    } else {
      setListBookRoom([])
      toast({ title: 'Thất bại', description: 'Đã có lỗi xảy ra, vui lòng thử lại sau', variant: 'destructive' })
    }
  }

  const debouncedFindListBookRoom = useCallback(
    debounce(() => findListBookRoom(), 300),
    [toDate, fromDate, pageIndex, pageSize, query, status]
  )

  useEffect(() => {
    debouncedFindListBookRoom()
    return () => debouncedFindListBookRoom.cancel()
  }, [toDate, fromDate, pageIndex, pageSize, query, status, debouncedFindListBookRoom])

  useEffect(() => {
    debouncedFindListBookRoom()
    return () => debouncedFindListBookRoom.cancel()
  }, [searchParam])

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
                {toDate ? formatVietnameseDate(toDate) : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectToDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm nay</SelectItem>
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
                {fromDate ? formatVietnameseDate(fromDate) : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
              <Select onValueChange={(value) => handleSelectFromDate(addDays(new Date(), parseInt(value)))}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="0">Ngày hôm nay</SelectItem>
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
            placeholder="Nhập email hoặc số điện thoại..."
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
              {Object.values(BookRoomStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {getTextStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6">
        {listBookRoom.length > 0 ? (
          listBookRoom.map((bookRoom) => (
            <BookRoomCard key={bookRoom.bkr_id} bookRoom={bookRoom} refresh={findListBookRoom} />
          ))
        ) : (
          <p className="text-center text-gray-500">Không có đặt phòng nào để hiển thị.</p>
        )}
      </div>
      <div className="flex justify-end">
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          meta={meta}
        />
      </div>
    </section>
  )
}