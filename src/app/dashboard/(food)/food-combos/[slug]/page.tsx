import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import AddOrEdit from '../_component/AddOrEdit'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { findFoodComboById, getAllFoodCombos } from '../food-combos.api'
import { PageFoodCombos } from '../_component/PageFoodCombos'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { IFoodComboRes } from '../food-combos.interface'
import ErrorPage from '@/components/ErrorPage'
import ViewFoodCombo from '../_component/ViewFoodCombo'

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
      <ContentLayout title='Thêm món ăn'>
        <AddOrEdit id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IFoodComboRes>> = await getAllFoodCombos({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      fcb_name: searchParams.search ? searchParams.search : '',
      type: 'recycle'
    })

    if (res.code === -10) {
      return <LogoutPage />
    }
    if (res.code === -11) {
      return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
    }
    if (!res || !res.data) {
      return (
        <ErrorPage />
      )
    }
    if (res.statusCode === 200) {
      const data = res.data.result.flat()

      return (
        <div>
          <ContentLayout title='Danh sách combo đã xóa'>
            <PageFoodCombos data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  if (id === 'edit') {
    const res: IBackendRes<IFoodComboRes> = await findFoodComboById(searchParams.id)

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy combo'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/food-combos?page=1&size=10'
        />
      )
    }

    if (res.code === -10) {
      return <LogoutPage />
      // redirect('/login')
    }
    if (res.code === -11) {
      return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
    }
    if (!res || !res.data) {
      return (
        <ErrorPage />
      )
    }
    return (
      <ContentLayout title='Chỉnh sửa thông tin combo'>
        <AddOrEdit id={searchParams.id} inforFoodCombo={res.data} />
      </ContentLayout>
    )
  }
  if (id === 'view') {
    const res: IBackendRes<IFoodComboRes> = await findFoodComboById(searchParams.id)

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy combo'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/food-combos?page=1&size=10'
        />
      )
    }

    if (res.code === -10) {
      return <LogoutPage />
      // redirect('/login')
    }
    if (res.code === -11) {
      return <ToastServer message='Bạn không có quyền truy cập' title='Lỗi' variant='destructive' />
    }
    if (!res || !res.data) {
      return (
        <ErrorPage />
      )
    }
    return (
      <ContentLayout title='Xem thông tin combo'>
        <ViewFoodCombo inforFoodCombo={res.data} />
      </ContentLayout>
    )
  }
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
