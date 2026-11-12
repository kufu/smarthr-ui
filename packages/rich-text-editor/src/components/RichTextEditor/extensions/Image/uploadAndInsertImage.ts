import { isSafeImageSrc } from '../../serializers/safeAttributes'

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
 * - 失敗: onImageUploadError を呼ぶ。src が isSafeImageSrc を満たさない場合も失敗とする
 * - finally: プレースホルダを除去
 *
 * 文書が差し替えられていた場合は挿入せずに終わる。src が正しければアップロードは成功しているので
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

    // 挿入すると表示はされるが、保存した内容を表示するときに落ちる。エディタの破棄や
    // 文書の差し替えで挿入しない場合も通知するのは、利用者の実装の誤りを伝える機会がここにしか無いため
    if (!isSafeImageSrc(result?.src)) {
      const src = result?.src
      throw new Error(
        `RichTextEditor: 画像の src に使えない URL です: ${typeof src === 'string' ? src : typeof src}`,
      )
    }

    if (editor.isDestroyed || view.isDestroyed) return

    const at = findImagePlaceholderPos(view, id)

    // 位置0は有効なので null かどうかで判定する。
    // 文書の差し替えではプレースホルダも消えるため、両方の条件で止める。
    if (at === null || getImagePlaceholderGeneration(view) !== generation) return

    editor
      .chain()
      .insertContentAt(at, {
        type: 'image',
        attrs: { src: result.src, alt: typeof result.alt === 'string' ? result.alt : '' },
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
