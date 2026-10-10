'use client'

import { type FC, type ReactNode, createContext, useContext, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'

import type { ImageUploadResult, RichTextFeature } from '../types'
import type { Editor } from '@tiptap/react'

type RichTextEditorContextValue = {
  editor: Editor
  features: readonly RichTextFeature[]
  headingLevels: ReadonlyArray<1 | 2 | 3 | 4>
  disabled?: boolean
  hasImageUpload: boolean
  /**
   * 呼んだ時点の関数を返す。アップロードを始めるときに1度だけ呼び、そのアップロードの
   * 成功・失敗には同じ関数を使う。途中で差し替えられても通知先が分かれないようにするため
   */
  getImageUploadHandlers: () => {
    onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
    onImageUploadError?: (error: unknown, file: File) => void
  }
  acceptedMimeTypes?: string[]
}

const DEFAULT_HEADING_LEVELS: ReadonlyArray<1 | 2 | 3 | 4> = [1, 2, 3, 4]

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null)

type ProviderProps = {
  editor: Editor
  features: readonly RichTextFeature[]
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  disabled?: boolean
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
  acceptedMimeTypes?: string[]
  children: ReactNode
}

export const RichTextEditorProvider: FC<ProviderProps> = ({
  editor,
  features,
  headingLevels = DEFAULT_HEADING_LEVELS,
  disabled,
  onImageUpload,
  onImageUploadError,
  acceptedMimeTypes,
  children,
}) => {
  // 利用者は配列や関数をインラインで渡しがちで、そのままでは再レンダーのたびに
  // 全ての consumer が描画し直される。配列は内容、関数は有無が変わったときだけ作り直し、
  // 関数そのものは getImageUploadHandlers で呼ぶ時点のものを渡す
  const featuresKey = features.join(',')
  const headingLevelsKey = headingLevels.join(',')
  const acceptedMimeTypesKey = acceptedMimeTypes?.join(',')
  const hasImageUpload = !!onImageUpload
  const latest = useLatest({
    features,
    headingLevels,
    acceptedMimeTypes,
    onImageUpload,
    onImageUploadError,
  })

  const value = useMemo<RichTextEditorContextValue>(
    () => ({
      editor,
      features: latest.features,
      headingLevels: latest.headingLevels,
      disabled,
      hasImageUpload,
      getImageUploadHandlers: () => ({
        onImageUpload: latest.onImageUpload,
        onImageUploadError: latest.onImageUploadError,
      }),
      acceptedMimeTypes: latest.acceptedMimeTypes,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, disabled, featuresKey, headingLevelsKey, acceptedMimeTypesKey, hasImageUpload, latest],
  )

  return <RichTextEditorContext.Provider value={value}>{children}</RichTextEditorContext.Provider>
}

export const useRichTextEditorContext = () => {
  const context = useContext(RichTextEditorContext)
  if (!context) {
    throw new Error('useRichTextEditorContext must be used within a RichTextEditorProvider')
  }
  return context
}
