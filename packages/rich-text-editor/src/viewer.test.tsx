import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RichTextViewer as MainEntryViewer } from './components/RichTextEditor'
import { RichTextViewer } from './viewer'

const content = { format: 'html', content: '<p>本文</p>' } as const

// /viewer は smarthr-ui 本体を読み込まず、メインは読み込む。どちらでも同じ結果になることを確かめる
describe.each([
  ['/viewer', RichTextViewer],
  ['メイン', MainEntryViewer],
])('%s エントリの RichTextViewer', (_, Viewer) => {
  it('className で既定のクラスを上書きできる', () => {
    const { container } = render(
      <Viewer content={content} className="shr-leading-tight shr-text-grey" />,
    )
    const classList = [...(container.firstElementChild?.classList ?? [])]

    expect(classList).toContain('shr-text-grey')
    expect(classList).not.toContain('shr-text-black')
    expect(classList).toContain('shr-leading-tight')
    expect(classList).not.toContain('shr-leading-loose')
  })
})
