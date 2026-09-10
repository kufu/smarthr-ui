import { Editor } from '@tiptap/core'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { configureExtensions } from '../configureExtensions'

import { uploadAndInsertImage } from './uploadAndInsertImage'

import type { ImageUploadResult } from '../../types'

// jsdom には ResizeObserver が無く、挿入された画像の NodeView がマウント時に参照する
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

const createEditor = (content: string) =>
  new Editor({ extensions: configureExtensions({ features: ['image'] }), content })

const createDeferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

const file = () => new File(['x'], 'a.png', { type: 'image/png' })

const imagePositions = (editor: Editor) => {
  const positions: number[] = []
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'image') positions.push(pos)
  })

  return positions
}

describe('uploadAndInsertImage', () => {
  it('完了時にプレースホルダの位置へ挿入する', async () => {
    const editor = createEditor('<p>hello</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 6, () => deferred.promise)

    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(1)
    expect(editor.getHTML()).toContain('https://example.com/a.png')
  })

  it('前方が編集されたら移動後の位置へ挿入する', async () => {
    const editor = createEditor('<p>hello</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 3, () => deferred.promise)

    editor.commands.insertContentAt(1, 'XY')
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(1)
    // プレースホルダは 3 から 5 へ移動する。ブロック要素の挿入で段落が分割される
    expect(editor.getHTML()).toMatch(/<p>XYhe<\/p>.*<img[^>]*>.*<p>llo<\/p>/)
  })

  it('挿入箇所を含む範囲が削除されたら挿入しない', async () => {
    const editor = createEditor('<p>hello</p><p>world</p>')
    const onImageUploadError = vi.fn()
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(
      editor,
      file(),
      10,
      () => deferred.promise,
      onImageUploadError,
    )

    editor.commands.deleteRange({ from: 7, to: 14 })
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(0)
    expect(onImageUploadError).not.toHaveBeenCalled()
  })

  it('文書が差し替えられたら挿入しない', async () => {
    const editor = createEditor('<p>hello</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 3, () => deferred.promise)

    editor.commands.setContent('<p>replaced</p>')
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(0)
    expect(editor.getText()).toBe('replaced')
  })

  it('内容が同じでも全消去をまたいだら挿入しない', async () => {
    const editor = createEditor('')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 1, () => deferred.promise)

    editor.commands.clearContent()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(0)
  })

  it('エディタが破棄されていたら挿入も除去もしない', async () => {
    const editor = createEditor('<p>hello</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 3, () => deferred.promise)

    editor.destroy()
    deferred.resolve({ src: 'https://example.com/a.png' })

    await expect(done).resolves.toBeUndefined()
  })

  it('並行するアップロードがそれぞれ挿入される', async () => {
    const editor = createEditor('<p>hello</p>')
    const first = createDeferred<ImageUploadResult>()
    const second = createDeferred<ImageUploadResult>()
    const doneFirst = uploadAndInsertImage(editor, file(), 1, () => first.promise)
    const doneSecond = uploadAndInsertImage(editor, file(), 6, () => second.promise)

    second.resolve({ src: 'https://example.com/b.png' })
    await doneSecond
    first.resolve({ src: 'https://example.com/a.png' })
    await doneFirst

    expect(imagePositions(editor)).toHaveLength(2)
    expect(editor.getHTML()).toContain('https://example.com/a.png')
    expect(editor.getHTML()).toContain('https://example.com/b.png')
  })

  it('アップロード失敗は onImageUploadError で通知する', async () => {
    const editor = createEditor('<p>hello</p>')
    const onImageUploadError = vi.fn()
    const deferred = createDeferred<ImageUploadResult>()
    const uploaded = file()
    const done = uploadAndInsertImage(
      editor,
      uploaded,
      3,
      () => deferred.promise,
      onImageUploadError,
    )
    const error = new Error('boom')

    deferred.reject(error)
    await done

    expect(onImageUploadError).toHaveBeenCalledWith(error, uploaded)
    expect(imagePositions(editor)).toHaveLength(0)
  })
})
