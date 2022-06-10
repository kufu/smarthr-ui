import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
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
    act(() => {
      createRoot(container).render(
        <FlashMessage type="success" text="flash!!" onClose={jest.fn()} visible={true} />,
      )
    })
    expect(container.textContent).toEqual(expect.stringContaining('flash!!'))
  })
  it('should not render if prop visible is false', () => {
    act(() => {
      createRoot(container).render(
        <FlashMessage type="success" text="flash!!" onClose={jest.fn()} visible={false} />,
      )
    })
    expect(container.textContent).toEqual(expect.not.stringContaining('flash!!'))
  })

  it('should call onClose on click close button', () => {
    const spy = jest.fn()
    act(() => {
      createRoot(container).render(
        <FlashMessage type="success" text="flash!!" onClose={spy} visible={true} />,
      )
    })
    document.querySelector<HTMLButtonElement>('button.close')!.click()

    expect(spy).toHaveBeenCalled()
  })
})
