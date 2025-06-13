'use client'
import React, { useEffect, useState } from 'react'
import { IArticle } from '../article.interface'
import { ICategory } from '../../category-blog/category-blog.interface'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { getAllCategorys, findAllArticleName } from '../article.api'
import { useToast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import Image from 'next/image'
import { MultiSelect } from '@/components/Multipleselect'
import { usePermission } from '@/app/auth/PermissionContext'


interface ViewArticleProps {
  inforArticle: IArticle
}

export default function ViewArticle({ inforArticle }: ViewArticleProps) {
  console.log('inforArticle', inforArticle)
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [articles, setArticles] = useState<{ value: string; label: string }[]>([])
  const [listArticleRelated, setListArticleRelated] = useState<string[]>(inforArticle.listArticleRelated || [])
  const { hasPermission } = usePermission()
  const handleEdit = () => {
    router.push(`/dashboard/article/edit?id=${inforArticle.atlId}`)
  }

  const fetchCategories = async () => {
    const res: IBackendRes<ICategory[]> = await getAllCategorys()
    if (res.statusCode === 200 && res.data) {
      setCategories(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else {
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra khi lấy danh sách danh mục, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  const fetchArticles = async () => {
    const res: IBackendRes<IArticle[]> = await findAllArticleName()
    if (res.statusCode === 200 && res.data) {
      setArticles(res.data.map(article => ({ value: article.atlId, label: article.atlTitle })))
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
    } else {
      toast({
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra khi lấy danh sách bài viết, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchArticles()
  }, [])

  const categoryName = categories.find(cat => cat.catId === inforArticle.catId)?.catName || 'Không xác định'
  const relatedArticleNames = inforArticle.listArticleRelated
    ?.map(id => articles.find(article => article.value === id)?.label || 'Không xác định')
    .join(', ') || 'Chưa có bài viết liên quan'

  const statusDisplay = {
    DRAFT: 'Nháp',
    PENDING_APPROVAL: 'Chờ duyệt',
    REJECTED: 'Bị từ chối',
    PENDING_PUBLISH: 'Chờ xuất bản',
    PUBLISH_SCHEDULE: 'Lên lịch xuất bản',
    PUBLISHED: 'Đã xuất bản',
    UNPUBLISHED: 'Đã gỡ'
  }[inforArticle.atlStatus] || 'Không xác định'

  const parsedImage = inforArticle.atlImage ? JSON.parse(inforArticle.atlImage) : { image_cloud: '' }
  let parsedContent = null
  try {
    parsedContent = inforArticle.atlContent ? JSON.parse(inforArticle.atlContent) : null
  } catch {
    parsedContent = null
  }

  const getEmbedIframeSrc = (embedCode: string) => {
    const match = embedCode.match(/src="([^"]+)"/)
    return match ? match[1] : ''
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <Button onClick={handleEdit} disabled={!hasPermission('article_update')}>Chỉnh sửa</Button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
        <tbody>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Tiêu đề</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforArticle.atlTitle}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Slug</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforArticle.atlSlug}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Danh mục</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{categoryName}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Mô tả</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforArticle.atlDescription}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ảnh đại diện</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {parsedImage.image_cloud ? (
                <div className='relative w-32 h-32'>
                  <Image
                    src={parsedImage.image_cloud}
                    alt='Article Image'
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
              ) : (
                'Chưa có ảnh'
              )}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Nội dung</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforArticle.atlType === 'DEFAULT' && parsedContent?.content ? (
                <div
                  className='prose dark:prose-invert'
                  dangerouslySetInnerHTML={{ __html: parsedContent.content }}
                />
              ) : inforArticle.atlType === 'IMAGE' && parsedContent ? (
                <div className='space-y-4'>
                  {parsedContent.map((item: any, index: number) => {
                    let imageData
                    try {
                      imageData = JSON.parse(item.imageLink)
                    } catch {
                      imageData = { image_cloud: '' }
                    }
                    return (
                      <div key={index} className='border p-4 rounded-md'>
                        {imageData.image_cloud && (
                          <div className='relative w-48 h-48 mb-2'>
                            <Image
                              src={imageData.image_cloud}
                              alt={item.imageName || 'Image'}
                              fill
                              className='object-cover rounded-md'
                            />
                          </div>
                        )}
                        <p><strong>Tên ảnh:</strong> {item.imageName || 'Chưa có tên'}</p>
                        <p><strong>Mô tả:</strong> {item.imageDescription || 'Chưa có mô tả'}</p>
                      </div>
                    )
                  })}
                </div>
              ) : inforArticle.atlType === 'VIDEO' && parsedContent ? (
                <div className='space-y-4'>
                  {parsedContent.videoArticleType === 'LINK' && parsedContent.contentVideo ? (
                    <video
                      src={parsedContent.contentVideo}
                      controls
                      className='w-full max-w-md rounded-md'
                    />
                  ) : parsedContent.videoArticleType === 'EMBED' && parsedContent.contentVideo ? (
                    getEmbedIframeSrc(parsedContent.contentVideo) ? (
                      <iframe
                        src={getEmbedIframeSrc(parsedContent.contentVideo)}
                        className='w-full max-w-md aspect-video rounded-md'
                        frameBorder='0'
                        allowFullScreen
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: parsedContent.contentVideo }} />
                    )
                  ) : (
                    'Chưa có video'
                  )}
                  <p><strong>Mô tả video:</strong> {parsedContent.description || 'Chưa có mô tả'}</p>
                </div>
              ) : (
                'Chưa có nội dung'
              )}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Ghi chú</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {inforArticle.listArticleNote?.length ? (
                <ul className='list-disc pl-5'>
                  {inforArticle.listArticleNote.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              ) : (
                'Chưa có ghi chú'
              )}
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Bài viết liên quan</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>
              {/* <MultiSelect
                options={articles}
                onValueChange={setListArticleRelated}
                defaultValue={inforArticle.listArticleRelated}
                placeholder='Chọn bài viết liên quan...'
                variant='inverted'
                animation={0}
                maxCount={5}
                disabled
              /> */}
              <ul className='list-disc pl-5'>
                {inforArticle.listArticleRelated?.map((item) => (
                  <li key={item}>{articles.find(article => article.value === item)?.label || 'Không xác định'}</li>
                ))}
              </ul>
            </td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Trạng thái</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{statusDisplay}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 dark:border-gray-700 p-2 font-bold'>Lượt xem</td>
            <td className='border border-gray-300 dark:border-gray-700 p-2'>{inforArticle.atlView || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}