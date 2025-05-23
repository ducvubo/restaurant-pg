// 'use client'
// import { ColumnDef } from '@tanstack/react-table'
// import { DataTableColumnHeader } from '@/components/ColumnHeader'
// import { toast } from '@/hooks/use-toast'
// import { useRouter } from 'next/navigation'
// import { deleteCookiesAndRedirect } from '@/app/actions/action'
// import { useLoading } from '@/context/LoadingContext'
// import { format } from 'date-fns'
// import { vi } from 'date-fns/locale'
// import { Button } from '@/components/ui/button'
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
// import { Badge } from '@/components/ui/badge'
// import { RootState } from '@/app/redux/store'
// import { useSelector } from 'react-redux'
// import { approveLeaveApplication, cancelLeaveApplication, deleteLeaveApplicationWithEmployee, rejectLeaveApplication, sendLeaveApplication } from '../leave-application.api'
// import { ILeaveApplication } from '../leave-application.interface'
// import { findOneEmployee } from '../../employees/employees.api'
// import EmployeeNameCell from './EmployeeNameCell'

// const getTextStatus = (status: string) => {
//   switch (status) {
//     case 'DRAFT':
//       return { text: 'Nháp', variant: 'secondary' }
//     case 'PENDING':
//       return { text: 'Chờ duyệt', variant: 'warning' }
//     case 'APPROVED':
//       return { text: 'Đã duyệt', variant: 'success' }
//     case 'REJECTED':
//       return { text: 'Đã từ chối', variant: 'destructive' }
//     case 'CANCELED':
//       return { text: 'Đã hủy', variant: 'default' }
//     default:
//       return { text: '', variant: 'default' }
//   }
// }

// export const columns: ColumnDef<ILeaveApplication>[] = [
//   {
//     accessorKey: 'employeeId',
//     id: 'Nhân viên',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Nhân viên' />,
//     cell: ({ row }) => {
//       const employeeId = row.original.employeeId
//       return <EmployeeNameCell employeeId={employeeId} />
//     },
//     enableHiding: true
//   },
//   {
//     accessorKey: 'leaveType',
//     id: 'Loại đơn',
//     header: ({ column }) => <DataTableColumnHeader column={column} title='Loại đơn' />,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'reason',
//     id: 'Lý do',
//     header: () => <div>Lý do</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'startDate',
//     id: 'Ngày bắt đầu',
//     cell: ({ row }) => {
//       const leaveApplication: ILeaveApplication = row.original
//       return (
//         <div>
//           {leaveApplication.startDate
//             ? format(new Date(leaveApplication.startDate), 'dd/MM/yyyy', {
//               locale: vi
//             })
//             : ''}
//         </div>
//       )
//     },
//     header: () => <div>Ngày bắt đầu</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'endDate',
//     id: 'Ngày kết thúc',
//     cell: ({ row }) => {
//       const leaveApplication: ILeaveApplication = row.original
//       return (
//         <div>
//           {leaveApplication.endDate
//             ? format(new Date(leaveApplication.endDate), 'dd/MM/yyyy', {
//               locale: vi
//             })
//             : ''}
//         </div>
//       )
//     },
//     header: () => <div>Ngày kết thúc</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'approvalComment',
//     id: 'Ghi chú nhà hàng',
//     header: () => <div>Ghi chú nhà hàng</div>,
//     enableHiding: true
//   },
//   {
//     accessorKey: 'status',
//     id: 'Trạng thái',
//     header: () => <div>Trạng thái</div>,
//     cell: ({ row }) => {
//       const leaveApplication: ILeaveApplication = row.original
//       const status = getTextStatus(leaveApplication.status)
//       return <Badge variant={status.variant as any}>{status.text}</Badge>
//     },
//     enableHiding: true
//   },
//   {
//     accessorKey: 'Actions',
//     id: 'Hành động',
//     cell: ({ row }) => {
//       const { setLoading } = useLoading()
//       const leaveApplication: ILeaveApplication = row.original
//       const router = useRouter()
//       const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
//       const inforEmployee = useSelector((state: RootState) => state.inforEmployee)

//       const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
//       const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
//       const [approvalComment, setApprovalComment] = useState('')

//       const handleSendLeaveApplication = async () => {
//         const res: IBackendRes<ILeaveApplication> = await sendLeaveApplication(leaveApplication.leaveAppId)
//         setLoading(true)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật trạng thái thành công',
//             variant: 'default'
//           })
//           router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
//             description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

//       const handleApproveLeaveApplication = async () => {
//         const res: IBackendRes<ILeaveApplication> = await approveLeaveApplication({
//           leaveAppId: leaveApplication.leaveAppId,
//           approvalComment: approvalComment || 'Đã duyệt đơn'
//         })
//         setLoading(true)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật trạng thái thành công',
//             variant: 'default'
//           })
//           setIsApproveDialogOpen(false)
//           setApprovalComment('')
//           router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
//             description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

//       const handleRejectLeaveApplication = async () => {
//         const res: IBackendRes<ILeaveApplication> = await rejectLeaveApplication({
//           leaveAppId: leaveApplication.leaveAppId,
//           approvalComment: approvalComment || 'Đã từ chối đơn'
//         })
//         setLoading(true)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật trạng thái thành công',
//             variant: 'default'
//           })
//           setIsRejectDialogOpen(false)
//           setApprovalComment('')
//           router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
//             description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

//       const handleCancelLeaveApplication = async () => {
//         const res: IBackendRes<ILeaveApplication> = await cancelLeaveApplication(leaveApplication.leaveAppId)
//         setLoading(true)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Cập nhật trạng thái thành công',
//             variant: 'default'
//           })
//           router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
//             description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

//       const handleDeleteLeaveApplication = async () => {
//         const res: IBackendRes<ILeaveApplication> = await deleteLeaveApplicationWithEmployee(leaveApplication.leaveAppId)
//         setLoading(true)
//         if (res.statusCode === 200) {
//           setLoading(false)
//           toast({
//             title: 'Thành công',
//             description: 'Xóa đơn xin nghỉ thành công',
//             variant: 'default'
//           })
//           router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
//             description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

//       return (
//         <>
//           {inforEmployee._id && (
//             <div className="flex gap-2">
//               {leaveApplication.status === 'DRAFT' && (
//                 <>
//                   <Button onClick={() => router.push(`/dashboard/leave-application/${leaveApplication.leaveAppId}`)}>
//                     Chỉnh sửa
//                   </Button>
//                   <Button onClick={handleSendLeaveApplication}>Gửi đơn</Button>
//                 </>
//               )}
//               {leaveApplication.status === 'PENDING' && (
//                 <Button onClick={handleCancelLeaveApplication}>Hủy đơn</Button>
//               )}
//               {
//                 leaveApplication.status === 'DRAFT' || leaveApplication.status === 'CANCELED' ? (
//                   <Button onClick={handleDeleteLeaveApplication}>
//                     Xóa
//                   </Button>
//                 ) : null
//               }
//             </div>
//           )}
//           {inforRestaurant._id && (
//             <div className="flex gap-2">
//               {leaveApplication.status === 'PENDING' && (
//                 <>
//                   <Button onClick={() => setIsApproveDialogOpen(true)}>Duyệt đơn</Button>
//                   <Button onClick={() => setIsRejectDialogOpen(true)}>Từ chối đơn</Button>
//                 </>
//               )}
//             </div>
//           )}

//           <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Duyệt đơn xin nghỉ</DialogTitle>
//                 <DialogDescription>
//                   Vui lòng nhập ghi chú cho việc duyệt đơn (không bắt buộc).
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="comment" className="text-right">
//                     Ghi chú
//                   </Label>
//                   <Input
//                     id="comment"
//                     value={approvalComment}
//                     onChange={(e) => setApprovalComment(e.target.value)}
//                     className="col-span-3"
//                     placeholder="Nhập ghi chú (không bắt buộc)"
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
//                   Hủy
//                 </Button>
//                 <Button onClick={handleApproveLeaveApplication}>Xác nhận duyệt</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Từ chối đơn xin nghỉ</DialogTitle>
//                 <DialogDescription>
//                   Vui lòng nhập lý do từ chối đơn (không bắt buộc).
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="comment" className="text-right">
//                     Lý do
//                   </Label>
//                   <Input
//                     id="comment"
//                     value={approvalComment}
//                     onChange={(e) => setApprovalComment(e.target.value)}
//                     className="col-span-3"
//                     placeholder="Nhập lý do (không bắt buộc)"
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
//                   Hủy
//                 </Button>
//                 <Button onClick={handleRejectLeaveApplication}>Xác nhận từ chối</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </>
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
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import { RootState } from '@/app/redux/store'
import { useSelector } from 'react-redux'
import { approveLeaveApplication, cancelLeaveApplication, deleteLeaveApplicationWithEmployee, rejectLeaveApplication, sendLeaveApplication } from '../leave-application.api'
import { ILeaveApplication } from '../leave-application.interface'
import { findOneEmployee } from '../../employees/employees.api'
import EmployeeNameCell from './EmployeeNameCell'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Ban, Check, Edit, Send, X } from 'lucide-react'

const getTextStatus = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return { text: 'Nháp', variant: 'secondary' }
    case 'PENDING':
      return { text: 'Chờ duyệt', variant: 'warning' }
    case 'APPROVED':
      return { text: 'Đã duyệt', variant: 'success' }
    case 'REJECTED':
      return { text: 'Đã từ chối', variant: 'destructive' }
    case 'CANCELED':
      return { text: 'Đã hủy', variant: 'default' }
    default:
      return { text: '', variant: 'default' }
  }
}

export const columns: ColumnDef<ILeaveApplication>[] = [
  {
    accessorKey: 'employeeId',
    id: 'Nhân viên',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nhân viên' />,
    cell: ({ row }) => {
      const employeeId = row.original.employeeId
      return <EmployeeNameCell employeeId={employeeId} />
    },
    enableHiding: true
  },
  {
    accessorKey: 'leaveType',
    id: 'Loại đơn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Loại đơn' />,
    enableHiding: true
  },
  {
    accessorKey: 'reason',
    id: 'Lý do',
    header: () => <div>Lý do</div>,
    enableHiding: true
  },
  {
    accessorKey: 'startDate',
    id: 'Ngày bắt đầu',
    cell: ({ row }) => {
      const leaveApplication: ILeaveApplication = row.original
      return (
        <div>
          {leaveApplication.startDate
            ? format(new Date(leaveApplication.startDate), 'dd/MM/yyyy', {
              locale: vi
            })
            : ''}
        </div>
      )
    },
    header: () => <div>Ngày bắt đầu</div>,
    enableHiding: true
  },
  {
    accessorKey: 'endDate',
    id: 'Ngày kết thúc',
    cell: ({ row }) => {
      const leaveApplication: ILeaveApplication = row.original
      return (
        <div>
          {leaveApplication.endDate
            ? format(new Date(leaveApplication.endDate), 'dd/MM/yyyy', {
              locale: vi
            })
            : ''}
        </div>
      )
    },
    header: () => <div>Ngày kết thúc</div>,
    enableHiding: true
  },
  {
    accessorKey: 'approvalComment',
    id: 'Ghi chú nhà hàng',
    header: () => <div>Ghi chú nhà hàng</div>,
    enableHiding: true
  },
  {
    accessorKey: 'status',
    id: 'Trạng thái',
    header: () => <div>Trạng thái</div>,
    cell: ({ row }) => {
      const leaveApplication: ILeaveApplication = row.original
      const status = getTextStatus(leaveApplication.status)
      return <Badge variant={status.variant as any}>{status.text}</Badge>
    },
    enableHiding: true
  },
  {
    accessorKey: 'Actions',
    id: 'Hành động',
    cell: ({ row }) => {
      const { setLoading } = useLoading()
      const leaveApplication: ILeaveApplication = row.original
      const router = useRouter()
      const inforRestaurant = useSelector((state: RootState) => state.inforRestaurant)
      const inforEmployee = useSelector((state: RootState) => state.inforEmployee)

      const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
      const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
      const [approvalComment, setApprovalComment] = useState('')

      const handleSendLeaveApplication = async () => {
        const res: IBackendRes<ILeaveApplication> = await sendLeaveApplication(leaveApplication.leaveAppId)
        setLoading(true)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

      const handleApproveLeaveApplication = async () => {
        const res: IBackendRes<ILeaveApplication> = await approveLeaveApplication({
          leaveAppId: leaveApplication.leaveAppId,
          approvalComment: approvalComment || 'Đã duyệt đơn'
        })
        setLoading(true)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          setIsApproveDialogOpen(false)
          setApprovalComment('')
          router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

      const handleRejectLeaveApplication = async () => {
        const res: IBackendRes<ILeaveApplication> = await rejectLeaveApplication({
          leaveAppId: leaveApplication.leaveAppId,
          approvalComment: approvalComment || 'Đã từ chối đơn'
        })
        setLoading(true)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          setIsRejectDialogOpen(false)
          setApprovalComment('')
          router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

      const handleCancelLeaveApplication = async () => {
        const res: IBackendRes<ILeaveApplication> = await cancelLeaveApplication(leaveApplication.leaveAppId)
        setLoading(true)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

      const handleDeleteLeaveApplication = async () => {
        const res: IBackendRes<ILeaveApplication> = await deleteLeaveApplicationWithEmployee(leaveApplication.leaveAppId)
        setLoading(true)
        if (res.statusCode === 200) {
          setLoading(false)
          toast({
            title: 'Thành công',
            description: 'Xóa đơn xin nghỉ thành công',
            variant: 'default'
          })
          router.push(`/dashboard/leave-application?a=${Math.floor(Math.random() * 100000) + 1}`)
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
            description: 'Đơn xin nghỉ không tồn tại, vui lòng thử lại sau',
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

      return (
        <TooltipProvider>
          <div className="flex gap-2">
            {inforEmployee._id && (
              <>
                {leaveApplication.status === 'DRAFT' && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/dashboard/leave-application/${leaveApplication.leaveAppId}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chỉnh sửa</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleSendLeaveApplication}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gửi đơn</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
                {leaveApplication.status === 'PENDING' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleCancelLeaveApplication}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Hủy đơn</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {(leaveApplication.status === 'DRAFT' || leaveApplication.status === 'CANCELED') && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleDeleteLeaveApplication}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Xóa</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            )}
            {inforRestaurant._id && (
              <>
                {leaveApplication.status === 'PENDING' && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setIsApproveDialogOpen(true)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Duyệt đơn</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setIsRejectDialogOpen(true)}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Từ chối đơn</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </>
            )}
          </div>

          <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Duyệt đơn xin nghỉ</DialogTitle>
                <DialogDescription>
                  Vui lòng nhập ghi chú cho việc duyệt đơn (không bắt buộc).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comment" className="text-right">
                    Ghi chú
                  </Label>
                  <Input
                    id="comment"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="col-span-3"
                    placeholder="Nhập ghi chú (không bắt buộc)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleApproveLeaveApplication}>Xác nhận duyệt</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Từ chối đơn xin nghỉ</DialogTitle>
                <DialogDescription>
                  Vui lòng nhập lý do từ chối đơn (không bắt buộc).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comment" className="text-right">
                    Lý do
                  </Label>
                  <Input
                    id="comment"
                    value={approvalComment}
                    onChange={(e) => setApprovalComment(e.target.value)}
                    className="col-span-3"
                    placeholder="Nhập lý do (không bắt buộc)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleRejectLeaveApplication}>Xác nhận từ chối</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      )
    },
    header: () => <div>Hành động</div>,
    enableHiding: true
  }
]


