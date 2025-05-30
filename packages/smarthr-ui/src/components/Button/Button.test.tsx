import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'

import { Button } from './Button'

describe('Button', () => {
  describe('onClick', () => {
    it('disabled / loading でない場合、発火する', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick}>button</Button>)
      screen.getByText('button').click()
      expect(onClick).toHaveBeenCalled()
    })

    it('disabled の場合、発火しない', () => {
      const onClick = vi.fn()
      render(
        <IntlProvider locale="ja">
          <Button onClick={onClick} disabled>
            button
          </Button>
        </IntlProvider>,
      )
      screen.getByText('button').click()
      expect(onClick).not.toHaveBeenCalled()
    })

    it('loading の場合、発火しない', () => {
      const onClick = vi.fn()
      render(
        <IntlProvider locale="ja">
          <Button onClick={onClick} loading>
            button
          </Button>
        </IntlProvider>,
      )
      screen.getByText('button').click()
      expect(onClick).not.toHaveBeenCalled()
    })

    describe('form 要素でラップされている場合', () => {
      it('disabled / loading でない場合、発火する', () => {
        const onSubmit = vi.fn((e) => e.preventDefault())
        render(
          <IntlProvider locale="ja">
            <form onSubmit={onSubmit}>
              <Button type="submit">button</Button>
            </form>
          </IntlProvider>,
        )
        screen.getByText('button').click()
        expect(onSubmit).toHaveBeenCalled()
      })

      it('disabled の場合、発火しない', () => {
        const onSubmit = vi.fn()
        render(
          <IntlProvider locale="ja">
            <form onSubmit={onSubmit}>
              <Button type="submit" disabled>
                button
              </Button>
            </form>
          </IntlProvider>,
        )
        screen.getByText('button').click()
        expect(onSubmit).not.toHaveBeenCalled()
      })

      it('loading の場合、発火しない', () => {
        const onSubmit = vi.fn()
        render(
          <IntlProvider locale="ja">
            <form onSubmit={onSubmit}>
              <Button type="submit" loading>
                button
              </Button>
            </form>
          </IntlProvider>,
        )
        screen.getByText('button').click()
        expect(onSubmit).not.toHaveBeenCalled()
      })
    })
  })
})
