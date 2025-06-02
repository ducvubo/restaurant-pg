import React, { Suspense } from 'react'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import LoadingServer from '@/components/LoadingServer'
import ToastServer from '@/components/ToastServer'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { IChatBot } from './chat-bot.interface'
import { getAllPaginationMessageChatBot } from './chat-bot.api'
import LogoutPage from '@/app/logout/page'
import { PageChatBot } from './_component/PageChatBot'
import { columns } from './_component/Columns'


interface PageProps {
  searchParams: { [key: string]: string }
}

async function Component({ searchParams }: PageProps) {
  const res: IBackendRes<IModelPaginate<IChatBot>> = await getAllPaginationMessageChatBot({
    current: searchParams.page ? searchParams.page : '1',
    pageSize: searchParams.size ? searchParams.size : '10',
    message: '',
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
  const data = res.data.result.flat()

  return (
    <div>
      <ContentLayout title='Tin nhắn chat bot với khách hàng'>
        <PageChatBot data={data} columns={columns} meta={res.data.meta} />
      </ContentLayout>
    </div>
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
