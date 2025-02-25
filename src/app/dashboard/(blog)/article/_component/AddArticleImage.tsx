'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import EditorTiny from '@/components/EditorTiny'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { deleteCookiesAndRedirect } from '@/app/actions/action'
import { ICategory } from '../../category-blog/category-blog.interface'
import { createArticle, findAllArticleName, getAllCategorys, slugExist, updateArticle } from '../article.api'
import { useLoading } from '@/context/LoadingContext'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import slugify from 'slugify'
import { debounce } from 'lodash'
import { ImageUrl } from '@/app/dashboard/(food)/foods/_component/AddOrEdit'
import { Loader2, Trash, UploadIcon } from 'lucide-react'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IArticle } from '../article.interface'
import { v4 as uuidv4 } from 'uuid'
import { MultiSelect } from '@/components/Multipleselect'
interface Props {
  id: string
  inforArticle?: IArticle
}

export default function AddArticleImage({ inforArticle, id }: Props) {
  const { setLoading } = useLoading()
  const router = useRouter()
  const [title, setTitle] = useState(inforArticle?.atlTitle || '')
  const [listCategories, setListCategories] = useState<ICategory[]>([])
  const [category, setCategory] = useState<string>(inforArticle?.category.catId || '')
  const [slug, setSlug] = useState<string>(inforArticle?.atlSlug || '')
  const [description, setDescription] = useState(inforArticle?.atlDescription || '')
  const [notes, setNotes] = useState<string[]>(inforArticle?.listArticleNote || [''])
  const [isCheckSlug, setIsCheckSlug] = useState<boolean>(true)
  const [listArticle, setListArticle] = useState<
    {
      value: string
      label: string
    }[]
  >([])
  const [listArticleRelated, setListArticleRelated] = useState<string[]>(inforArticle?.listArticleRelated || [])

  const [uploadedImage, setUploadedImage] = useState<{
    image_cloud: string
    image_custom: string
  }>(
    inforArticle?.atlImage
      ? JSON.parse(inforArticle.atlImage)
      : {
          image_cloud: '',
          image_custom: ''
        }
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputImageRef = useRef<HTMLInputElement | null>(null)

  const [contentItems, setContentItems] = useState<
    {
      id: string
      image_cloud: string
      image_custom: string
      name: string
      description: string
      isUploading: boolean
      fileInputRef: HTMLInputElement | null
    }[]
  >(
    inforArticle?.atlContent
      ? JSON.parse(inforArticle.atlContent).map((item: any) => {
          let imageData
          try {
            imageData = JSON.parse(item.imageLink)
          } catch {
            imageData = { image_cloud: '', image_custom: '' } // fallback nếu parse lỗi
          }

          return {
            id: item.Id,
            image_cloud: imageData.image_cloud || '',
            image_custom: imageData.image_custom || '',
            name: item.imageName,
            description: item.imageDescription,
            isUploading: false,
            fileInputRef: null
          }
        })
      : []
  )

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setContentItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, isUploading: true } : item)))

      if (files.length > 1) {
        toast({ title: 'Thất bại', description: 'Chỉ được chọn 1 ảnh!', variant: 'destructive' })
        setContentItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? { ...item, isUploading: false } : item))
        )
        return
      }
      const res: IBackendRes<ImageUrl> = await uploadImage(files[0])
      if (res.statusCode === 201 && res.data) {
        setContentItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? res.data
                ? {
                    ...item,
                    image_cloud: res.data.image_cloud,
                    image_custom: res.data.image_custom,
                    isUploading: false
                  }
                : { ...item, isUploading: false }
              : item
          )
        )
      } else {
        toast({ title: 'Thất bại', description: 'Upload ảnh thất bại!', variant: 'destructive' })
        setContentItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? { ...item, isUploading: false } : item))
        )
      }
    }
  }

  const removeItem = (id: string) => {
    setContentItems(contentItems.filter((item) => item.id !== id))
  }

  const removeImage = (id: string) => {
    setContentItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, image_cloud: '' } : item)))
  }

  const addItem = () => {
    setContentItems([
      ...contentItems,
      {
        id: uuidv4(),
        image_cloud: '',
        image_custom: '',
        name: '',
        description: '',
        isUploading: false,
        fileInputRef: null
      }
    ])
  }

  const handleAddNote = () => {
    setNotes([...notes, ''])
  }

  const handleDeleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index))
  }

  const handleChangeNote = (index: number, value: string) => {
    const newNotes = [...notes]
    newNotes[index] = value
    setNotes(newNotes)
  }

  const checkSlugExistDebounced = useCallback(
    debounce((newSlug) => {
      checkSlugExist(newSlug)
    }, 500), // Đợi 500ms sau lần nhập cuối cùng
    []
  )

  useEffect(() => {
    const newSlug = slugify(title, {
      replacement: '-',
      remove: undefined,
      lower: false,
      strict: false,
      locale: 'vi',
      trim: true
    })
    setSlug(newSlug)
    if (newSlug !== inforArticle?.atlSlug) {
      checkSlugExistDebounced(newSlug) // Gọi API kiểm tra slug nhưng bị debounce
    }
  }, [title])

  const findAllCategory = async () => {
    const res: IBackendRes<ICategory[]> = await getAllCategorys()
    if (res.statusCode === 200 && res.data) {
      setListCategories(res.data)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
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
    }
  }

  const getAllArticle = async () => {
    const res: IBackendRes<IArticle[]> = await findAllArticleName()
    if (res.statusCode === 200 && res.data) {
      res.data.map((article) => {
        setListArticle((prev) => [
          ...prev,
          {
            value: article.atlId,
            label: article.atlTitle
          }
        ])
      })
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
        variant: 'destructive'
      })
      await deleteCookiesAndRedirect()
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
    }
  }

  const checkSlugExist = async (slug: string) => {
    const res: IBackendRes<boolean> = await slugExist(slug)

    if (res.statusCode === 200 && res.data) {
      setIsCheckSlug(true)
    } else if (res.code === -10) {
      toast({
        title: 'Thông báo',
        description: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
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
      setIsCheckSlug(false)
      setLoading(false)
    }
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res: IBackendRes<ImageUrl> = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload/article`, {
        method: 'POST',
        headers: {
          type: 'image'
        },
        body: formData
      })
    ).json()
    return res
  }

  const handleFileChangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      setIsUploadingImage(true)

      if (files.length > 1) {
        toast({
          title: 'Thất bại',
          description: 'Chỉ được chọn 1 ảnh!',
          variant: 'destructive'
        })
        setIsUploadingImage(false)
        return
      }
      const res: IBackendRes<ImageUrl> = await uploadImage(files[0])
      if (res.statusCode === 201 && res.data) {
        setIsUploadingImage(false)
        setUploadedImage(res.data)
      } else {
        setIsUploadingImage(false)
        toast({
          title: 'Thất bại',
          description: 'Upload ảnh thất bại!',
          variant: 'destructive'
        })
      }
    }
  }

  useEffect(() => {
    findAllCategory()
    getAllArticle()
  }, [])

  const addArticleDefault = async () => {
    //check nhập trống
    if (!title) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng nhập tiêu đề',
        variant: 'destructive'
      })
      return
    }
    if (!description) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng nhập mô tả',
        variant: 'destructive'
      })
      return
    }
    if (!category) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng chọn danh mục',
        variant: 'destructive'
      })
      return
    }
    if (!uploadedImage.image_cloud) {
      toast({
        title: 'Thất bại',
        description: 'Vui lòng chọn ảnh',
        variant: 'destructive'
      })
      return
    }

    const data: Partial<IArticle> = {
      atlTitle: title,
      atlSlug: slug,
      listArticleImage: contentItems.map((item) => {
        return {
          imageLink: JSON.stringify({
            image_cloud: item.image_cloud,
            image_custom: item.image_custom
          }),
          imageDescription: item.description,
          imageName: item.name,
          Id: item.id
        }
      }),
      atlDescription: description,
      catId: category,
      atlImage: JSON.stringify(uploadedImage),
      listArticleNote: notes,
      listArticleRelated: listArticleRelated
    }
    const res: IBackendRes<IArticle> =
      id === 'add' ? await createArticle(data, 'image') : await updateArticle({ ...data, atlId: id }, 'image')
    if (res.statusCode === 201 || res.statusCode === 200) {
      setLoading(false)
      toast({
        title: 'Thành công',
        description: id === 'add' ? 'Thêm bài viết mới thành công' : 'Chỉnh sửa thông tin bài viết thành công',
        variant: 'default'
      })
      router.push('/dashboard/article')
      router.refresh()
    } else if (res.statusCode === 400) {
      setLoading(false)
      if (Array.isArray(res.message)) {
        res.message.map((item: string) => {
          toast({
            title: 'Thất bại',
            description: item,
            variant: 'destructive'
          })
        })
      } else {
        toast({
          title: 'Thất bại',
          description: res.message,
          variant: 'destructive'
        })
      }
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
        title: 'Thông báo',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'destructive'
      })
    }
  }

  return (
    <ResizablePanelGroup direction='horizontal' className='w-full h-full'>
      <ResizablePanel defaultSize={75} className='p-4 h-full'>
        <div>
          {contentItems.map((item) => (
            <div key={item.id} className='flex flex-row gap-4 mb-4 p-4 border rounded-lg'>
              <div className='w-1/2'>
                <h1 className='-mb-3'>Ảnh</h1>
                <div className='flex gap-2 w-full'>
                  {!item.image_cloud ? (
                    <div
                      onClick={() => item.fileInputRef?.click()}
                      className='mt-4 w-full relative flex items-center justify-center h-48  aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                    >
                      <div className='text-center'>
                        {item.isUploading ? (
                          <Loader2 className='animate-spin' />
                        ) : (
                          <UploadIcon className='mx-auto text-gray-400 w-8 h-8' />
                        )}
                        <Input
                          ref={(el: any) => (item.fileInputRef = el)}
                          type='file'
                          accept='image/*'
                          onChange={(e) => handleFileChange(e, item.id)}
                          disabled={item.isUploading}
                          className='sr-only'
                        />
                      </div>
                    </div>
                  ) : (
                    <div className='group relative w-full h-48 mt-4  aspect-square rounded-md border-2 border-gray-300'>
                      <Image src={item.image_cloud} alt='Uploaded Image' fill className='object-cover rounded-md' />
                      <Trash className='absolute top-2 right-2 cursor-pointer' onClick={() => removeImage(item.id)} />
                    </div>
                  )}
                </div>
              </div>
              <div className='w-1/2 flex flex-col gap-5 mt-5'>
                <div className='w-full'>
                  <Label>Tên</Label>
                  <Input
                    value={item.name}
                    placeholder='Nhập tên'
                    onChange={(e) =>
                      setContentItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, name: e.target.value } : i))
                      )
                    }
                  />
                </div>
                <div className='w-full'>
                  <Label>Mô tả</Label>
                  <Input
                    value={item.description}
                    placeholder='Nhập mô tả'
                    onChange={(e) =>
                      setContentItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, description: e.target.value } : i))
                      )
                    }
                  />
                </div>
                <Button onClick={() => removeItem(item.id)} className='mt-2 bg-red-500 hover:bg-red-600 text-white'>
                  Xóa ảnh
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={addItem} className='mt-4'>
            Thêm ảnh
          </Button>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} className='p-4 h-full'>
        <div className='w-full'>
          <Label>Tiêu đề</Label>
          <Input
            value={title}
            placeholder='Nhập tiêu đề'
            className='w-full'
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='w-full'>
          <Label>Slug</Label>
          <Input value={slug} placeholder='Nhập tiêu đề' className='w-full' disabled readOnly />
          {!isCheckSlug && <span className='text-red-500'>Slug đã tồn tại</span>}
        </div>
        <div className='w-full mt-4'>
          <Label>Danh mục</Label>
          <Select value={category} onValueChange={(value: string) => setCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder='Chọn danh mục...' />
            </SelectTrigger>
            <SelectContent>
              {listCategories.map((category) => (
                <SelectItem key={category.catId} value={category.catId}>
                  {category.catName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='mt-4 w-full'>
          <h1 className='-mb-3'>Ảnh</h1>
          <div className='flex gap-2 w-full'>
            {!uploadedImage.image_cloud && (
              <div
                onClick={() => {
                  if (fileInputImageRef.current) {
                    fileInputImageRef.current.click()
                  }
                }}
                className='mt-4 w-full relative flex items-center justify-center h-24 sm:h-32  md:h-36 aspect-square rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 focus-within:outline-2 focus-within:outline-dashed focus-within:outline-gray-500 dark:focus-within:outline-gray-400'
              >
                <div className='text-center'>
                  {isUploadingImage ? (
                    <Loader2 className='animate-spin' />
                  ) : (
                    <UploadIcon className='mx-auto text-gray-400 w-8 h-8' />
                  )}
                  <Input
                    ref={fileInputImageRef}
                    id='uploadAvatar'
                    type='file'
                    accept='image/*'
                    onChange={handleFileChangeImage}
                    disabled={isUploadingImage}
                    className='sr-only'
                  />
                </div>
              </div>
            )}
            {uploadedImage.image_cloud && (
              <div className='group relative w-full h-24 mt-4 sm:h-32 md:h-36 aspect-square rounded-md border-2 border-gray-300 transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'>
                <Image src={uploadedImage.image_cloud} alt='Uploaded Image' fill className='object-cover rounded-md' />
                <Trash
                  className='absolute top-2 right-2 transition opacity-0 group-hover:opacity-100'
                  onClick={() => setUploadedImage({ image_cloud: '', image_custom: '' })}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className='w-full'>
          <Label>Mô tả</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className='flex gap-2 mt-3'>
          <Sheet>
            <SheetTrigger asChild className='!w-1/2'>
              <Button variant='outline'>Thông tin phụ</Button>
            </SheetTrigger>
            <SheetContent className='!w-[800px] sm:!max-w-[800px]'>
              <SheetHeader>
                <SheetTitle>
                  <h1>Thông tin phụ</h1>
                </SheetTitle>
              </SheetHeader>
              <Tabs defaultValue='account' className='w-full mt-3'>
                <TabsList className='w-full'>
                  <TabsTrigger value='account' className='w-1/2'>
                    Ghi chú
                  </TabsTrigger>
                  <TabsTrigger value='password' className='w-1/2'>
                    Bài viết liên quan
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='account'>
                  <SheetDescription>
                    <Label>Ghi chú</Label>
                    {notes.map((note, index) => (
                      <div key={index} className='flex items-center gap-2 mt-2'>
                        <Textarea
                          value={note}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleChangeNote(index, e.target.value)
                          }
                          placeholder={`Ghi chú ${index + 1}`}
                        />
                        {notes.length > 1 && (
                          <Button variant='destructive' onClick={() => handleDeleteNote(index)}>
                            Xóa
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button onClick={handleAddNote} className='mt-2'>
                      Thêm ghi chú
                    </Button>
                  </SheetDescription>
                </TabsContent>
                <TabsContent value='password'>
                  <SheetDescription>
                    <Label>Bài viết đính kèm</Label>
                    <MultiSelect
                      options={listArticle}
                      onValueChange={setListArticleRelated}
                      defaultValue={listArticleRelated}
                      placeholder='Chọn bài viết liên quan...'
                      variant='inverted'
                      animation={2}
                      maxCount={5}
                    />
                  </SheetDescription>
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
          {isUploadingImage && (
            <Button className='w-1/2' disabled>
              <Loader2 className='animate-spin' />
              Đang tải ảnh
            </Button>
          )}
          {!isUploadingImage && (
            <Button className='w-1/2' onClick={addArticleDefault} disabled={isUploadingImage || !isCheckSlug}>
              Lưu
            </Button>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
