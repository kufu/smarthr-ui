import { create } from 'react-test-renderer'
import React from 'react'
import ReactDOM from 'react-dom'

import { StatusLabel } from './StatusLabel'

describe('StatusLabel', () => {
  let container: HTMLDivElement
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.removeChild(container)
  })
  const hello = 'hello'
  it('should be match snapshot', () => {
    const testRenderer = create(<StatusLabel type="success">{hello}</StatusLabel>)
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })
  it('should render given children', () => {
    ReactDOM.render(<StatusLabel type="success">{hello}</StatusLabel>, container)
    expect(container.textContent).toBe(hello)
  })
  it('should have given type', () => {
    const testInstance = create(<StatusLabel type="success">{hello}</StatusLabel>).root
    expect(testInstance.props.type).toBe('success')
  })
})
