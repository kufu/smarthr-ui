import { create } from 'react-test-renderer'
import React from 'react'
import ReactDOM from 'react-dom'

import { CheckBox } from './CheckBox'

describe('CheckBox', () => {
  let container: HTMLDivElement
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.removeChild(container)
  })
  it('should be match snapshot', () => {
    const testRenderer = create(<CheckBox name="sample" checked={true} />)
    expect(testRenderer.toJSON()).toMatchSnapshot()
  })

  it('should be render with value of name and checked attribute', () => {
    const name = 'sample'
    const checked = false
    ReactDOM.render(<CheckBox name={name} checked={checked} />, container)

    expect(document.querySelector('input')!.name).toBe(name)
    expect(document.querySelector('input')!.checked).toBe(checked)
  })

  it('should be render check icon if checked attribute is true', () => {
    const name = 'sample'
    const checked = true
    ReactDOM.render(<CheckBox name={name} checked={checked} />, container)

    expect(document.querySelectorAll('svg')).toHaveLength(1)
    expect(document.querySelector('input')!.checked).toBe(checked)
  })

  it('should be not render check icon if checked attribute is false', () => {
    const name = 'sample'
    const checked = false
    ReactDOM.render(<CheckBox name={name} checked={checked} />, container)

    expect(document.querySelectorAll('svg')).toHaveLength(0)
    expect(document.querySelector('input')!.checked).toBe(checked)
  })

  it('should be call onChange with name and checked', () => {
    const name = 'sample'
    const checked = true
    let target: HTMLInputElement
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      target = e.target
    }
    ReactDOM.render(<CheckBox name={name} checked={checked} onChange={onChange} />, container)
    container.querySelector('input')!.click()
    // @ts-expect-error
    expect(target.name).toBe('sample')
    // @ts-expect-error
    expect(target.checked).toBeTruthy()
  })
})
