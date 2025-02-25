'use server'

import { sendRequest } from '@/lib/api'
import { ICategory } from '../category-blog/category-blog.interface'
import { IArticle } from './article.interface'

const URL_SERVER_BLOG = process.env.URL_SERVER_BLOG

export const getAllCategorys = async () => {
  const res: IBackendRes<ICategory[]> = await sendRequest({
    url: `${URL_SERVER_BLOG}/categories/all`,
    method: 'GET'
  })
  return res
}

export const slugExist = async (slug: string) => {
  const res: IBackendRes<boolean> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/check-slug`,
    method: 'GET',
    queryParams: { slug }
  })
  return res
}

export const createArticle = async (data: Partial<IArticle>, type: 'default' | 'video' | 'image') => {
  const url =
    type === 'default'
      ? `${URL_SERVER_BLOG}/articles/add/default`
      : type === 'video'
      ? `${URL_SERVER_BLOG}/articles/add/video`
      : `${URL_SERVER_BLOG}/articles/add/image`

  const res: IBackendRes<IArticle> = await sendRequest({
    url,
    method: 'POST',
    body: data
  })
  return res
}

export const updateArticle = async (data: Partial<IArticle>, type: 'default' | 'video' | 'image') => {
  const url =
    type === 'default'
      ? `${URL_SERVER_BLOG}/articles/update/default`
      : type === 'video'
      ? `${URL_SERVER_BLOG}/articles/update/video`
      : `${URL_SERVER_BLOG}/articles/update/image`

  const res: IBackendRes<IArticle> = await sendRequest({
    url,
    method: 'PATCH',
    body: data
  })
  console.log('🚀 ~ updateArticle ~ res:', res)
  return res
}

export const getAllArticle = async ({
  pageIndex,
  pageSize,
  type,
  atlTitle
}: {
  pageIndex: string
  pageSize: string
  atlTitle: string
  type: 'all' | 'recycle'
}) => {
  const url = type === 'all' ? `${URL_SERVER_BLOG}/articles/all` : `${URL_SERVER_BLOG}/articles/recycle`
  const res: IBackendRes<IModelPaginate<IArticle>> = await sendRequest({
    url,
    method: 'GET',
    queryParams: {
      pageIndex,
      pageSize,
      atlTitle
    },
    nextOption: {
      cache: 'no-store'
    }
  })
  return res
}

export const sendArticle = async (id: string) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/send/${id}`,
    method: 'PATCH'
  })
  console.log('🚀 ~ sendArticle ~ res:', res)
  return res
}

export const approveArticle = async (id: string) => {
  return await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/approve/${id}`,
    method: 'PATCH'
  })
}

export const rejectArticle = async (id: string) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/reject/${id}`,
    method: 'PATCH'
  })
  return res
}

export const publishArticle = async (id: string) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/publish/${id}`,
    method: 'PATCH'
  })
  return res
}

export const publishScheduleArticle = async (id: string, scheduleTime: string) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/schedule-publish/${id}`,
    method: 'PATCH',
    queryParams: { scheduleTime }
  })

  return res
}

export const unpublishScheduleArticle = async (id: string) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/unpublish-schedule/${id}`,
    method: 'PATCH'
  })
  return res
}

export const unpublishArticle = async (id: string) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/unpublish/${id}`,
    method: 'PATCH'
  })
  return res
}

export const deleteArticle = async ({ atlId }: { atlId: string }) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/delete-draft/${atlId}`,
    method: 'DELETE'
  })
  return res
}

export const restoreArticle = async ({ atlId }: { atlId: string }) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/restore/${atlId}`,
    method: 'PATCH'
  })
  return res
}

export const findArticleById = async ({ atlId }: { atlId: string }) => {
  const res: IBackendRes<IArticle> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/${atlId}`,
    method: 'GET'
  })
  return res
}

export const findAllArticleName = async () => {
  const res: IBackendRes<IArticle[]> = await sendRequest({
    url: `${URL_SERVER_BLOG}/articles/all-name`,
    method: 'GET'
  })
  return res
}
