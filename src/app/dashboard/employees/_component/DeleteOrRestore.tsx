'use client'

import React, { useEffect } from 'react'
import { IEmployee } from '../employees.interface'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { useRouter } from 'next/navigation'
import { deleteEmployee, restoreEmployee } from '../employees.api'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
interface Props {
  inforEmployee: IEmployee
  path: 'recycle' | 'delete'
}
export default function DeleteOrRestore({ inforEmployee, path }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()

  const handleDeleteEmployee = async (_id: string) => {
    setLoading(true)
    const res = path === 'recycle' ? await restoreEmployee({ _id }) : await deleteEmployee({ _id })
    if (res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description:
          path === 'recycle' ? 'Khôi phục nhân viên thành công' : 'Chuyển nhân viên vào thùng rác thành công',
        variant: 'default'
      })
      router.refresh()
    } else if (res.statusCode === 404) {
      setLoading(false)
      toast({
        title: 'Thông báo',
        description: 'Nhân viên không tồn tại, vui lòng thử lại sau',
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
      setLoading(false)
      toast({
        title: 'Thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {path === 'recycle' ? (
          <Button>Khôi phục</Button>
        ) : (
          <div
            role='menuitem'
            className='relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer'
            data-orientation='vertical'
            data-radix-collection-item=''
          >
            Xóa
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{path === 'delete' ? 'Xóa nhân viên' : 'Khôi phục nhân viên'} </AlertDialogTitle>
          <AlertDialogDescription>
            {path === 'delete'
              ? `Bạn có chắc muốn chuyển nhân viên ${inforEmployee.epl_name} vào thùng rác không?`
              : `Bạn có chắc muốn khôi phục nhân viên ${inforEmployee.epl_name} không?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteEmployee(inforEmployee._id)}>Có</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}