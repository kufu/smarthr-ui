import { render } from '@testing-library/react'
import { createRef } from 'react'

import { VisuallyHiddenText } from './VisuallyHiddenText'

describe('VisuallyHiddenText', () => {
  // TODO: forwardRefの利用をやめたら不要になる可能性がある。その際は削除を検討する
  test('ref を転送する', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<VisuallyHiddenText ref={ref}>テキスト</VisuallyHiddenText>)

    expect(ref.current?.tagName).toBe('SPAN')
  })
})
