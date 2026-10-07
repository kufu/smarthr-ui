import { Editor } from '@tiptap/core'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { configureExtensions } from '../configureExtensions'

import { imageUploadPlaceholderKey } from './imageUploadPlaceholder'
import { uploadAndInsertImage } from './uploadAndInsertImage'

import type { ImageUploadResult, RichTextFeature } from '../../types'

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

// 破棄しないと、DOM の変化をまとめる ProseMirror のタイマーがテスト環境の破棄後に走り、CI で落ちることがある
const editors: Editor[] = []
afterEach(() => {
  while (editors.length > 0) editors.pop()?.destroy()
})

const createEditor = (content: string, features: RichTextFeature[] = ['image']) => {
  const editor = new Editor({ extensions: configureExtensions({ features }), content })
  editors.push(editor)

  return editor
}

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

    editor.commands.insertContentAt(1, '12')
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(1)
    // プレースホルダは 3 から 5 へ移動する。ブロック要素の挿入で段落が分割される
    expect(editor.getHTML()).toMatch(/<p>12he<\/p>.*<img[^>]*>.*<p>llo<\/p>/)
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

  it.each([
    ['先に始めた方', true],
    ['後から始めた方', false],
  ])(
    '段落の末尾の同じ位置へ並行してアップロードすると、%sが先に完了しても両方挿入される',
    async (_, firstCompletesFirst) => {
      const editor = createEditor('<p>hello</p>')
      const first = createDeferred<ImageUploadResult>()
      const second = createDeferred<ImageUploadResult>()
      const doneFirst = uploadAndInsertImage(editor, file(), 6, () => first.promise)
      const doneSecond = uploadAndInsertImage(editor, file(), 6, () => second.promise)
      const completeFirst = async () => {
        first.resolve({ src: 'https://example.com/a.png' })
        await doneFirst
      }
      const completeSecond = async () => {
        second.resolve({ src: 'https://example.com/b.png' })
        await doneSecond
      }

      if (firstCompletesFirst) {
        await completeFirst()
        await completeSecond()
      } else {
        await completeSecond()
        await completeFirst()
      }

      expect(imagePositions(editor)).toHaveLength(2)
      expect(editor.getHTML()).toContain('https://example.com/a.png')
      expect(editor.getHTML()).toContain('https://example.com/b.png')
      expect(imageUploadPlaceholderKey.getState(editor.state)?.placeholders).toEqual([])
    },
  )

  it('挿入位置から後ろを消しても、挿入位置そのものが残っていれば挿入する', async () => {
    const editor = createEditor('<p>hello</p><p>world</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 1, () => deferred.promise)

    editor.chain().setTextSelection({ from: 1, to: 13 }).deleteSelection().run()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(1)
  })

  it.each([
    ['次の段落と結合', (editor: Editor) => editor.chain().setTextSelection(6).joinForward().run()],
    [
      '見出しへ変更',
      (editor: Editor) => editor.chain().setTextSelection(6).setNode('heading', { level: 2 }).run(),
    ],
  ])('挿入位置の直後で%sしても、挿入位置が残っていれば挿入する', async (_, edit) => {
    const editor = createEditor('<p>hello</p><p>world</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 6, () => deferred.promise)

    edit(editor)
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(1)
  })

  it('表の列ごと消したら、表の中へは挿入しない', async () => {
    const editor = createEditor('<table><tr><td><p>a</p></td><td><p></p></td></tr></table>', [
      'image',
      'table',
    ])
    let emptyCellPos = 0
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'paragraph' && node.content.size === 0) emptyCellPos = pos + 1
    })
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), emptyCellPos, () => deferred.promise)

    editor.chain().setTextSelection(emptyCellPos).deleteColumn().run()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(0)
    expect(editor.getHTML().match(/<table/g)).toHaveLength(1)
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
