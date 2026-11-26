import { createEvent, fireEvent } from '@testing-library/react'
import { Editor } from '@tiptap/core'
import { NodeSelection } from '@tiptap/pm/state'
import { describe, expect, it, onTestFinished } from 'vitest'

import { configureExtensions } from './configureExtensions'

import type { RichTextFeature } from '../types'

const createEditor = (features: readonly RichTextFeature[]) => {
  const editor = new Editor({
    element: document.createElement('div'),
    extensions: configureExtensions({ features }),
    content: {
      type: 'doc',
      content: [
        { type: 'youtube', attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
        { type: 'video', attrs: { src: '/a.mp4' } },
      ],
    },
  })
  onTestFinished(() => editor.destroy())

  return editor
}

const players = (editor: Editor) => Array.from(editor.view.dom.querySelectorAll('iframe, video'))

describe('動画プレーヤーの Tab 移動', () => {
  it.each([
    ['ある', ['youtube', 'video'] as const],
    ['無い', [] as const],
  ])('features に youtube・video が%sとき、編集中は外し、読み取り専用では戻す', (_, features) => {
    const editor = createEditor(features)

    expect(players(editor)).toHaveLength(2)
    for (const player of players(editor)) expect(player).toHaveAttribute('tabindex', '-1')

    editor.setEditable(false)
    for (const player of players(editor)) expect(player).not.toHaveAttribute('tabindex')

    editor.setEditable(true)
    for (const player of players(editor)) expect(player).toHaveAttribute('tabindex', '-1')
  })

  it('属性を変えて描き直した動画も外す', () => {
    const editor = createEditor(['video'])

    editor.chain().setNodeSelection(editor.state.doc.firstChild!.nodeSize).run()
    editor.commands.updateAttributes('video', { width: 200 })

    const video = editor.view.dom.querySelector('video')
    expect(video).toHaveAttribute('width', '200')
    expect(video).toHaveAttribute('tabindex', '-1')
  })
})

const FEATURE_CASES = [
  ['ある', ['video'] as const],
  ['無い', [] as const],
] as const

const selectVideo = (editor: Editor) => {
  const pos = editor.state.doc.firstChild!.nodeSize
  editor.commands.setNodeSelection(pos)

  return pos
}

const selectedNodeName = (editor: Editor) => {
  const { selection } = editor.state

  return selection instanceof NodeSelection ? selection.node.type.name : null
}

const KEYS: Array<[string, number]> = [
  [' ', 32],
  ['k', 75],
  ['Backspace', 8],
  ['Delete', 46],
  ['ArrowLeft', 37],
  ['ArrowRight', 39],
]

const press = (target: Element, key: string, keyCode: number) => {
  const init = { key, keyCode, bubbles: true, cancelable: true }
  const keydown = new KeyboardEvent('keydown', init)
  target.dispatchEvent(keydown)

  if (key.length === 1 && !keydown.defaultPrevented) {
    target.dispatchEvent(new KeyboardEvent('keypress', { ...init, charCode: key.charCodeAt(0) }))
  }
}

describe('動画プレーヤーで押したキー', () => {
  it.each(FEATURE_CASES)(
    'features に video が%sとき、選んでいる動画を消したり選択を外したりしない',
    (_, features) => {
      const editor = createEditor(features)
      selectVideo(editor)
      const before = editor.getJSON()
      const video = editor.view.dom.querySelector('video')!

      for (const [key, keyCode] of KEYS) press(video, key, keyCode)

      expect(editor.getJSON()).toEqual(before)
      expect(selectedNodeName(editor)).toBe('video')
    },
  )

  it.each(KEYS)('本文で押した「%s」は、選んでいる動画に効く', (key, keyCode) => {
    const editor = createEditor(['video'])
    selectVideo(editor)

    press(editor.view.dom, key, keyCode)

    expect(selectedNodeName(editor)).not.toBe('video')
  })
})

describe('動画のドラッグ', () => {
  const dragStart = (target: Element) => {
    const event = createEvent.dragStart(target)
    fireEvent(target, event)

    return event
  }

  it.each(FEATURE_CASES)(
    'features に video が%sとき、プレーヤーの中で押して始まったドラッグは止める',
    (_, features) => {
      const editor = createEditor(features)
      const pos = selectVideo(editor)
      const video = editor.view.dom.querySelector('video')!

      fireEvent.pointerDown(video)

      expect(dragStart(editor.view.nodeDOM(pos) as Element).defaultPrevented).toBe(true)
    },
  )

  it('プレーヤーの外で押して始まったドラッグは止めない', () => {
    const editor = createEditor(['video'])
    const pos = selectVideo(editor)
    const nodeDOM = editor.view.nodeDOM(pos) as Element

    fireEvent.pointerDown(editor.view.dom.querySelector('video')!)
    fireEvent.pointerDown(nodeDOM)

    expect(dragStart(nodeDOM).defaultPrevented).toBe(false)
  })
})
