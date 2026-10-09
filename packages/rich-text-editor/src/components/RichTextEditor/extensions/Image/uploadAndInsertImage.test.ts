import { Editor } from '@tiptap/core'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { configureExtensions } from '../configureExtensions'

import { imageUploadPlaceholderKey, resetImagePlaceholders } from './imageUploadPlaceholder'
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

// 空の段落の中の位置。content が空でない段落は対象にしない
const emptyParagraphPos = (editor: Editor) => {
  let found = -1
  editor.state.doc.descendants((node, pos) => {
    if (found === -1 && node.type.name === 'paragraph' && node.content.size === 0) found = pos + 1
  })

  return found
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

  it('挿入箇所を含む範囲を削除したら、削除した位置に挿入する', async () => {
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

    expect(imagePositions(editor)).toEqual([7])
    expect(onImageUploadError).not.toHaveBeenCalled()
  })

  it('文書が差し替えられたら挿入しない', async () => {
    const editor = createEditor('<p>hello</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 3, () => deferred.promise)

    editor
      .chain()
      .setContent('<p>replaced</p>')
      .command(({ tr }) => {
        resetImagePlaceholders(tr)

        return true
      })
      .run()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(imagePositions(editor)).toHaveLength(0)
    expect(editor.getText()).toBe('replaced')
  })

  it('内容が同じでも全消去をまたいだら挿入しない', async () => {
    const editor = createEditor('')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 1, () => deferred.promise)

    editor
      .chain()
      .clearContent()
      .command(({ tr }) => {
        resetImagePlaceholders(tr)

        return true
      })
      .run()
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

  it('表の列ごと消したら、表を割らずに表の後へ挿入する', async () => {
    const editor = createEditor('<table><tr><td><p>a</p></td><td><p></p></td></tr></table>', [
      'image',
      'table',
    ])
    const deferred = createDeferred<ImageUploadResult>()
    const at = emptyParagraphPos(editor)
    const done = uploadAndInsertImage(editor, file(), at, () => deferred.promise)

    editor.chain().setTextSelection(at).deleteColumn().run()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(editor.getHTML().match(/<table/g)).toHaveLength(1)
    expect(editor.getHTML()).toMatch(/<\/table>.*a\.png/s)
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

  it('空の段落で続けてアップロードすると、完了した順に2枚とも入る', async () => {
    const editor = createEditor('<p>x</p><p></p><p>y</p>')
    const first = createDeferred<ImageUploadResult>()
    const second = createDeferred<ImageUploadResult>()
    const firstDone = uploadAndInsertImage(editor, file(), 4, () => first.promise)
    const secondDone = uploadAndInsertImage(editor, file(), 4, () => second.promise)

    first.resolve({ src: 'https://example.com/a.png' })
    await firstDone
    second.resolve({ src: 'https://example.com/b.png' })
    await secondDone

    expect(imagePositions(editor)).toHaveLength(2)
    expect(editor.getHTML()).toMatch(/<p>x<\/p>.*a\.png.*b\.png.*<p>y<\/p>/s)
  })

  it.each([
    [
      '水平線',
      ['image', 'horizontalRule'],
      (editor: Editor) => editor.commands.setHorizontalRule(),
      /<hr>.*a\.png/s,
    ],
    [
      '表',
      ['image', 'table'],
      (editor: Editor) => editor.commands.insertTable({ rows: 1, cols: 1 }),
      /<\/table>.*a\.png/s,
    ],
  ] as const)(
    'アップロード中の空の段落を%sに置き換えても、その後に入る',
    async (_, features, replace, expected) => {
      const editor = createEditor('<p>x</p><p></p><p>y</p>', [...features])
      const deferred = createDeferred<ImageUploadResult>()
      const done = uploadAndInsertImage(editor, file(), 4, () => deferred.promise)

      editor.commands.setTextSelection(4)
      replace(editor)
      deferred.resolve({ src: 'https://example.com/a.png' })
      await done

      expect(imagePositions(editor)).toHaveLength(1)
      expect(editor.getHTML()).toMatch(expected)
    },
  )

  it('リスト項目を消したら、リストを壊さずにリストの後へ入る', async () => {
    const editor = createEditor('<ul><li><p>a</p></li><li><p></p></li><li><p>c</p></li></ul>', [
      'image',
      'bulletList',
    ])
    const at = emptyParagraphPos(editor)
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), at, () => deferred.promise)

    const $at = editor.state.doc.resolve(at)
    editor.view.dispatch(editor.state.tr.delete($at.before(-1), $at.after(-1)))
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(editor.getHTML()).toMatch(/<ul><li><p>a<\/p><\/li><li><p>c<\/p><\/li><\/ul>.*a\.png/s)
  })

  it('引用の中の表で列を消したら、引用の中の表の後へ入る', async () => {
    const editor = createEditor(
      '<blockquote><table><tr><td><p>a</p></td><td><p></p></td></tr></table></blockquote>',
      ['image', 'table', 'blockquote'],
    )
    const at = emptyParagraphPos(editor)
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), at, () => deferred.promise)

    editor.chain().setTextSelection(at).deleteColumn().run()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(editor.getHTML()).toMatch(/<\/table>.*a\.png.*<\/blockquote>/s)
  })

  it('アップロード中の空の段落を Backspace で消したら、前の段落の後に入る', async () => {
    const editor = createEditor('<p>x</p><p></p><p>y</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 4, () => deferred.promise)

    editor.chain().setTextSelection(4).joinBackward().run()
    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(editor.getHTML()).toMatch(/<p>x<\/p>.*a\.png.*<p>y<\/p>/s)
  })

  it('段落の文字の間では位置を動かさず、段落を分けて入る', async () => {
    const editor = createEditor('<p>hello</p>')
    const deferred = createDeferred<ImageUploadResult>()
    const done = uploadAndInsertImage(editor, file(), 3, () => deferred.promise)

    expect(imageUploadPlaceholderKey.getState(editor.state)?.placeholders[0]?.pos).toBe(3)

    deferred.resolve({ src: 'https://example.com/a.png' })
    await done

    expect(editor.getHTML()).toMatch(/<p>he<\/p>.*a\.png.*<p>llo<\/p>/s)
  })

  it('アップロード中の表示は、挿入先と同じ位置に移る', () => {
    const editor = createEditor('<table><tr><td><p>a</p></td><td><p></p></td></tr></table>', [
      'image',
      'table',
    ])
    const at = emptyParagraphPos(editor)
    uploadAndInsertImage(editor, file(), at, () => new Promise(() => {}))

    editor.chain().setTextSelection(at).deleteColumn().run()

    const afterTable = editor.state.doc.child(0).nodeSize
    const state = imageUploadPlaceholderKey.getState(editor.state)
    expect(state?.placeholders.map(({ pos }) => pos)).toEqual([afterTable])
    expect(state?.decorations.find().map(({ from }) => from)).toEqual([afterTable])
  })
})
