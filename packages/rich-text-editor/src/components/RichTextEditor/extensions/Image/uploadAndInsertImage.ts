import {
  addImagePlaceholder,
  findImagePlaceholderPos,
  getImagePlaceholderGeneration,
  removeImagePlaceholder,
} from './imageUploadPlaceholder'

import type { ImageUploadResult } from '../../types'
import type { Editor } from '@tiptap/react'

/**
 * 画像ファイルを即アップロードし、完了後にエディタへ挿入する共通処理。
 * - 開始時にプレースホルダ Decoration を立てる（ドキュメントには載らない）
 * - 成功: プレースホルダ位置に image ノードを挿入
 * - 失敗: onImageUploadError を呼ぶ
 * - finally: プレースホルダを除去
 *
 * 挿入先が失われていた場合は何もせず正常終了する。アップロードは成功しているので
 * onImageUploadError は呼ばない。
 */
export const uploadAndInsertImage = async (
  editor: Editor,
  file: File,
  pos: number | null,
  onImageUpload: (file: File, formData: FormData) => Promise<ImageUploadResult>,
  onImageUploadError?: (error: unknown, file: File) => void,
): Promise<void> => {
  const view = editor.view
  const { id, generation } = addImagePlaceholder(view, pos ?? view.state.selection.from)

  try {
    const formData = new FormData()
    formData.append('file', file)
    const result = await onImageUpload(file, formData)

    if (editor.isDestroyed || view.isDestroyed) return

    const at = findImagePlaceholderPos(view, id)

    // 位置0は有効なので null かどうかで判定する。
    // 挿入箇所が削除された場合と、文書ごと差し替えられた場合の両方をここで止める。
    if (at === null || getImagePlaceholderGeneration(view) !== generation) return

    editor
      .chain()
      .insertContentAt(at, {
        type: 'image',
        attrs: { src: result.src, alt: result.alt ?? '' },
      })
      .run()
  } catch (error) {
    onImageUploadError?.(error, file)
  } finally {
    if (!editor.isDestroyed && !view.isDestroyed) {
      removeImagePlaceholder(view, id)
    }
  }
}
