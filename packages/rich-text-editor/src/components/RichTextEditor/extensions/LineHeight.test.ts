import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { describe, expect, it } from 'vitest'

import { LINE_HEIGHTS, LineHeight, isAllowedLineHeight } from './LineHeight'

const createEditor = () =>
  new Editor({
    extensions: [StarterKit, LineHeight.configure({ types: ['paragraph', 'heading'] })],
    content: '<p>hello</p>',
  })

describe('LineHeight 拡張', () => {
  it('LINE_HEIGHTS は 1/1.25/1.5/1.75/2 を持つ', () => {
    expect(LINE_HEIGHTS).toEqual(['1', '1.25', '1.5', '1.75', '2'])
  })

  it('setLineHeight で paragraph に lineHeight 属性が入る', () => {
    const editor = createEditor()
    editor.commands.selectAll()
    editor.commands.setLineHeight('1.5')
    expect(editor.getAttributes('paragraph').lineHeight).toBe('1.5')
    editor.destroy()
  })

  it('renderHTML で line-height の style が出力される', () => {
    const editor = createEditor()
    editor.commands.selectAll()
    editor.commands.setLineHeight('2')
    expect(editor.getHTML()).toContain('line-height: 2')
    editor.destroy()
  })

  it('unsetLineHeight で属性が消える', () => {
    const editor = createEditor()
    editor.commands.selectAll()
    editor.commands.setLineHeight('1.5')
    editor.commands.unsetLineHeight()
    expect(editor.getAttributes('paragraph').lineHeight ?? null).toBeNull()
    expect(editor.getHTML()).not.toContain('line-height')
    editor.destroy()
  })

  it('allowlist 外の値は適用されない', () => {
    const editor = createEditor()
    editor.commands.selectAll()
    editor.commands.setLineHeight('99')
    expect(editor.getAttributes('paragraph').lineHeight ?? null).toBeNull()
    editor.commands.setLineHeight('1.5;color:red')
    expect(editor.getAttributes('paragraph').lineHeight ?? null).toBeNull()
    editor.destroy()
  })

  it('parseHTML は allowlist 外の line-height を取り込まない', () => {
    const editor = new Editor({
      extensions: [StarterKit, LineHeight.configure({ types: ['paragraph', 'heading'] })],
      content: '<p style="line-height: 3">x</p>',
    })
    expect(editor.getAttributes('paragraph').lineHeight ?? null).toBeNull()
    editor.destroy()
  })

  it('parseHTML は allowlist 内の line-height を取り込む', () => {
    const editor = new Editor({
      extensions: [StarterKit, LineHeight.configure({ types: ['paragraph', 'heading'] })],
      content: '<p style="line-height: 1.5">x</p>',
    })
    expect(editor.getAttributes('paragraph').lineHeight).toBe('1.5')
    editor.destroy()
  })
})

describe('isAllowedLineHeight', () => {
  it('allowlist 内の値で true を返す', () => {
    expect(isAllowedLineHeight('1')).toBe(true)
    expect(isAllowedLineHeight('2')).toBe(true)
  })

  it('allowlist 外・非文字列で false を返す', () => {
    expect(isAllowedLineHeight('99')).toBe(false)
    expect(isAllowedLineHeight('1;color:red')).toBe(false)
    expect(isAllowedLineHeight(null)).toBe(false)
    expect(isAllowedLineHeight(1.5)).toBe(false)
  })
})
