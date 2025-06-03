'use client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/ColumnHeader'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { ITable } from '../table.interface'
import DeleteOrRestore from './DeleteOrRestore'
import { updateQrCode, updateStatus } from '../table.api'
import { QRCodeSVG } from 'qrcode.react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import jsPDF from 'jspdf'
import { RobotoMediumnormal } from '@/app/fonts/RobotoMediumnormal'
export const columns: ColumnDef<ITable>[] = [
  {
    accessorKey: 'tbl_name',
    id: 'Tên bàn',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên bàn' />,
    enableHiding: true
  },
  {
    accessorKey: 'tbl_capacity',
    id: 'Số người',
    header: () => <div>Số người</div>,
    enableHiding: true
  },
  {
    accessorKey: 'tbl_description',
    id: 'Mô tả',
    header: () => <div>Mô tả</div>,
    enableHiding: true
  },
  {
    accessorKey: 'tbl_token',
    id: 'Mã QR',
    header: () => <div>Mã QR</div>,
    cell: ({ row }) => {
      const router = useRouter()
      const table = row.original
      const url = `${process.env.NEXT_PUBLIC_URL_CLIENT}/guest/table/${table.tbl_restaurant_id}?token=${table.tbl_token}`
      const handleUpdateToken = async () => {
        const res = await updateQrCode({
          _id: table._id
        })
        if (res.statusCode === 200) {
          toast({
            title: 'Thành công',
            description: 'Đổi mã QR thành công',
            variant: 'default'
          })
          router.refresh()
        } else if (res.statusCode === 400) {
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
        } else if (res.code === -10) {
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

      const handleDownloadPDF = () => {
        const qrCodeElement = document.getElementById(`qr-code-${table._id}`);
        const svgElement = qrCodeElement?.querySelector('svg');

        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const img = new Image();
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);

          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);

            const imgData = canvas.toDataURL('image/png');
            console.log('imgData', imgData);

            const doc = new jsPDF();

            // Thêm font
            doc.addFileToVFS("Roboto-Medium.ttf", RobotoMediumnormal);
            doc.addFont("Roboto-Medium.ttf", "Roboto-Medium", "normal");
            doc.setFont("Roboto-Medium", "normal");
            doc.setFontSize(25);
            doc.addImage('/images/logo.png', 'PNG', 30, 10, 50, 25);
            doc.text(`Quét QR để gọi món`, 90, 25);
            doc.setFontSize(15);
            doc.text(`Tên bàn: ${table.tbl_name}`, 85, 37);
            doc.addImage(imgData, 'PNG', 55, 40, 100, 100);
            doc.setFontSize(12);
            doc.text("Địa chỉ: Số nhà 16, Thị Trấn Đồi Ngô, Lục Nam, Bắc Giang", 40, 157);
            doc.text("SĐT: 0392344455", 40, 164);
            doc.text("Email: vminhduc8@gmail.com", 40, 171);
            doc.setFontSize(14);
            doc.text("Chúc quý khách ngon miệng", 40, 178);
            doc.setFontSize(10);
            doc.text("Nếu Quý khách gặp bất kỳ vấn đề nào hoặc cảm thấy chưa hài lòng,", 40, 185);
            doc.text("xin đừng ngần ngại liên hệ với chúng tôi để được hỗ trợ kịp thời và chu đáo.", 40, 193);
            doc.save(`qr-code-${table.tbl_name}.pdf`);
          };
        } else {
          alert("Không tìm thấy SVG QR code!");
        }
      };

      return (
        <div className='w-40' id={`qr-code-${table._id}`}>
          <Link target='_blank' href={`/guest/table/${table.tbl_restaurant_id}?token=${table.tbl_token}`}>
            <QRCodeSVG value={url} />
          </Link>
          <div className='flex gap-2 mt-2'>
            <Button onClick={handleUpdateToken}>Đổi mã QR</Button>
            <Button onClick={handleDownloadPDF}>Tải xuống</Button>
          </div>
        </div>
      )
    },
    enableHiding: true
  },
  {
    accessorKey: 'tbl_status',
    id: 'Trạng thái',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Trạng thái' />,
    enableHiding: true,
    cell: ({ row }) => {
      const router = useRouter()
      const table = row.original
      const handleUpdateStatus = async (table_status: 'enable' | 'disable' | 'serving') => {
        const res = await updateStatus({
          _id: table._id,
          tbl_status: table_status
        })
        if (res.statusCode === 200) {
          toast({
            title: 'Thành công',
            description: 'Cập nhật trạng thái thành công',
            variant: 'default'
          })
          router.refresh()
        } else if (res.statusCode === 400) {
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
        } else if (res.code === -10) {
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

      if (table.tbl_status === 'reserve') {
        return <Button disabled>Đang phục vụ</Button>
      }

      return (
        <Select
          value={table.tbl_status}
          onValueChange={(value: 'enable' | 'disable' | 'serving') => handleUpdateStatus(value)}
        >
          <SelectTrigger className='w-[153px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn trạng thái</SelectLabel>
              <SelectItem value='enable'>Có sẵn</SelectItem>
              <SelectItem value='disable'>Không có sẵn</SelectItem>
              <SelectItem value='serving'>Đã đặt trước</SelectItem>
              {/* <SelectItem value='reserve'>Đang phục vụ</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
      )
    }
  },

  {
    accessorKey: 'Actions',
    id: 'Actions',
    cell: ({ row }) => {
      const table = row.original
      const pathname = usePathname().split('/').pop()
      if (pathname === 'recycle') {
        return <DeleteOrRestore inforTable={table} path={pathname} />
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <Link href={`/dashboard/tables/${table._id}`} className='cursor-pointer'>
              <DropdownMenuItem className='cursor-pointer'>Sửa</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <DeleteOrRestore inforTable={table} path='delete' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableHiding: true
  }
]
