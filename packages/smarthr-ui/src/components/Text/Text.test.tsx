/* eslint-disable smarthr/best-practice-for-text-component */
import { render } from '@testing-library/react'
import { createRef } from 'react'

import { Text } from './Text'

describe('Text', () => {
  // HINT: React 19 は ref を通常の props として扱うため forwardRef がなくても動いてしまい、
  // 挙動のテストだけでは React 18 でのデグレを検知できない。そのため構造そのものを検証する
  test('React 18 でも ref を転送できるよう memo(forwardRef()) でラップされている', () => {
    const memoized = Text as unknown as { $$typeof: symbol; type: { $$typeof: symbol } }

    expect(memoized.$$typeof).toBe(Symbol.for('react.memo'))
    expect(memoized.type.$$typeof).toBe(Symbol.for('react.forward_ref'))
  })

  test('ref を転送する', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Text ref={ref}>テキスト</Text>)

    expect(ref.current?.tagName).toBe('SPAN')
  })
})
