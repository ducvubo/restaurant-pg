// 'use client'
// import { ColumnDef } from '@tanstack/react-table'
// import { DataTableColumnHeader } from '@/components/ColumnHeader'
// import { toast } from '@/hooks/use-toast'
// import { useRouter } from 'next/navigation'
// import { deleteCookiesAndRedirect } from '@/app/actions/action'
// import { useLoading } from '@/context/LoadingContext'
// import { IBookTable } from '../book-table.interface'
// import { format } from 'date-fns'
// import { vi } from 'date-fns/locale'
// import { Button } from '@/components/ui/button'
// import {
//   cancelBookTable,
//   confirmBookTable,
//   doneBookTable,
//   exceptionBookTable,
//   hideFeedbackBookTable,
//   sendFeedbackBookTable
// } from '../book-table.api'
// import { useState } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from '@/components/ui/dialog'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { MoreHorizontal } from 'lucide-react'

// const getTextStatus = (status: string) => {
//   switch (status) {
//     case 'WAITING_GUEST':
//       return 'Chờ khách hàng xác nhận'
//     case 'GUEST_CANCEL':
//       return 'Khách hàng hủy'
//     case 'EXPRIED_CONFIRM_GUEST':
//       return 'Hết hạn xác nhận của khách hàng'
//     case 'WAITING_RESTAURANT':
//       return 'Chờ nhà hàng xác nhận'
//     case 'RESTAURANT_CANCEL':
//       return 'Nhà hàng hủy'
//     case 'RESTAURANT_CONFIRM':
//       return 'Nhà hàng xác nhận'
//     case 'DONE':
//       return 'Hoàn thành'
//     case 'EXEPTION':
//       return 'Ngoại lệ'
//     default:
//       return ''
//   }
// }

// export const columns: ColumnDef<IBookTable>[] = [
//   {
//     accessorKey: 'od_dish_table_id',
//     id: 'Tên khách',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Tên khách' />,
//     cell: ({ row }) => {
//       const bookTable: IBookTable = row.original
//       return <span>{bookTable.book_tb_name}</span>
//     },
//     enableHiding: true
//   },
//   {
//     accessorKey: 'book_tb_date',
//     id: 'Ngày đặt',
//     cell: ({ row }) => {
//       const bookTable: IBookTable = row.original
//       return (
//         <div className='flex flex-col'>
//           <span>
//             {bookTable.book_tb_hour} -{' '}
//             {format(bookTable.book_tb_date, "EEEE, dd/MM/yyyy", { locale: vi })}
//           </span>
//         </div>
//       )
//     },
//     header: () => <div>Ngày đặt</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'book_tb_number_adults',
//     id: 'Số người',
//     cell: ({ row }) => {
//       const bookTable: IBookTable = row.original
//       return (
//         <div className='flex flex-col'>
//           <span>Người lớn: {bookTable.book_tb_number_adults}</span>
//           <span>Trẻ em: {bookTable.book_tb_number_children}</span>
//         </div>
//       )
//     },
//     header: () => <div>Số người</div>,
//     enableHiding: true
//   },

//   {
//     accessorKey: 'book_tb_note',
//     id: 'Ghi chú của khách',
//     header: () => <div>Ghi chú của khách</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'book_tb_star',
//     id: 'Sao',
//     header: () => <div>Sao</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'book_tb_note_res',
//     id: 'Ghi chú của nhà hàng',
//     header: () => <div>Ghi chú của nhà hàng</div>,
//     enableHiding: true
//   },

//   {
//     accessorKey: 'book_tb_feedback',
//     id: 'Feedback của khách hàng',
//     header: () => <div>Feedback của khách hàng</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'book_tb_feedback_restaurant',
//     id: 'Phản hồi của nhà hàng',
//     header: () => <div>Phản hồi của nhà hàng</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'od_dish_status',
//     id: 'Trạng thái',
//     cell: ({ row }) => {
//       const bookTable: IBookTable = row.original
//       return <div>{getTextStatus(bookTable.book_tb_status)}</div>
//     },
//     header: () => <div>Trạng thái</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'Thao tác',
//     id: 'Hành động',
//     cell: ({ row }) => {
//       const { setLoading } = useLoading()
//       const bookTable: IBookTable = row.original
//       const router = useRouter()
//       const [open, setOpen] = useState(false)
//       const [openFeedBack, setOpenFeedback] = useState(false)
//       const [note, setNote] = useState('')
//       const [book_tb_feedback_restaurant, setBookTbFeedbackRestaurant] = useState<string>('')

//       const handleUpdateStatus = async (status: 'cancel' | 'confirm' | 'done') => {
//         setLoading(true)
//         let res: IBackendRes<IBookTable> = { statusCode: 400, message: 'Đã có lỗi xảy ra, vui lòng thử lại sau' }
//         if (status === 'cancel') res = await cancelBookTable(bookTable._id)
//         if (status === 'confirm') res = await confirmBookTable(bookTable._id)
//         if (status === 'done') res = await doneBookTable(bookTable._id)
//         console.log("🚀 ~ handleUpdateStatus ~ res:", res)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật trạng thái thành công',
//             variant: 'default'
//           })
//           router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
//           router.refresh()
//         } else if (res.statusCode === 400) {
//           setLoading(false)
//           if (Array.isArray(res.message)) {
//             res.message.map((item: string) => {
//               toast({
//                 title: 'Thất bại',
//                 description: item,
//                 variant: 'destructive'
//               })
//             })
//           } else {
//             toast({
//               title: 'Thất bại',
//               description: res.message,
//               variant: 'destructive'
//             })
//           }
//         } else if (res.statusCode === 404) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         } else if (res.code === -10) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
//             variant: 'destructive'
//           })
//           await deleteCookiesAndRedirect()
//         } else if (res.code === -11) {
//           toast({
//             title: 'Thông báo',
//             description:
//               'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
//             variant: 'destructive'
//           })
//         } else {
//           toast({
//             title: 'Thất bại',
//             description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         }
//       }

//       const handleExceptionBookTable = async (book_tb_note_res: string) => {
//         setLoading(true)
//         const res: IBackendRes<IBookTable> = await exceptionBookTable(bookTable._id, book_tb_note_res)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật trạng thái thành công',
//             variant: 'default'
//           })
//           router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
//           router.refresh()
//         } else if (res.statusCode === 400) {
//           setLoading(false)
//           if (Array.isArray(res.message)) {
//             res.message.map((item: string) => {
//               toast({
//                 title: 'Thất bại',
//                 description: item,
//                 variant: 'destructive'
//               })
//             })
//           } else {
//             toast({
//               title: 'Thất bại',
//               description: res.message,
//               variant: 'destructive'
//             })
//           }
//         } else if (res.statusCode === 404) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         } else if (res.code === -10) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
//             variant: 'destructive'
//           })
//           await deleteCookiesAndRedirect()
//         } else if (res.code === -11) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description:
//               'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
//             variant: 'destructive'
//           })
//         } else {
//           setLoading(false)
//           toast({
//             title: 'Thất bại',
//             description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         }
//       }

//       const repFeedbackBookTable = async (book_tb_feedback_restaurant: string) => {
//         setLoading(true)
//         const res: IBackendRes<IBookTable> = await sendFeedbackBookTable(bookTable._id, book_tb_feedback_restaurant)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật feedback thành công',
//             variant: 'default'
//           })
//           router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
//           router.refresh()
//         } else if (res.statusCode === 400) {
//           setLoading(false)
//           if (Array.isArray(res.message)) {
//             res.message.map((item: string) => {
//               toast({
//                 title: 'Thất bại',
//                 description: item,
//                 variant: 'destructive'
//               })
//             })
//           } else {
//             toast({
//               title: 'Thất bại',
//               description: res.message,
//               variant: 'destructive'
//             })
//           }
//         } else if (res.statusCode === 404) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         } else if (res.code === -10) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
//             variant: 'destructive'
//           })
//           await deleteCookiesAndRedirect()
//         } else {
//           setLoading(false)
//           toast({
//             title: 'Thất bại',
//             description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         }
//       }

//       const handleHideFeedbackBookTable = async (book_tb_hide_feedback: boolean) => {
//         setLoading(true)
//         const res: IBackendRes<IBookTable> = await hideFeedbackBookTable(bookTable._id, book_tb_hide_feedback)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật trạng thái thành công',
//             variant: 'default'
//           })
//           router.push(`/dashboard/book-table?a=${Math.floor(Math.random() * 100000) + 1}`)
//           router.refresh()
//         } else if (res.statusCode === 400) {
//           setLoading(false)
//           if (Array.isArray(res.message)) {
//             res.message.map((item: string) => {
//               toast({
//                 title: 'Thất bại',
//                 description: item,
//                 variant: 'destructive'
//               })
//             })
//           } else {
//             toast({
//               title: 'Thất bại',
//               description: res.message,
//               variant: 'destructive'
//             })
//           }
//         } else if (res.statusCode === 404) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Đơn đặt không tồn tại, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         } else if (res.code === -10) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description: 'Phiên đăng nhập đã hêt hạn, vui lòng đăng nhập lại',
//             variant: 'destructive'
//           })
//           await deleteCookiesAndRedirect()
//         } else if (res.code === -11) {
//           setLoading(false)
//           toast({
//             title: 'Thông báo',
//             description:
//               'Bạn không có quyền thực hiện thao tác này, vui lòng liên hệ quản trị viên để biết thêm chi tiết',
//             variant: 'destructive'
//           })
//         } else {
//           setLoading(false)
//           toast({
//             title: 'Thất bại',
//             description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
//             variant: 'destructive'
//           })
//         }
//       }

//       return (
//         <div className='flex gap-2'>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='ghost' className='h-8 w-8 p-0'>
//                 <span className='sr-only'>Open menu</span>
//                 <MoreHorizontal className='h-4 w-4' />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align='end'>
//               <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

//               <DropdownMenuSeparator />
//               {/* <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem> */}
//               {bookTable.book_tb_status === 'WAITING_RESTAURANT' && (
//                 <DropdownMenuItem onClick={() => handleUpdateStatus('confirm')}>
//                   Nhận đơn
//                 </DropdownMenuItem>
//               )}
//               {bookTable.book_tb_status === 'WAITING_RESTAURANT' && (
//                 <DropdownMenuItem onClick={() => handleUpdateStatus('cancel')}>
//                   Hủy đơn
//                 </DropdownMenuItem>
//               )}
//               {bookTable.book_tb_status === 'RESTAURANT_CONFIRM' && (
//                 <DropdownMenuItem onClick={() => handleUpdateStatus('done')}>Hoàn thành</DropdownMenuItem>
//               )}
//               {bookTable.book_tb_status !== 'DONE' &&
//                 bookTable.book_tb_status !== 'EXEPTION' &&
//                 bookTable.book_tb_star === null && (
//                   <>
//                     <DropdownMenuItem onClick={() => setOpen(true)}>Ngoại lệ</DropdownMenuItem>
//                     <Dialog open={open} onOpenChange={setOpen}>
//                       <DialogContent>
//                         <DialogHeader>
//                           <DialogTitle>Ghi chú ngoại lệ</DialogTitle>
//                           <DialogDescription>Vui lòng nhập lý do cho trạng thái ngoại lệ</DialogDescription>
//                         </DialogHeader>
//                         <div className='grid gap-4 py-4'>
//                           <div className='grid gap-2'>
//                             <Label htmlFor='note'>Ghi chú</Label>
//                             <Input
//                               id='note'
//                               value={note}
//                               onChange={(e) => setNote(e.target.value)}
//                               placeholder='Nhập ghi chú...'
//                             />
//                           </div>
//                         </div>
//                         <DialogFooter>
//                           <DropdownMenuItem
//                             onClick={() => {
//                               handleExceptionBookTable(note)
//                               setOpen(false)
//                               setNote('') // Reset note after submission
//                             }}
//                             disabled={!note.trim()}
//                           >
//                             Xác nhận
//                           </DropdownMenuItem>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </>
//                 )}
//               {bookTable.book_tb_status === 'DONE' &&
//                 bookTable.book_tb_star !== null &&
//                 bookTable.book_tb_feedback_restaurant === '' && (
//                   <>
//                     <DropdownMenuItem onClick={() => setOpenFeedback(true)}>
//                       Trả lời
//                     </DropdownMenuItem>
//                     <Dialog open={openFeedBack} onOpenChange={setOpenFeedback}>
//                       <DialogContent>
//                         <DialogHeader>
//                           <DialogTitle>Trả lời</DialogTitle>
//                           <DialogDescription>Vui lòng nhập phản hồi</DialogDescription>
//                         </DialogHeader>
//                         <div className='grid gap-4 py-4'>
//                           <div className='grid gap-2'>
//                             <Label htmlFor='feedback'>Phàn hồi</Label>
//                             <Input
//                               id='feedback'
//                               value={book_tb_feedback_restaurant}
//                               onChange={(e) => setBookTbFeedbackRestaurant(e.target.value)}
//                               placeholder='Nhập phản hồi...'
//                             />
//                           </div>
//                         </div>
//                         <DialogFooter>
//                           <DropdownMenuItem
//                             onClick={() => {
//                               repFeedbackBookTable(book_tb_feedback_restaurant)
//                               setOpenFeedback(false)
//                               setBookTbFeedbackRestaurant('')
//                             }}
//                             disabled={!book_tb_feedback_restaurant.trim()}
//                           >
//                             Xác nhận
//                           </DropdownMenuItem>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </>
//                 )}

//               {bookTable.book_tb_feedback_restaurant !== '' && (
//                 <DropdownMenuItem
//                   onClick={() => handleHideFeedbackBookTable(!bookTable.book_tb_hide_feedback)}
//                 >
//                   {bookTable.book_tb_hide_feedback ? 'Hiện phản hồi' : 'Ẩn phản hồi'}
//                 </DropdownMenuItem>
//               )}

//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       )
//     },
//     header: () => <div>Hành động</div>,
//     enableHiding: true
//   }
// ]


'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { useLoading } from '@/context/LoadingContext'
import { IBookTable } from '../book-table.interface'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  cancelBookTable,
  confirmBookTable,
  doneBookTable,
  exceptionBookTable,
  hideFeedbackBookTable,
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
import { Check, X, Star, Eye, EyeOff, AlertTriangle, MessageCircle } from 'lucide-react'

const getTextStatus = (status: string) => {
  switch (status) {
    case 'WAITING_GUEST':
      return { text: 'Chờ khách hàng xác nhận', variant: 'default' }
    case 'GUEST_CANCEL':
      return { text: 'Khách hàng hủy', variant: 'destructive' }
    case 'EXPRIED_CONFIRM_GUEST':
      return { text: 'Hết hạn xác nhận', variant: 'secondary' }
    case 'WAITING_RESTAURANT':
      return { text: 'Chờ nhà hàng xác nhận', variant: 'default' }
    case 'RESTAURANT_CANCEL':
      return { text: 'Nhà hàng hủy', variant: 'destructive' }
    case 'RESTAURANT_CONFIRM':
      return { text: 'Nhà hàng xác nhận', variant: 'success' }
    case 'DONE':
      return { text: 'Hoàn thành', variant: 'success' }
    case 'EXEPTION':
      return { text: 'Ngoại lệ', variant: 'warning' }
    default:
      return { text: '', variant: 'default' }
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
            {format(bookTable.book_tb_date, "EEEE, dd/MM/yyyy", { locale: vi })}
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
      const status = getTextStatus(bookTable.book_tb_status)
      return <Badge variant={status.variant as any}>{status.text}</Badge>
    },
    header: () => <div>Trạng thái</div>,
    enableHiding: true
  },
  {
    accessorKey: 'Thao tác',
    id: 'Hành động',
    cell: ({ row }) => {
      const { setLoading } = useLoading()
      const bookTable: IBookTable = row.original
      const router = useRouter()
      const [open, setOpen] = useState(false)
      const [openFeedback, setOpenFeedback] = useState(false)
      const [note, setNote] = useState('')
      const [book_tb_feedback_restaurant, setBookTbFeedbackRestaurant] = useState<string>('')

      const handleUpdateStatus = async (status: 'cancel' | 'confirm' | 'done') => {
        setLoading(true)
        let res: IBackendRes<IBookTable> = { statusCode: 400, message: 'Đã có lỗi xảy ra, vui lòng thử lại sau' }
        if (status === 'cancel') res = await cancelBookTable(bookTable._id)
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

      const handleHideFeedbackBookTable = async (book_tb_hide_feedback: boolean) => {
        setLoading(true)
        const res: IBackendRes<IBookTable> = await hideFeedbackBookTable(bookTable._id, book_tb_hide_feedback)
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

      return (
        <div className='flex gap-2'>
          {bookTable.book_tb_status === 'WAITING_RESTAURANT' && (
            <>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleUpdateStatus('confirm')}
                title='Nhận đơn'
              >
                <Check className='h-4 w-4 text-green-600' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleUpdateStatus('cancel')}
                title='Hủy đơn'
              >
                <X className='h-4 w-4 text-red-600' />
              </Button>
            </>
          )}
          {bookTable.book_tb_status === 'RESTAURANT_CONFIRM' && (
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleUpdateStatus('done')}
              title='Hoàn thành'
            >
              <Check className='h-4 w-4 text-green-600' />
            </Button>
          )}
          {bookTable.book_tb_status !== 'DONE' &&
            bookTable.book_tb_status !== 'EXEPTION' &&
            bookTable.book_tb_star === null && (
              <>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => setOpen(true)}
                  title='Ngoại lệ'
                >
                  <AlertTriangle className='h-4 w-4 text-yellow-600' />
                </Button>
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
                          setNote('')
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
          {bookTable.book_tb_status === 'DONE' &&
            bookTable.book_tb_star !== null &&
            bookTable.book_tb_feedback_restaurant === '' && (
              <>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => setOpenFeedback(true)}
                  title='Trả lời'
                >
                  <MessageCircle className='h-4 w-4 text-blue-600' />
                </Button>
                <Dialog open={openFeedback} onOpenChange={setOpenFeedback}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Trả lời</DialogTitle>
                      <DialogDescription>Vui lòng nhập phản hồi</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid gap-2'>
                        <Label htmlFor='feedback'>Phản hồi</Label>
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
          {bookTable.book_tb_feedback_restaurant !== '' && (
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleHideFeedbackBookTable(!bookTable.book_tb_hide_feedback)}
              title={bookTable.book_tb_hide_feedback ? 'Hiện phản hồi' : 'Ẩn phản hồi'}
            >
              {bookTable.book_tb_hide_feedback ? (
                <Eye className='h-4 w-4 text-gray-600' />
              ) : (
                <EyeOff className='h-4 w-4 text-gray-600' />
              )}
            </Button>
          )}
        </div>
      )
    },
    header: () => <div>Hành động</div>,
    enableHiding: true
  }
]