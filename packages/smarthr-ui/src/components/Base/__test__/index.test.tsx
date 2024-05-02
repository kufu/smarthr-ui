import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'

import { Base } from '../Base'

describe('Base', () => {
  let container: HTMLDivElement
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.removeChild(container)
  })
  it('should render given children', () => {
    const hello = 'hello'
    act(() => {
      createRoot(container).render(
        <Base>
          <p>{hello}</p>
        </Base>,
      )
    })

    expect(document.querySelectorAll('p')).toHaveLength(1)
    expect(document.querySelector('p')!.textContent).toBe(hello)
  })
})
