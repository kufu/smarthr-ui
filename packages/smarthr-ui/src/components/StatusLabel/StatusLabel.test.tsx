import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { create } from 'react-test-renderer'

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
    const testRenderer = create(<StatusLabel>{hello}</StatusLabel>)
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })
  it('should render given children', () => {
    act(() => {
      createRoot(container).render(<StatusLabel>{hello}</StatusLabel>)
    })
    expect(container.textContent).toBe(hello)
  })
  it('should have given type', () => {
    const testInstance = create(<StatusLabel type="grey">{hello}</StatusLabel>).root
    expect(testInstance.props.type).toBe('grey')
  })
})
