import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

import { matchesMimeType } from './mimeTypes'
import { uploadAndInsertImage } from './uploadAndInsertImage'

import type { ImageUploadResult } from '../../types'

type Options = {
  mimeTypes: string[]
  onImageUpload: (file: File, formData: FormData) => Promise<ImageUploadResult>
  onImageUploadError?: (error: unknown, file: File) => void
}

/**
 * 画像 File を含む貼り付けを1回だけ消費する。
 *
 * FileHandler の onPaste は HTML を含むクリップボードで false を返し、通常のHTMLペーストも
 * 続行させるため、アップロード結果と HTML の img が二重に入る。ファイルを扱う場合は
 * ここで true を返して貼り付けを終わらせる。
 *
 * 許可されないファイルしか無いときは false を返し、同時に含まれるテキストの貼り付けは
 * 通常どおり通す。
 */
export const createImagePasteExtension = ({
  mimeTypes,
  onImageUpload,
  onImageUploadError,
}: Options): Extension =>
  Extension.create({
    name: 'imagePaste',
    addProseMirrorPlugins() {
      const { editor } = this

      return [
        new Plugin({
          key: new PluginKey('imagePaste'),
          props: {
            handlePaste: (_view, event) => {
              const files = Array.from(event.clipboardData?.files ?? [])
              const file = files.find((f) => matchesMimeType(f.type, mimeTypes))

              if (!file) return false

              event.preventDefault()
              event.stopPropagation()
              uploadAndInsertImage(editor, file, null, onImageUpload, onImageUploadError)

              return true
            },
          },
        }),
      ]
    },
  })
