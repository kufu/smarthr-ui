/* eslint-disable smarthr/best-practice-for-text-component */
import { render } from '@testing-library/react'
import { createRef } from 'react'

import { Text } from './Text'

describe('Text', () => {
  // TODO: forwardRefの利用をやめたら不要になる可能性がある。その際は削除を検討する
  test('ref を転送する', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Text ref={ref}>テキスト</Text>)

    expect(ref.current?.tagName).toBe('SPAN')
  })
})
