// import { create } from 'react-test-renderer'
import React from 'react'
import ReactDOM from 'react-dom'
import { FlashMessage } from './FlashMessage'

describe('FlashMessage', () => {
  let container: HTMLDivElement
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.removeChild(container)
  })
  it('should render if prop visible is true', () => {
    ReactDOM.render(
      <FlashMessage type="success" text="flash!!" onClose={jest.fn()} visible={true} />,
      container,
    )
    expect(container.textContent).toEqual(expect.stringContaining('flash!!'))
  })
  it('should not render if prop visible is false', () => {
    ReactDOM.render(
      <FlashMessage type="success" text="flash!!" onClose={jest.fn()} visible={false} />,
      container,
    )
    expect(container.textContent).toEqual(expect.not.stringContaining('flash!!'))
  })

  it('should call onClose on click close button', () => {
    const spy = jest.fn()
    ReactDOM.render(
      <FlashMessage type="success" text="flash!!" onClose={spy} visible={true} />,
      container,
    )

    document.querySelector<HTMLButtonElement>('button.close')!.click()

    expect(spy).toHaveBeenCalled()
  })
})
