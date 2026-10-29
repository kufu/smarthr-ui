import { fireEvent, render, screen } from '@testing-library/react'

import { UnstyledButton } from './UnstyledButton'

describe('UnstyledButton', () => {
  describe('disabled の場合の onKeyDown', () => {
    const onDocumentKeyDown = vi.fn()

    beforeEach(() => {
      onDocumentKeyDown.mockClear()
      document.addEventListener('keydown', onDocumentKeyDown)
    })

    afterEach(() => {
      document.removeEventListener('keydown', onDocumentKeyDown)
    })

    it('Tab と Escape は止めない', () => {
      render(<UnstyledButton disabled>button</UnstyledButton>)
      const button = screen.getByRole('button')

      expect(fireEvent.keyDown(button, { key: 'Tab' })).toBe(true)
      expect(fireEvent.keyDown(button, { key: 'Escape' })).toBe(true)
      expect(onDocumentKeyDown).toHaveBeenCalledTimes(2)
    })

    it('Enter と Space は止める', () => {
      render(<UnstyledButton disabled>button</UnstyledButton>)
      const button = screen.getByRole('button')

      expect(fireEvent.keyDown(button, { key: 'Enter' })).toBe(false)
      expect(fireEvent.keyDown(button, { key: ' ' })).toBe(false)
      expect(onDocumentKeyDown).not.toHaveBeenCalled()
    })

    it('渡された onKeyDown は呼ばれない', () => {
      const onKeyDown = vi.fn()
      render(
        <UnstyledButton disabled onKeyDown={onKeyDown}>
          button
        </UnstyledButton>,
      )

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' })
      expect(onKeyDown).not.toHaveBeenCalled()
    })
  })
})
