'use client'

import { type FC, type ReactNode, createContext, useContext } from 'react'

import type { ImageUploadResult, RichTextFeature } from '../types'
import type { Editor } from '@tiptap/react'

type RichTextEditorContextValue = {
  editor: Editor
  features: readonly RichTextFeature[]
  headingLevels: ReadonlyArray<1 | 2 | 3 | 4>
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
  acceptedMimeTypes?: string[]
}

const DEFAULT_HEADING_LEVELS: ReadonlyArray<1 | 2 | 3 | 4> = [1, 2, 3, 4]

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null)

type ProviderProps = {
  editor: Editor
  features: readonly RichTextFeature[]
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
  acceptedMimeTypes?: string[]
  children: ReactNode
}

export const RichTextEditorProvider: FC<ProviderProps> = ({
  editor,
  features,
  headingLevels = DEFAULT_HEADING_LEVELS,
  onImageUpload,
  onImageUploadError,
  acceptedMimeTypes,
  children,
}) => (
  <RichTextEditorContext.Provider
    value={{
      editor,
      features,
      headingLevels,
      onImageUpload,
      onImageUploadError,
      acceptedMimeTypes,
    }}
  >
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
