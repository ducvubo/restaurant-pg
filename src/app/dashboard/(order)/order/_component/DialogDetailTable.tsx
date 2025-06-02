import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ListTablePage from './ListTablePage'
import { IModelPaginateWithStatusCount, IOrderRestaurant, ITableOrderSummary } from '../order.interface'
import { useEffect, useState } from 'react'
import { getListOrderSummaryByTable, updateStatusOrder } from '../order.api'
import { Pagination } from '@/components/Pagination'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateFinalPrice, calculateTotalPrice, formatDateMongo, switchStatusOrderSummaryVi } from '@/app/utils'
import { ModalUpdateStatusSummary } from './ModalUpdateSummary'
import AddOrderDish from './AddOrderDish'
import GetQrOrder from './GetQrOrder'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Props {
  selectedTable: ITableOrderSummary | null
  setSelectedTable: React.Dispatch<React.SetStateAction<ITableOrderSummary | null>>
}

export function DialogDetailTable({ selectedTable, setSelectedTable }: Props) {
  const router = useRouter()
  const { setLoading } = useLoading()
  const [listOrder, setListOrder] = useState<IOrderRestaurant[]>()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [meta, setMeta] = useState<{
    current: number
    pageSize: number
    totalPage: number
    totalItem: number
  }>({
    current: 1,
    pageSize: 10,
    totalPage: 1,
    totalItem: 0
  })
  const searchParam = useSearchParams().get('a')

  const getListOrderSummary = async () => {
    setLoading(true)
    if (!selectedTable) {
      setLoading(false)
      return
    }
    const res: IBackendRes<IModelPaginateWithStatusCount<IOrderRestaurant>> = await getListOrderSummaryByTable({
      current: pageIndex,
      pageSize: pageSize,
      od_dish_smr_table_id: selectedTable._id
    })
    if (res.statusCode === 200 && res.data && res.data.result) {
      setLoading(false)
      setListOrder(res.data.result)
      setMeta(res.data.meta)
      setPageIndex(res.data.meta.current)
      setPageSize(res.data.meta.pageSize)
    } else if (res.code === -10) {
      setListOrder([])
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      setListOrder([])
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      setListOrder([])
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    if (selectedTable) {
      getListOrderSummary()
    }
  }, [selectedTable, pageIndex, pageSize])

  const handleUpdateStatus = async ({
    _id,
    od_dish_status,
    od_dish_summary_id
  }: {
    _id: string
    od_dish_summary_id: string
    od_dish_status: 'processing' | 'pending' | 'delivered' | 'refuse'
  }) => {
    setLoading(true)
    const res = await updateStatusOrder({
      _id,
      od_dish_status,
      od_dish_summary_id
    })
    if (res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: 'Cập nhật trạng thái thành công',
        variant: 'default'
      })
      router.push(`/dashboard/order/table?a=${Math.floor(Math.random() * 100000) + 1}`)
      router.refresh()
    } else if (res.statusCode === 400) {
      setLoading(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          toast({
            title: 'Thất bại',
            description: item,
            variant: 'destructive'
          })
        })
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive'
        })
      }
    } else if (res.statusCode === 404) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Đơn hàng không tồn tại, vui lòng thử lại sau',
        variant: 'destructive'
      })
    } else if (res.code === -10) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else if (res.code === -11) {
      toast({
        title: 'Thông báo',
        description: 'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    if (selectedTable) {
      getListOrderSummary()
    }
  }, [searchParam, selectedTable])

  //od_dish_smr_count
  return (
    <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
      {/* <DialogTrigger asChild><Button variant='outline'>Edit Profile</Button></DialogTrigger> */}
      <DialogContent className='w-[500px]"'>
        <DialogHeader>
          <DialogTitle>{selectedTable?.tbl_name}</DialogTitle>
          <DialogDescription>
            <div className='flex gap-3'>
              <Badge className='whitespace-nowrap' variant={'outline'}>
                Đang order {selectedTable?.od_dish_smr_count.ordering}
              </Badge>
              <Badge className='whitespace-nowrap' variant={'outline'}>
                Đã thanh toán {selectedTable?.od_dish_smr_count.paid}
              </Badge>
              <Badge className='whitespace-nowrap' variant={'outline'}>
                Đang ngồi {selectedTable?.od_dish_smr_count.guest}
              </Badge>
              <Badge className='whitespace-nowrap' variant={'destructive'}>
                Đã từ chôi {selectedTable?.od_dish_smr_count.refuse}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className='h-[430px]'>
          <ScrollArea className='h-[400px] pr-3'>
            <div className='flex flex-col gap-3 mt-2 mb-2'>
              {listOrder?.map((order_summary: IOrderRestaurant, index1) => {
                return (
                  <Card className='w-[470px]' key={index1}>
                    <CardHeader>
                      <div className='flex justify-between'>
                        <div className='flex gap-1'>
                          <CardTitle className='mt-[1px]'>{order_summary.od_dish_smr_guest_id.guest_name}</CardTitle>
                          <CardDescription>({formatDateMongo(order_summary.createdAt)})</CardDescription>
                        </div>
                        <span className='italic'>Tổng: {calculateTotalPrice(order_summary)?.toLocaleString()}đ</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type='single' collapsible className='w-full'>
                        <AccordionItem value='item-1'>
                          <div className='grid grid-cols-[180px_140px_140px] -mt-4 mb-2'>
                            <Label className='font-bold -mt-1'>Món ăn</Label>
                            <Label className='font-bold -mt-1'>Tên khách</Label>
                            <Label className='font-bold -mt-1'>Trạng thái</Label>
                          </div>

                          {order_summary?.or_dish[0] && (
                            <div className='grid grid-cols-[180px_110px_120px] mb-4'>
                              <div className='flex gap-2 '>
                                <Image
                                  src={order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_image.image_cloud}
                                  width={100}
                                  height={100}
                                  alt='vuducbo'
                                  className='w-[45px] h-[45px] rounded-lg object-cover'
                                />
                                <div className=' flex flex-col'>
                                  <Label className='block w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>
                                    {order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_name}
                                  </Label>
                                  <Label className='italic'>
                                    Giá:{' '}
                                    {calculateFinalPrice(
                                      order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_price,
                                      order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_sale
                                    )?.toLocaleString('vi-VN')}
                                    đ x {order_summary?.or_dish[0]?.od_dish_quantity}
                                  </Label>
                                  <Label className='italic'>
                                    Tổng:{' '}
                                    {(
                                      calculateFinalPrice(
                                        order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_price,
                                        order_summary?.or_dish[0]?.od_dish_duplicate_id.dish_duplicate_sale
                                      ) * order_summary?.or_dish[0]?.od_dish_quantity
                                    )?.toLocaleString(
                                      'vi-VN'
                                    )}
                                    đ
                                  </Label>
                                </div>
                              </div>
                              <div className='flex items-center'>
                                <Label className='-mt-1 text-sm block w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>
                                  {order_summary?.or_dish[0]?.od_dish_guest_id.guest_name}
                                  {order_summary?.or_dish[0]?.od_dish_guest_id.guest_type === 'member'
                                    ? ' (Thành viên)'
                                    : ' (Chủ bàn)'}
                                </Label>
                              </div>
                              <div className='flex items-center'>
                                {order_summary?.or_dish[0]?.od_dish_status === 'guest_cancel' ? (
                                  <Badge variant={'destructive'}> Khách hủy</Badge>
                                ) : (
                                  <Select
                                    disabled={order_summary.od_dish_smr_status !== 'ordering'}
                                    value={order_summary?.or_dish[0]?.od_dish_status}
                                    onValueChange={(value: 'processing' | 'pending' | 'delivered' | 'refuse') =>
                                      handleUpdateStatus({
                                        _id: order_summary?.or_dish[0]?._id,
                                        od_dish_status: value,
                                        od_dish_summary_id: order_summary._id
                                      })
                                    }
                                  >
                                    <SelectTrigger className='w-[120px]'>
                                      <SelectValue placeholder='Đang nấu' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Chọn trạng thái</SelectLabel>
                                        <SelectItem value='pending'>Chờ xử lý</SelectItem>
                                        <SelectItem value='processing'>Đang nấu</SelectItem>
                                        <SelectItem value='delivered'>Đã phục vụ</SelectItem>
                                        <SelectItem value='refuse'>Từ chối</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </div>
                          )}

                          {order_summary.or_dish.slice(1).map((order_dish_item, index2) => {
                            return (
                              <AccordionContent key={index2}>
                                <div className='grid grid-cols-[180px_110px_120px]'>
                                  <div className='flex gap-2 '>
                                    <Image
                                      src={order_dish_item.od_dish_duplicate_id.dish_duplicate_image.image_cloud}
                                      width={100}
                                      height={100}
                                      alt='vuducbo'
                                      className='w-[45px] h-[45px] rounded-lg object-cover'
                                    />
                                    <div className=' flex flex-col'>
                                      <Label className='block w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>
                                        {order_dish_item.od_dish_duplicate_id.dish_duplicate_name}
                                      </Label>
                                      <Label className='italic'>
                                        Giá:{' '}
                                        {calculateFinalPrice(
                                          order_dish_item.od_dish_duplicate_id.dish_duplicate_price,
                                          order_dish_item.od_dish_duplicate_id.dish_duplicate_sale
                                        )?.toLocaleString()}
                                        đ x {order_dish_item.od_dish_quantity}
                                      </Label>
                                      <Label className='italic '>
                                        Tổng:{' '}
                                        {(
                                          calculateFinalPrice(
                                            order_dish_item.od_dish_duplicate_id.dish_duplicate_price,
                                            order_dish_item.od_dish_duplicate_id.dish_duplicate_sale
                                          ) * order_dish_item.od_dish_quantity
                                        )?.toLocaleString('vi-VN')}
                                        đ
                                      </Label>
                                    </div>
                                  </div>
                                  <div className='flex items-center'>
                                    <Label className=' -mt-1 block w-[100px] overflow-hidden text-ellipsis whitespace-nowrap'>
                                      {order_dish_item.od_dish_guest_id.guest_name}{' '}
                                      {order_dish_item.od_dish_guest_id.guest_type === 'member'
                                        ? ' (Thành viên)'
                                        : ' (Chủ bàn)'}
                                    </Label>
                                  </div>
                                  <div className='flex items-center'>
                                    {
                                      order_dish_item.od_dish_status === 'guest_cancel' ? (
                                        <Badge variant={'destructive'}> Khách hủy</Badge>
                                      ) : (
                                        <Select
                                          disabled={order_summary.od_dish_smr_status !== 'ordering'}
                                          value={order_dish_item.od_dish_status}
                                          onValueChange={(value: 'processing' | 'pending' | 'delivered' | 'refuse') =>
                                            handleUpdateStatus({
                                              _id: order_dish_item._id,
                                              od_dish_status: value,
                                              od_dish_summary_id: order_summary._id
                                            })
                                          }
                                        >
                                          <SelectTrigger className='w-[120px]'>
                                            <SelectValue placeholder='Đang nấu' />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectLabel>Chọn trạng thái</SelectLabel>
                                              <SelectItem value='pending'>Chờ xử lý</SelectItem>
                                              <SelectItem value='processing'>Đang nấu</SelectItem>
                                              <SelectItem value='delivered'>Đã phục vụ</SelectItem>
                                              <SelectItem value='refuse'>Từ chối</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      )
                                    }
                                  </div>
                                </div>
                              </AccordionContent>
                            )
                          })}
                          <AccordionTrigger className='-mt-5 -mb-5'>Xem chi tiết</AccordionTrigger>
                        </AccordionItem>
                        <div className='flex mt-2'>
                          <ModalUpdateStatusSummary order_summary={order_summary} />
                          <AddOrderDish order_summary={order_summary} />
                          <GetQrOrder order_summary={order_summary} />
                        </div>
                      </Accordion>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
          <div className='mt-2'>
            <Pagination
              meta={meta}
              pageIndex={pageIndex}
              pageSize={pageSize}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogFooter>
            <Button type='button' onClick={() => setSelectedTable(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
