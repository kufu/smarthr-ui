/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render } from '@testing-library/react'
import { createRef } from 'react'

import { Heading } from './Heading'

describe('Heading', () => {
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
