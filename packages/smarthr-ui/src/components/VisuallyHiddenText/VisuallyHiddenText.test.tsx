import { render } from '@testing-library/react'
import { createRef } from 'react'

import { VisuallyHiddenText } from './VisuallyHiddenText'

describe('VisuallyHiddenText', () => {
  test('ref を転送する', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<VisuallyHiddenText ref={ref}>テキスト</VisuallyHiddenText>)

    expect(ref.current?.tagName).toBe('SPAN')
  })
})
