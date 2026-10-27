import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'
import { FaCircleInfoIcon } from '../Icon'

import { Button } from './Button'

describe('Button', () => {
  describe('disabled時のアイコン色', () => {
    it('固定colorを持つprefixアイコンでも、aria-disabled時に無効化色へ揃えるクラスが付与される', () => {
      render(
        <IntlProvider locale="ja">
          <Button disabled prefix={<FaCircleInfoIcon color="MAIN" />}>
            button
          </Button>
        </IntlProvider>,
      )
      const wrapper = screen.getByRole('button')
      expect(wrapper).toHaveClass('[&_.smarthr-ui-Icon]:aria-disabled:!shr-text-color-inherit')
      expect(wrapper).toHaveClass('[&_.smarthr-ui-Icon]:aria-disabled:shr-fill-current')
    })
  })

  describe('disabledReason', () => {
    it('オブジェクト形式で指定した場合、ツールチップに理由が表示される(従来通り)', () => {
      render(
        <IntlProvider locale="ja">
          <Button disabled disabledReason={{ message: 'ボタンが無効な理由' }}>
            button
          </Button>
        </IntlProvider>,
      )

      expect(screen.getByText('ボタンが無効な理由')).toBeInTheDocument()
    })

    it('ReactNode(文字列)を直接指定した場合も、ツールチップに理由が表示される', () => {
      render(
        <IntlProvider locale="ja">
          <Button disabled disabledReason="ボタンが無効な理由">
            button
          </Button>
        </IntlProvider>,
      )

      expect(screen.getByText('ボタンが無効な理由')).toBeInTheDocument()
    })

    it('disabled でない場合、disabledReason を指定しても無効化ラッパーが描画されない', () => {
      const { container } = render(
        <IntlProvider locale="ja">
          <Button disabledReason="ボタンが無効な理由">button</Button>
        </IntlProvider>,
      )

      expect(container.querySelector('.smarthr-ui-Button-disabledWrapper')).not.toBeInTheDocument()
      expect(screen.queryByText('ボタンが無効な理由')).not.toBeInTheDocument()
    })
  })

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
          <Button disabled onClick={onClick}>
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
          <Button loading onClick={onClick}>
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
