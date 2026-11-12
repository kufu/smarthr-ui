import type { HeadingLevel } from './configureHeading'
import type { ImageUploadResult, RichTextFeature } from '../types'

/**
 * マウント後に変わりうる設定。
 *
 * Editor と schema は作り直さない方針のため、これらを extension の生成時に取り込むと
 * 変更が反映されない。extension 側は実行時に getter を呼んで最新値を読む。
 */
export type RichTextRuntimeOptions = {
  /** 新しく適用できる書式。schema に載せる書式とは別 */
  features?: readonly RichTextFeature[]
  /** 新しく適用できる見出しレベル。schema に載せるレベルとは別 */
  allowedHeadingLevels?: readonly HeadingLevel[]
  placeholder?: string
  onImageUpload?: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
  acceptedMimeTypes?: string[]
}

export type GetRichTextRuntimeOptions = () => RichTextRuntimeOptions

/** serializer のように設定が変わらない経路で使う固定値の getter */
export const NO_RUNTIME_OPTIONS: GetRichTextRuntimeOptions = () => ({})
