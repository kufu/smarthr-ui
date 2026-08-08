import { describe, expect, it } from 'vitest'

import { formatShortcutTokens, toAriaKeyShortcuts } from './shortcutKeys'

describe('formatShortcutTokens', () => {
  it('Apple では Mod を ⌘ にする', () => {
    expect(formatShortcutTokens('Mod-B', true)).toEqual(['⌘', 'B'])
  })

  it('Apple 以外では Mod を Ctrl にする', () => {
    expect(formatShortcutTokens('Mod-B', false)).toEqual(['Ctrl', 'B'])
  })

  it('修飾キーを Control, Alt, Shift, Meta の順に並べ替える', () => {
    expect(formatShortcutTokens('Mod-Shift-S', true)).toEqual(['⇧', '⌘', 'S'])
    expect(formatShortcutTokens('Mod-Alt-C', true)).toEqual(['⌥', '⌘', 'C'])
  })

  it('入力の並び順に関わらず出力順は一定になる', () => {
    expect(formatShortcutTokens('Shift-Mod-Z', true)).toEqual(['⇧', '⌘', 'Z'])
    expect(formatShortcutTokens('Mod-Shift-Z', true)).toEqual(['⇧', '⌘', 'Z'])
  })

  it('Apple 以外では修飾キーを語で表す', () => {
    expect(formatShortcutTokens('Mod-Shift-S', false)).toEqual(['Ctrl', 'Shift', 'S'])
    expect(formatShortcutTokens('Mod-Alt-C', false)).toEqual(['Ctrl', 'Alt', 'C'])
  })

  it('Mod を含まないショートカットも扱える', () => {
    expect(formatShortcutTokens('Alt-Enter', true)).toEqual(['⌥', '⏎'])
    expect(formatShortcutTokens('Alt-Enter', false)).toEqual(['Alt', 'Enter'])
  })

  it('数字キーはそのまま表示する', () => {
    expect(formatShortcutTokens('Mod-Shift-8', false)).toEqual(['Ctrl', 'Shift', '8'])
  })

  it('英字は大文字に揃える', () => {
    expect(formatShortcutTokens('Mod-b', false)).toEqual(['Ctrl', 'B'])
  })
})

describe('toAriaKeyShortcuts', () => {
  it('Apple では Mod を Meta にする', () => {
    expect(toAriaKeyShortcuts('Mod-B', true)).toBe('Meta+B')
  })

  it('Apple 以外では Mod を Control にする', () => {
    expect(toAriaKeyShortcuts('Mod-B', false)).toBe('Control+B')
  })

  it('記号ではなく仕様上の修飾キー名を使う', () => {
    expect(toAriaKeyShortcuts('Mod-Shift-S', true)).toBe('Shift+Meta+S')
    expect(toAriaKeyShortcuts('Mod-Shift-S', false)).toBe('Control+Shift+S')
  })

  it('Mod を含まないショートカットも扱える', () => {
    expect(toAriaKeyShortcuts('Alt-Enter', false)).toBe('Alt+Enter')
  })
})
