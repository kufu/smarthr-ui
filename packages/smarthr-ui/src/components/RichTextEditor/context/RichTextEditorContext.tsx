'use client'

import { type FC, type ReactNode, createContext, useContext } from 'react'

import type { ImageUploadResult, RichTextFeature } from '../types'
import type { Editor } from '@tiptap/react'

type RichTextEditorContextValue = {
  editor: Editor
  features: readonly RichTextFeature[]
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  acceptedMimeTypes?: string[]
}

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null)

type ProviderProps = {
  editor: Editor
  features: readonly RichTextFeature[]
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  acceptedMimeTypes?: string[]
  children: ReactNode
}

export const RichTextEditorProvider: FC<ProviderProps> = ({
  editor,
  features,
  onImageUpload,
  acceptedMimeTypes,
  children,
}) => (
  <RichTextEditorContext.Provider value={{ editor, features, onImageUpload, acceptedMimeTypes }}>
    {children}
  </RichTextEditorContext.Provider>
)

export const useRichTextEditorContext = () => {
  const context = useContext(RichTextEditorContext)
  if (!context) {
    throw new Error('useRichTextEditorContext must be used within a RichTextEditorProvider')
  }
  return context
}
