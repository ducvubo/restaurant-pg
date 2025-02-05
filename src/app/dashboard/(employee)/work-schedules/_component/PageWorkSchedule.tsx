'use client'
import React, { useState } from 'react'
import AddOrEdit from './AddOrEdit'
import { SerializedEditorState } from 'lexical'
import { Editor } from '@/components/blocks/editor-x/editor'

export default function PageWorkSchedule() {
  const [editorState, setEditorState] = useState<SerializedEditorState>()
  console.log('🚀 ~ PageWorkSchedule ~ editorState:', editorState)

  return (
    <div>
      <AddOrEdit id='add' />
      <Editor editorSerializedState={editorState} onSerializedChange={(value) => setEditorState(value)} />
    </div>
  )
}
