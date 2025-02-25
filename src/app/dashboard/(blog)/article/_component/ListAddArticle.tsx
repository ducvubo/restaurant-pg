import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BookMarked, HandHelpingIcon, Video, Image, File } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function ListAddArticle() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='justify-center hover:bg-gray-200'>
          Thêm bài viết
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='grid gap-4 p-4'>
          <Link href='/dashboard/article/default'>
            <Button variant='outline' className='w-full flex gap-2 justify-start'>
              Mặc định
              <BookMarked />
            </Button>
          </Link>
          <Link href='/dashboard/article/video'>
            <Button variant='outline' className='w-full flex gap-2 justify-start'>
              Video
              <Video />
            </Button>
          </Link>
          <Link href='/dashboard/article/image'>
            <Button variant='outline' className='w-full flex gap-2 justify-start'>
              Ảnh
              <Image />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
