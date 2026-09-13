import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

import { DEFAULT_MIME_TYPES, matchesMimeType } from './mimeTypes'
import { uploadAndInsertImage } from './uploadAndInsertImage'

import type { GetRichTextRuntimeOptions } from '../runtimeOptions'

/** reconfigure で plugin state を引き継げるよう、キーはモジュールスコープで固定する */
const IMAGE_PASTE_PLUGIN_KEY = new PluginKey('imagePaste')

type Options = {
  getRuntimeOptions: GetRichTextRuntimeOptions
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
 *
 * アップロード用の設定は貼り付けの実行時に読む。生成時に取り込むと、利用者が
 * onImageUpload を差し替えても古い関数を呼び続ける。
 */
export const createImagePasteExtension = ({ getRuntimeOptions }: Options): Extension =>
  Extension.create({
    name: 'imagePaste',
    addProseMirrorPlugins() {
      const { editor } = this

      return [
        new Plugin({
          key: IMAGE_PASTE_PLUGIN_KEY,
          props: {
            handlePaste: (_view, event) => {
              // 1回の貼り付けで使う関数はここで確定させる。アップロード中に差し替えられても
              // 同じジョブの成功と失敗で別の通知先へ分かれないようにする。
              const { onImageUpload, onImageUploadError, acceptedMimeTypes } = getRuntimeOptions()

              if (!onImageUpload) return false

              const mimeTypes = acceptedMimeTypes ?? DEFAULT_MIME_TYPES
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
