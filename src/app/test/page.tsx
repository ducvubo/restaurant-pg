'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import EditorTiny from '@/components/EditorTiny'

export default function Page() {
  const name = useSelector((state: RootState) => state.inforRestaurant)
  const name1 = useSelector((state: RootState) => state.inforEmployee)
  const refDescription = useRef<any>(null)
  const [htmlContent, setHtmlContent] = useState<string>('')

  // Update HTML content when necessary
  useEffect(() => {
    if (refDescription.current) {
      const content = refDescription.current.getContent() || ''
      setHtmlContent(content)
    }
  }, [refDescription])


  return (
    <div>
      <EditorTiny editorRef={refDescription} />

      {/* Render HTML content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  )
}
