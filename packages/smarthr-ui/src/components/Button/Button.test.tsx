import React, { act } from 'react'
import { createRoot } from 'react-dom/client'

import { Button } from './Button'

describe('Button', () => {
  let container: HTMLDivElement
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    document.body.removeChild(container)
  })

  describe('onClick', () => {
    it('disabled / loading でない場合、発火する', () => {
      const onClick = jest.fn()
      act(() => {
        createRoot(container).render(<Button onClick={onClick}>button</Button>)
      })
      document.querySelector('button')!.click()
      expect(onClick).toHaveBeenCalled()
    })

    it('disabled / loading の場合、発火しない', () => {
      const onClick = jest.fn()
      act(() => {
        createRoot(container).render(
          <Button onClick={onClick} disabled>
            button
          </Button>,
        )
      })
      document.querySelector('button')!.click()
      expect(onClick).not.toHaveBeenCalled()
    })

    describe('form 要素でラップされている場合', () => {
      it('disabled / loading でない場合、発火しない', () => {
        const onSubmit = jest.fn()
        act(() => {
          createRoot(container).render(
            <form onSubmit={onSubmit}>
              <Button type="submit">button</Button>
            </form>,
          )
        })
        document.querySelector('button')!.click()
        expect(onSubmit).toHaveBeenCalled()
      })

      it('disabled / loading の場合、発火しない', () => {
        const onSubmit = jest.fn()
        act(() => {
          createRoot(container).render(
            <form onSubmit={onSubmit}>
              <Button type="submit" loading>
                button
              </Button>
            </form>,
          )
        })
        document.querySelector('button')!.click()
        expect(onSubmit).not.toHaveBeenCalled()
      })
    })
  })
})
