import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import dynamic from 'next/dynamic'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import { IEquipmentMaintenance } from '../equipment-maintenance.interface'
import { findEquipmentMaintenanceById, getAllEquipmentMaintenances } from '../equipment-maintenance.api'
import { PageEquipmentMaintenance } from '../_component/PageEquipmentMaintenance'

const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: false
})

interface PageProps {
  searchParams: { [key: string]: string }
  params: { slug: string }
}

async function Component({ searchParams, params }: PageProps) {
  const id = params.slug
  if (id === 'add') {
    return (
      <ContentLayout title='Thêm sửa chữa thiết bị'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IEquipmentMaintenance>> = await getAllEquipmentMaintenances({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      type: 'recycle',
      EqpMtnName: ''
    })

    if (res.code === -10) {
      return <LogoutPage />
    }
    if (res.code === -11) {
      return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
    }
    if (!res || !res.data) {
      return (
        <>
          <div>Error fetching data</div>
        </>
      )
    }
    if (res.statusCode === 200) {
      const data = (res.data.result ? res.data.result : []).flat()

      return (
        <div>
          <ContentLayout title='Danh sách sửa chữa thiết bị đã xóa'>
            <PageEquipmentMaintenance data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  const res: IBackendRes<IEquipmentMaintenance> = await findEquipmentMaintenanceById({ eqp_mtn_id: id })

  if (res.statusCode === 404) {
    return (
      <ToastServer
        message='Không tìm thấy sửa chữa thiết bị'
        title='Lỗi'
        variant='destructive'
        route='/dashboard/equipment-maintenance?page=1&size=10'
      />
    )
  }

  if (res.code === -10) {
    return <LogoutPage />
  }
  if (res.code === -11) {
    return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
  }
  if (!res || !res.data) {
    return (
      <>
        <div>Error fetching data</div>
      </>
    )
  }
  return (
    <ContentLayout title='Chỉnh sửa thông tin sửa chữa thiết bị'>
      <AddOrEdit id={id} inforInternalProposal={res.data} />
    </ContentLayout>
  )
}

export default function Page(props: PageProps) {
  return (
    <div>
      <Suspense fallback={<LoadingServer />}>
        <Component {...props} />
      </Suspense>
    </div>
  )
}
