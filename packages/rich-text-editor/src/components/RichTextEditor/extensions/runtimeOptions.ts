import type { ImageUploadResult } from '../types'

/**
 * マウント後に変わりうる設定。
 *
 * Editor と schema は作り直さない方針のため、これらを extension の生成時に取り込むと
 * 変更が反映されない。extension 側は実行時に getter を呼んで最新値を読む。
 */
export type RichTextRuntimeOptions = {
  placeholder?: string
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
  acceptedMimeTypes?: string[]
}

export type GetRichTextRuntimeOptions = () => RichTextRuntimeOptions

/** serializer のように設定が変わらない経路で使う固定値の getter */
export const NO_RUNTIME_OPTIONS: GetRichTextRuntimeOptions = () => ({})
