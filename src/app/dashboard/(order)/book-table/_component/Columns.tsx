'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { calculateFinalPrice, formatDateMongo, switchStatusOrderVi } from '@/app/utils'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useLoading } from '@/context/LoadingContext'
import { IBookTable } from '../book-table.interface'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  cancelBookTable,
  confirmBookTable,
  doneBookTable,
  exceptionBookTable,
  sendFeedbackBookTable
} from '../book-table.api'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const getTextStatus = (status: string) => {
  switch (status) {
    case 'WAITING_GUEST':
      return 'Chờ khách hàng xác nhận'
    case 'GUEST_CANCEL':
      return 'Khách hàng hủy'
    case 'EXPRIED_CONFIRM_GUEST':
      return 'Hết hạn xác nhận của khách hàng'
    case 'WAITING_RESTAURANT':
      return 'Chờ nhà hàng xác nhận'
    case 'RESTAURANT_CANCEL':
      return 'Nhà hàng hủy'
    case 'RESTAURANT_CONFIRM':
      return 'Nhà hàng xác nhận'
    case 'DONE':
      return 'Hoàn thành'
    case 'EXEPTION':
      return 'Ngoại lệ'
    default:
      return ''
  }
}

export const columns: ColumnDef<IBookTable>[] = [
  {
    accessorKey: 'od_dish_table_id',
    id: 'Tên khách',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên khách' />,
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return <span>{bookTable.book_tb_name}</span>
    },
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_date',
    id: 'Ngày đặt',
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return (
        <div className='flex flex-col'>
          <span>
            {bookTable.book_tb_hour} -{' '}
            {format(bookTable.book_tb_date, "EEEE, dd 'Tháng' MM 'Năm' yyyy", { locale: vi })}
          </span>
        </div>
      )
    },
    header: () => <div>Ngày đặt</div>,
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_number_adults',
    id: 'Số người',
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return (
        <div className='flex flex-col'>
          <span>Người lớn: {bookTable.book_tb_number_adults}</span>
          <span>Trẻ em: {bookTable.book_tb_number_children}</span>
        </div>
      )
    },
    header: () => <div>Số người</div>,
    enableHiding: true
  },

  {
    accessorKey: 'book_tb_note',
    id: 'Ghi chú của khách',
    header: () => <div>Ghi chú của khách</div>,
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_star',
    id: 'Sao',
    header: () => <div>Sao</div>,
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_note_res',
    id: 'Ghi chú của nhà hàng',
    header: () => <div>Ghi chú của nhà hàng</div>,
    enableHiding: true
  },

  {
    accessorKey: 'book_tb_feedback',
    id: 'Feedback của khách hàng',
    header: () => <div>Feedback của khách hàng</div>,
    enableHiding: true
  },
  {
    accessorKey: 'book_tb_feedback_restaurant',
    id: 'Phản hồi của nhà hàng',
    header: () => <div>Phản hồi của nhà hàng</div>,
    enableHiding: true
  },
  {
    accessorKey: 'od_dish_status',
    id: 'Trạng thái',
    cell: ({ row }) => {
      const bookTable: IBookTable = row.original
      return <div>{getTextStatus(bookTable.book_tb_status)}</div>
    },
    header: () => <div>Trạng thái</div>,
    enableHiding: true
  },
  {
    accessorKey: 'Actions',
    id: 'Hành động',
    cell: ({ row }) => {
      const { setLoading } = useLoading()
      const bookTable: IBookTable = row.original
      const router = useRouter()
      const [open, setOpen] = useState(false)
      const [openFeedBack, setOpenFeedback] = useState(false)
      const [note, setNote] = useState('')
      const [book_tb_feedback_restaurant, setBookTbFeedbackRestaurant] = useState<string>('')

      const handleUpdateStatus = async (status: 'cancel' | 'confirm' | 'done') => {
        setLoading(true)
        let res: IBackendRes<IBookTable> = { statusCode: 400, message: 'Đã có lỗi xảy ra, vui lòng thử lại sau' }
        if (status === 'cancel') await cancelBookTable(bookTable._id)
        if (status === 'confirm') res = await confirmBookTable(bookTable._id)
        if (status === 'done') res = await doneBookTable(bookTable._id)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
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
            description:
              'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
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

      const handleExceptionBookTable = async (book_tb_note_res: string) => {
        setLoading(true)
        const res: IBackendRes<IBookTable> = await exceptionBookTable(bookTable._id, book_tb_note_res)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
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
          setLoading(false)
          toast({
            title: 'Thông báo',
            description:
              'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
            variant: 'destructive'
          })
        } else {
          setLoading(false)
          toast({
            title: 'Thất bại',
            description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
            variant: 'destructive'
          })
        }
      }

      const repFeedbackBookTable = async (book_tb_feedback_restaurant: string) => {
        setLoading(true)
        const res: IBackendRes<IBookTable> = await sendFeedbackBookTable(bookTable._id, book_tb_feedback_restaurant)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật feedback thành công',
            variant: 'default'
          })
          router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
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
        } else {
          setLoading(false)
          toast({
            title: 'Thất bại',
            description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
            variant: 'destructive'
          })
        }
      }

      return (
        <div className='flex gap-2'>
          {bookTable.book_tb_status === 'WAITING_RESTAURANT' && (
            <Button onClick={() => handleUpdateStatus('confirm')} variant={'outline'}>
              Nhận đơn
            </Button>
          )}
          {bookTable.book_tb_status === 'WAITING_RESTAURANT' && (
            <Button onClick={() => handleUpdateStatus('cancel')} variant={'destructive'}>
              Hủy đơn
            </Button>
          )}
          {bookTable.book_tb_status === 'RESTAURANT_CONFIRM' && (
            <Button onClick={() => handleUpdateStatus('done')}>Hoàn thành</Button>
          )}
          {bookTable.book_tb_status !== 'DONE' &&
            bookTable.book_tb_status !== 'EXEPTION' &&
            bookTable.book_tb_star === null && (
              <>
                <Button onClick={() => setOpen(true)}>Ngoại lệ</Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ghi chú ngoại lệ</DialogTitle>
                      <DialogDescription>Vui lòng nhập lý do cho trạng thái ngoại lệ</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid gap-2'>
                        <Label htmlFor='note'>Ghi chú</Label>
                        <Input
                          id='note'
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder='Nhập ghi chú...'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          handleExceptionBookTable(note)
                          setOpen(false)
                          setNote('') // Reset note after submission
                        }}
                        disabled={!note.trim()}
                      >
                        Xác nhận
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          {bookTable.book_tb_status === 'DONE' && bookTable.book_tb_star !== null && (
            <>
              <Button variant={'outline'} onClick={() => setOpenFeedback(true)}>
                Trả lời
              </Button>
              <Dialog open={openFeedBack} onOpenChange={setOpenFeedback}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Trả lời</DialogTitle>
                    <DialogDescription>Vui lòng nhập phản hồi</DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='feedback'>Phàn hồi</Label>
                      <Input
                        id='feedback'
                        value={book_tb_feedback_restaurant}
                        onChange={(e) => setBookTbFeedbackRestaurant(e.target.value)}
                        placeholder='Nhập phản hồi...'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        repFeedbackBookTable(book_tb_feedback_restaurant)
                        setOpenFeedback(false)
                        setBookTbFeedbackRestaurant('')
                      }}
                      disabled={!book_tb_feedback_restaurant.trim()}
                    >
                      Xác nhận
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      )
    },
    header: () => <div>Hành động</div>,
    enableHiding: true
  }
]
