/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render } from '@testing-library/react'
import { createRef } from 'react'

import { Heading } from './Heading'

describe('Heading', () => {
  // HINT: React 19 は ref を通常の props として扱うため forwardRef がなくても動いてしまい、
  // 挙動のテストだけでは React 18 でのデグレを検知できない。そのため構造そのものを検証する
  test('React 18 でも ref を転送できるよう memo(forwardRef()) でラップされている', () => {
    const memoized = Heading as unknown as { $$typeof: symbol; type: { $$typeof: symbol } }

    expect(memoized.$$typeof).toBe(Symbol.for('react.memo'))
    expect(memoized.type.$$typeof).toBe(Symbol.for('react.forward_ref'))
  })

  test('ref を転送する', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(<Heading ref={ref}>見出し</Heading>)

    expect(ref.current?.tagName).toBe('H1')
    expect(ref.current?.textContent).toBe('見出し')
  })

  test('visuallyHidden でも ref を転送する', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <Heading ref={ref} visuallyHidden>
        見出し
      </Heading>,
    )

    expect(ref.current?.tagName).toBe('H1')
    expect(ref.current?.textContent).toBe('見出し')
  })
})
