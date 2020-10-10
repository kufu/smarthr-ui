import React from 'react'
import ReactDOM from 'react-dom'

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
    ReactDOM.render(
      <Base>
        <p>{hello}</p>
      </Base>,
      container,
    )

    expect(document.querySelectorAll('p')).toHaveLength(1)
    expect(document.querySelector('p')!.textContent).toBe(hello)
  })
})
