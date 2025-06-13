'use client'
import React, { useEffect, useState } from 'react'
import { IStockIn, IStockInItem } from '../stock-in.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ISupplier } from '../../suppliers/supplier.interface'
import { IEmployee } from '../../../(employee)/employees/employees.interface'
import { IIngredient } from '../../ingredients/ingredient.interface'
import { findSupplierName, findEmployeeName, findIngredientName } from '../stock-in.api'
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

interface ViewStockInProps {
  inforStockIn: IStockIn
}

export default function ViewStockIn({ inforStockIn }: ViewStockInProps) {
  const { hasPermission } = usePermission()
  const router = useRouter()
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<ISupplier[]>([])
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [ingredients, setIngredients] = useState<IIngredient[]>([])
  const [image, setImage] = useState<{ image_cloud: string; image_custom: string } | null>(null)
  const [stockInItems, setStockInItems] = useState<IStockInItem[]>([])

  const handleEdit = () => {
    router.push(`/dashboard/stock-in/edit?id=${inforStockIn.stki_id}`)
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

  const calculateTotal = (items: IStockInItem[]) => {
    return items.reduce((total, item) => {
      return total + item.stki_item_quantity_real * item.stki_item_price
    }, 0)
  }

  useEffect(() => {
    fetchSuppliers()
    fetchEmployees()
    fetchIngredients()
    if (inforStockIn.stki_image) {
      try {
        const parsedImage = JSON.parse(inforStockIn.stki_image)
        if (parsedImage && parsedImage.image_cloud && parsedImage.image_custom) {
          setImage(parsedImage)
        }
      } catch (error) {
        console.error('Error parsing stki_image:', error)
      }
    }
    if (inforStockIn.items) {
      const updatedItems = inforStockIn.items.map(item => {
        const ingredient = ingredients.find(ing => ing.igd_id === item.igd_id)
        return {
          ...item,
          igd_name: ingredient?.igd_name || item.igd_name || 'Không xác định',
          unt_name: ingredient && typeof ingredient.unt_id !== 'string' ? ingredient.unt_id?.unt_name || 'Không xác định' : item.unt_name || 'Không xác định'
        }
      })
      setStockInItems(updatedItems)
    }
  }, [inforStockIn, ingredients])

  // Get supplier, receiver, and payment method display values
  const supplierName = suppliers.find(spl => spl.spli_id === inforStockIn.spli_id)?.spli_name || 'Không xác định'
  const receiverName = employees.find(emp => emp._id === inforStockIn.stki_receiver)?.epl_name || 'Không xác định'
  const paymentMethodDisplay = inforStockIn.stki_payment_method ? {
    cash: 'Tiền mặt',
    transfer: 'Chuyển khoản',
    credit_card: 'Thẻ tín dụng'
  }[inforStockIn.stki_payment_method] : 'Không xác định'

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('stock_in_update')}>Chỉnh sửa</Button>  
      </div>
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Thông tin phiếu nhập kho</h3>
        <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
          <tbody>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mã phiếu nhập</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforStockIn.stki_code}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nhà cung cấp</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{supplierName}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Người giao hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforStockIn.stki_delivery_name}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Số điện thoại người giao hàng</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforStockIn.stki_delivery_phone}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Người nhận</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{receiverName}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ngày nhập</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {inforStockIn.stki_date
                  ? new Date(inforStockIn.stki_date).toLocaleDateString('vi-VN')
                  : 'Chưa thiết lập'}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {inforStockIn.stki_note || 'Chưa có ghi chú'}
              </td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Phương thức thanh toán</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>{paymentMethodDisplay}</td>
            </tr>
            <tr>
              <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh hóa đơn</td>
              <td className='border border-gray-300 dark:border-gray-700 p-2'>
                {image && image.image_cloud ? (
                  <div className='relative w-28 h-28'>
                    <Image
                      src={image.image_cloud}
                      alt='Stock In Image'
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
          <TableCaption>Danh sách nguyên liệu nhập kho</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tên nguyên liệu</TableHead>
              <TableHead>Đơn vị đo</TableHead>
              <TableHead>Số lượng trên hóa đơn</TableHead>
              <TableHead>Số lượng thực tế</TableHead>
              <TableHead>Giá nhập</TableHead>
              <TableHead>Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockInItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.igd_name}</TableCell>
                <TableCell>{item.unt_name}</TableCell>
                <TableCell>{item.stki_item_quantity}</TableCell>
                <TableCell>{item.stki_item_quantity_real}</TableCell>
                <TableCell>{item.stki_item_price.toLocaleString()} VND</TableCell>
                <TableCell>{(item.stki_item_quantity_real * item.stki_item_price).toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Tổng tiền:</TableCell>
              <TableCell className='font-bold'>{calculateTotal(stockInItems).toLocaleString()} VND</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}