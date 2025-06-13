'use client'
import React, { useEffect, useState } from 'react'
import { IStockOut, IStockOutItem } from '../stock-out.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ISupplier } from '../../suppliers/supplier.interface'
import { IEmployee } from '../../../(employee)/employees/employees.interface'
import { IIngredient } from '../../ingredients/ingredient.interface'
import { findSupplierName, findEmployeeName, findIngredientName } from '../stock-out.api'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { usePermission } from '@/app/auth/PermissionContext'

interface ViewStockOutProps {
  inforStockOut: IStockOut
}

export default function ViewStockOut({ inforStockOut }: ViewStockOutProps) {
  const { hasPermission } = usePermission()
  const router = useRouter()
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<ISupplier[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [ingredients, setIngredients] = useState<IIngredient[]>([])
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string } | null>(null)
  const [stockOutItems, setStockOutItems] = useState<IStockOutItem[]>([])

  const handleEdit = () => {
    router.push(`/dashboard/stock-out/edit?id=${inforStockOut.stko_id}`)
  }

  const fetchSuppliers = async () => {
    const res: IBackendRes<ISupplier[]> = await findSupplierName()
    if (res.statusCode === 200 && res.data) {
      setSuppliers(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
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
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra khi lấy danh sách nhà cung cấp, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const fetchEmployees = async () => {
    const res: IBackendRes<IEmployee[]> = await findEmployeeName()
    if (res.statusCode === 200 && res.data) {
      setEmployees(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
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
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra khi lấy danh sách nhân viên, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const fetchIngredients = async () => {
    const res: IBackendRes<IIngredient[]> = await findIngredientName()
    if (res.statusCode === 200 && res.data) {
      setIngredients(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
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
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra khi lấy danh sách nguyên liệu, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const calculateTotal = (items: IStockOutItem[]) => {
    return items.reduce((total, item) => {
      return total + item.stko_item_quantity * item.stko_item_price
    }, 0)
  }

  useEffect(() => {
    fetchSuppliers()
    fetchEmployees()
    fetchIngredients()
    if (inforStockOut.stko_image) {
      try {
        const parsedImage = JSON.parse(inforStockOut.stko_image)
        if (parsedImage && parsedImage.image_cloud && parsedImage.image_custom) {
          setImage(parsedImage)
        }
      } catch (error) {
        console.error('Error parsing stko_image:', error)
      }
    }
    if (inforStockOut.items) {
      const updatedItems = inforStockOut.items.map(item => {
        const ingredient = ingredients.find(ing => ing.igd_id === item.igd_id)
        return {
          ...item,
          igd_name: ingredient?.igd_name || item.igd_name || 'Không xác định',
          unt_name: ingredient && typeof ingredient.unt_id !== 'string' ? ingredient.unt_id?.unt_name || 'Không xác định' : item.unt_name || 'Không xác định'
        }
      })
      setStockOutItems(updatedItems)
    }
  }, [inforStockOut, ingredients])

  // Get supplier, seller, payment method, and type display values
  const supplierName = suppliers.find(spl => spl.spli_id === inforStockOut.spli_id)?.spli_name || 'Không xác định'
  const sellerName = employees.find(emp => emp._id === inforStockOut.stko_seller)?.epl_name || 'Không xác định'
  const paymentMethodDisplay = inforStockOut.stko_payment_method ? {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
    credit_card: 'Thẻ tín dụng'
  }[inforStockOut.stko_payment_method] : 'Không xác định'
  const typeDisplay = inforStockOut.stko_type ? {
    retail: 'Bán lẻ',
    internal: 'Nội bộ'
  }[inforStockOut.stko_type] : 'Không xác định'

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('stock_out_update')}>Chỉnh sửa</Button>
      </div>
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Thông tin phiếu xuất kho</h3>
        <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
          <tbody>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mã phiếu xuất</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforStockOut.stko_code}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nhà cung cấp</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{supplierName}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Người xuất</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{sellerName}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày xuất</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {inforStockOut.stko_date
                  ? new Date(inforStockOut.stko_date).toLocaleDateString('vi-VN')
                  : 'Chưa thiết lập'}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {inforStockOut.stko_note || 'Chưa có ghi chú'}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Phương thức thanh toán</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{paymentMethodDisplay}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Loại hóa đơn</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{typeDisplay}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh hóa đơn</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {image && image.image_cloud ? (
                  <div className='relative w-28 h-28'>
                    <Image
                      src={image.image_cloud}
                      alt='Stock Out Image'
                      fill
                      className='object-cover rounded-md'
                    />
                  </div>
                ) : (
                  'Chưa có ảnh'
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Danh sách nguyên liệu</h3>
        <Table>
          <TableCaption>Danh sách nguyên liệu xuất kho</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tên nguyên liệu</TableHead>
              <TableHead>Đơn vị đo</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Giá xuất</TableHead>
              <TableHead>Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockOutItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.igd_name}</TableCell>
                <TableCell>{item.unt_name}</TableCell>
                <TableCell>{item.stko_item_quantity}</TableCell>
                <TableCell>{item.stko_item_price.toLocaleString()} VND</TableCell>
                <TableCell>{(item.stko_item_quantity * item.stko_item_price).toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Tổng tiền:</TableCell>
              <TableCell className='font-bold'>{calculateTotal(stockOutItems).toLocaleString()} VND</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}