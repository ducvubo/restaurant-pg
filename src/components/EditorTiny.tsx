'use client'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { debounce } from 'lodash'
import { toast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface Props {
  width?: string // Thêm thuộc tính width
  height?: string // Thêm thuộc tính height,
  editorRef: any
  className?: string
}
export default function EditorTiny({ width = '100%', height = '400px', editorRef, className }: Props) {
  const { theme } = useTheme()
  const handleImageUpload: any = (blobInfo: any, progress: any, failure: any) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload/blog`, true)
      xhr.setRequestHeader('folder_type', 'blog')
      const formData = new FormData()
      formData.append('upload', blobInfo.blob(), blobInfo.filename())

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100)
        if (progress && typeof progress === 'function') {
          const percent = 0
          progress(percent)
        }
      }

      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText)
        if (res.statusCode === 400) {
          toast({
            title: 'Lỗi',
            description: 'Vui lòng chọn ảnh có định dạng jpg, jpeg, png, webp',
            variant: 'destructive'
          })
          reject('Vui lòng chọn ảnh có định dạng jpg, jpeg, png, webp')
          return
        }
        if (res.statusCode === 413) {
          toast({
            title: 'Lỗi',
            description: 'Dung lượng ảnh quá lớn vui lòng chọn ảnh dưới 5MB',
            variant: 'destructive'
          })
          reject('Dung lượng ảnh quá lớn vui lòng chọn ảnh dưới 5MB')
          return
        }
        resolve(res.data.image_cloud)
      }

      xhr.onerror = () => {
        reject({ message: 'Image upload failed', remove: true })
        if (failure && typeof failure === 'function') {
          failure('Image upload failed')
        }
      }

      xhr.send(formData)
    })
  }

  return (
    <div style={{ width }} className={cn(className)}>
      <Editor
        key={theme}
        apiKey={`${process.env.NEXT_PUBLIC_API_KEY_TINY_CME}`}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          branding: false,
          skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
          content_css: theme === 'dark' ? 'dark' : 'default',
          plugins: [
            'anchor',
            'autolink',
            'charmap',
            'codesample',
            'emoticons',
            'image',
            'link',
            'lists',
            'media',
            'searchreplace',
            'table',
            'visualblocks',
            'wordcount',
            'checklist',
            'mediaembed',
            'casechange',
            'export',
            'formatpainter',
            'pageembed',
            'a11ychecker',
            // 'tinymcespellchecker',
            'permanentpen',
            'powerpaste',
            'advtable',
            'advcode',
            'editimage',
            'advtemplate',
            // 'ai',
            'mentions',
            'tinycomments',
            'tableofcontents',
            'footnotes',
            'mergetags',
            'autocorrect',
            'typography',
            'inlinecss',
            'markdown',
            'preview'
          ],
          toolbar:
            'undo redo |  | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' }
          ],
          images_upload_url: `${process.env.NEXT_PUBLIC_URL_CLIENT}/api/upload/blog`,
          automatic_uploads: true,
          images_reuse_filename: true,
          images_upload_handler: handleImageUpload,
          theme_advanced_buttons1:
            'save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect',
          theme_advanced_buttons2:
            'cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor',
          theme_advanced_buttons3:
            'tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen',
          table_default_attributes: {
            border: '1px solid #ccc',
            'border-collapse': 'collapse'
          },
          resize: 'both',
          height: height,
          width: '100%'
        }}
        initialValue={editorRef.current ? editorRef.current : ''}
      />
    </div>
  )
}
