// @vitest-environment node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import { beforeAll, describe, expect, it } from 'vitest'

const ENTRY = fileURLToPath(new URL('./index.css', import.meta.url))

const unescape = (selector: string) => selector.replace(/\\/g, '')

describe('エディタの CSS', () => {
  const selectors: string[] = []

  beforeAll(async () => {
    const { root } = await postcss([tailwindcss()]).process(readFileSync(ENTRY, 'utf8'), {
      from: ENTRY,
    })
    root.walkRules((rule) => {
      selectors.push(unescape(rule.selector))
    })
  }, 60_000)

  it('本体と同じ接頭辞のクラスを含まない', () => {
    expect(selectors.filter((selector) => /(?<![-\w])-?shr-(?!rte-)/.test(selector))).toEqual([])
  })

  it('置換で崩れやすい形のクラスも生成される', () => {
    expect(selectors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('.shr-rte--translate-x-1/2'),
        expect.stringContaining('.shr-rte-group/cell'),
        expect.stringContaining('.[&_.ProseMirror_ul]:shr-rte-my-0.5'),
        expect.stringContaining('.group-hover/cell:shr-rte-h-[28px]'),
        expect.stringContaining('.shr-rte-border-shorthand'),
      ]),
    )
  })
})
