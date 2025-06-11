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
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AddOrEdit from '../_component/AddOrEdit'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { IDish } from '../dishes.interface'
import { findDishById, getAllDish } from '../dishes.api'
import { PageDishes } from '../_component/PageDishes'
import { columns } from '../_component/Columns'
import LogoutPage from '@/app/logout/page'
import ErrorPage from '@/components/ErrorPage'
import ViewDish from '../_component/ViewDish'

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
    const res: IBackendRes<IModelPaginate<IDish>> = await getAllDish({
      current: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      dish_name: searchParams.search ? searchParams.search : '',
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
          <ContentLayout title='Danh sách món ăn đã xóa'>
            <PageDishes data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  if (id === 'edit') {
    const res: IBackendRes<IDish> = await findDishById({ _id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy món ăn'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/dishes?page=1&size=10'
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
      <ContentLayout title='Chỉnh sửa thông tin món ăn'>
        <AddOrEdit id={searchParams.id} inforDish={res.data} />
      </ContentLayout>
    )
  }

  if (id === 'view') {
    const res: IBackendRes<IDish> = await findDishById({ _id: searchParams.id })

    if (res.statusCode === 404) {
      return (
        <ToastServer
          message='Không tìm thấy món ăn'
          title='Lỗi'
          variant='destructive'
          route='/dashboard/dishes?page=1&size=10'
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
        <ErrorPage />
      )
    }
    return (
      <ContentLayout title='Xem thông tin món ăn'>
        <ViewDish inforDish={res.data} />
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
