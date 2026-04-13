'use client'

import { type FC, type ReactNode, createContext, useContext } from 'react'

import type { RichTextFeature } from '../types'
import type { Editor } from '@tiptap/react'

type RichTextEditorContextValue = {
  editor: Editor
  features: readonly RichTextFeature[]
}

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null)

type ProviderProps = {
  editor: Editor
  features: readonly RichTextFeature[]
  children: ReactNode
}

export const RichTextEditorProvider: FC<ProviderProps> = ({ editor, features, children }) => (
  <RichTextEditorContext.Provider value={{ editor, features }}>
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
