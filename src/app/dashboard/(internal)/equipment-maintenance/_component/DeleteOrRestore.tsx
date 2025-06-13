'use client'

import React from 'react'
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
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { toast } from '@/hooks/use-toast'
import { useLoading } from '@/context/LoadingContext'
import { IEquipmentMaintenance } from '../equipment-maintenance.interface'
import { deleteEquipmentMaintenance, restoreEquipmentMaintenance } from '../equipment-maintenance.api'
import { usePermission } from '@/app/auth/PermissionContext'


interface Props {
  inforEquipmentMaintenance: IEquipmentMaintenance
  path: 'recycle' | 'delete'
}
export default function DeleteOrRestore({ inforEquipmentMaintenance, path }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const { hasPermission } = usePermission()
  const handleDeleteEquipmentMaintenance = async (eqp_mtn_id: string) => {
    setLoading(true)
    const res = path === 'recycle' ? await restoreEquipmentMaintenance({ eqp_mtn_id }) : await deleteEquipmentMaintenance({ eqp_mtn_id })
    if (res.statusCode === 201) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: path === 'recycle' ? 'Khôi phục lịch bảo trì thiết bị thành công' : 'Chuyển lịch bảo trì thiết bị vào thùng rác thành công',
        variant: 'default'
      })
      router.refresh()
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
          <Button disabled={!hasPermission('equipment_maintenance_restore')}>Khôi phục</Button>
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
          <AlertDialogTitle>{path === 'delete' ? 'Xóa lịch bảo trì thiết bị' : 'Khôi phục lịch bảo trì thiết bị'} </AlertDialogTitle>
          <AlertDialogDescription>
            {path === 'delete'
              ? `Bạn có chắc muốn chuyển lịch bảo trì thiết bị '${inforEquipmentMaintenance.eqp_mtn_name}' vào thùng rác không?`
              : `Bạn có chắc muốn khôi phục lịch bảo trì thiết bị '${inforEquipmentMaintenance.eqp_mtn_name}' không?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Không</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteEquipmentMaintenance(inforEquipmentMaintenance.eqp_mtn_id ? inforEquipmentMaintenance.eqp_mtn_id : '')}>Có</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
