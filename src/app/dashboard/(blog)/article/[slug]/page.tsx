import { ContentLayout } from '@/components/admin-panel/content-layout'
import React, { Suspense } from 'react'
import LoadingServer from '@/components/LoadingServer'
import dynamic from 'next/dynamic'
import AddArticleDefault from '../_component/AddArticleDefault'
import AddArticleImage from '../_component/AddArticleImage'
import AddArticleVideo from '../_component/AddArticleVideo'
import LogoutPage from '@/app/logout/page'
import { IArticle } from '../article.interface'
import { findArticleById, getAllArticle } from '../article.api'
import { columns } from '../_component/Columns'
import { PageArticle } from '../_component/PageArticle'
import ErrorPage from '@/components/ErrorPage'

const ToastServer = dynamic(() => import('@/components/ToastServer'), {
  ssr: false
})

interface PageProps {
  searchParams: { [key: string]: string }
  params: { slug: string }
}

async function Component({ searchParams, params }: PageProps) {
  const id = params.slug
  if (id === 'default') {
    return (
      <ContentLayout title='Thêm bài viết mặc định'>
        <AddArticleDefault id='add' />
      </ContentLayout>
    )
  }
  if (id === 'image') {
    return (
      <ContentLayout title='Thêm bài viết ảnh'>
        <AddArticleImage id='add' />
      </ContentLayout>
    )
  }
  if (id === 'video') {
    return (
      <ContentLayout title='Thêm bài viết video'>
        <AddArticleVideo id='add' />
      </ContentLayout>
    )
  }

  if (id === 'recycle') {
    const res: IBackendRes<IModelPaginate<IArticle>> = await getAllArticle({
      pageIndex: searchParams.page ? searchParams.page : '1',
      pageSize: searchParams.size ? searchParams.size : '10',
      type: 'recycle',
      atlTitle: searchParams.search ? searchParams.search : ''
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
          <ContentLayout title='Danh sách bài viết đã xóa'>
            <PageArticle data={data} columns={columns} meta={res.data.meta} />
          </ContentLayout>
        </div>
      )
    }
  }

  const res: IBackendRes<IArticle> = await findArticleById({ atlId: id })

  if (res.statusCode === 404) {
    return (
      <ToastServer
        message='Không tìm thấy nhãn'
        title='Lỗi'
        variant='destructive'
        route='/dashboard/category-blog?page=1&size=10'
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
    <ContentLayout title='Chỉnh sửa thông tin bài viết'>
      {res.data.atlType === 'DEFAULT' && <AddArticleDefault id={id} inforArticle={res.data} />}
      {res.data.atlType === 'IMAGE' && <AddArticleImage id={id} inforArticle={res.data} />}
      {res.data.atlType === 'VIDEO' && <AddArticleVideo id={id} inforArticle={res.data} />}
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
