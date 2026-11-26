import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { render, screen, waitFor } from '@testing-library/react'
import postcss from 'postcss'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import tailwindcss from 'tailwindcss'
import { beforeAll, describe, expect, it } from 'vitest'

import { RichTextEditor, RichTextViewer } from '../components/RichTextEditor'

import type { RichTextJSON, RichTextViewerProps } from '../components/RichTextEditor'

// new URL で組み立てないのは、jsdom の URL になり、fileURLToPath が受け付けないため
const ENTRY = join(dirname(fileURLToPath(import.meta.url)), 'index.css')

const band = { blockBackgroundColor: '#67b27f' }
const text = (value: string) => [{ type: 'text', text: value }]
const bulletList = (value: string, attrs?: object) => ({
  ...(attrs ? { attrs } : {}),
  type: 'bulletList',
  content: [{ type: 'listItem', content: [{ type: 'paragraph', content: text(value) }] }],
})
const CONTENT: RichTextJSON = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { ...band, level: 2 }, content: text('帯の見出し') },
    { type: 'paragraph', attrs: band, content: text('帯の段落') },
    { type: 'paragraph', content: text('段落1') },
    { type: 'paragraph', content: text('段落2') },
    bulletList('帯の項目', band),
    bulletList('項目'),
    { type: 'paragraph', attrs: band },
    { type: 'paragraph' },
  ],
}

beforeAll(async () => {
  const { css } = await postcss([tailwindcss()]).process(readFileSync(ENTRY, 'utf8'), {
    from: ENTRY,
  })
  const style = document.createElement('style')

  style.textContent = css
  document.head.appendChild(style)
}, 60_000)

const blocksOf = (root: Element) => {
  const [heading, bandParagraph, paragraph1, paragraph2, bandList, list, emptyBand, empty] =
    Array.from(root.children).map((el) => getComputedStyle(el))

  return { heading, bandParagraph, paragraph1, paragraph2, bandList, list, emptyBand, empty }
}

const renderViewer = (gap?: RichTextViewerProps['gap']) => {
  const { container } = render(<RichTextViewer content={CONTENT} gap={gap} />)

  return container.firstElementChild!
}

const renderEditor = async () => {
  render(
    <IntlProvider locale="ja">
      <EnvironmentProvider>
        <RichTextEditor
          defaultValue={CONTENT}
          features={['heading', 'bulletList', 'backgroundColor', 'blockBackgroundColor']}
        />
      </EnvironmentProvider>
    </IntlProvider>,
  )

  return waitFor(() => screen.getByRole('textbox'))
}

describe('幅全体の背景色の CSS', () => {
  it('エディタと Viewer で帯に同じ余白を当て、左右は文字の大きさによらず 16px で、リストは記号の字下げのぶんを足す', async () => {
    const viewer = blocksOf(renderViewer())
    const editor = blocksOf(await renderEditor())

    for (const blocks of [viewer, editor]) {
      expect(blocks.heading.fontSize).not.toBe(blocks.bandParagraph.fontSize)
      for (const block of [blocks.heading, blocks.bandParagraph]) {
        expect([block.paddingLeft, block.paddingRight]).toEqual(['16px', '16px'])
      }
      expect(blocks.bandParagraph.paddingTop).not.toBe('0px')
      expect(parseFloat(blocks.bandList.paddingLeft)).toBe(
        parseFloat(blocks.list.paddingLeft) + parseFloat(blocks.bandParagraph.paddingLeft),
      )
      expect(blocks.paragraph1.paddingLeft).toBe('0px')
    }
    expect(
      (['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const).map((property) => [
        viewer.bandParagraph[property],
        viewer.heading[property],
        viewer.bandList[property],
      ]),
    ).toEqual(
      (['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const).map((property) => [
        editor.bandParagraph[property],
        editor.heading[property],
        editor.bandList[property],
      ]),
    )
  })

  it('エディタと gap を指定しない Viewer では帯どうしをつなげ、帯の無いブロックとの間は今の間隔のまま', async () => {
    for (const blocks of [blocksOf(renderViewer()), blocksOf(await renderEditor())]) {
      expect(blocks.heading.marginBottom).toBe('0px')
      expect(blocks.bandParagraph.marginTop).toBe('0px')
      expect(blocks.bandList.marginTop).toBe(blocks.list.marginTop)
      expect(blocks.bandList.marginTop).not.toBe('0px')
    }
  })

  it('Viewer で gap を指定すると、帯の間にも同じ gap を空ける', () => {
    const blocks = blocksOf(renderViewer(2))

    expect(blocks.bandParagraph.marginTop).not.toBe('0px')
    expect(blocks.bandParagraph.marginTop).toBe(blocks.paragraph2.marginTop)
  })

  it('Viewer の空の帯は、エディタの空の段落と同じく 1 行ぶんの文字を持ち、帯の無い空の段落は今までどおり持たない', () => {
    const root = renderViewer()
    const [emptyBand, empty] = Array.from(root.children).slice(-2)

    expect(getComputedStyle(emptyBand, '::after').content).toBe('"​"')
    expect(getComputedStyle(empty, '::after').content).toBe('none')
  })
})
