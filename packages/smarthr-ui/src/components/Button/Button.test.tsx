import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'
import { FaCircleInfoIcon } from '../Icon'

import { Button } from './Button'

describe('Button', () => {
  describe('翻訳中の loading 切り替え', () => {
    it('翻訳で置換されたテキストノードを loading 解除時に削除できる', () => {
      const { rerender } = render(
        <IntlProvider locale="ja">
          <Button loading>button</Button>
        </IntlProvider>,
      )

      const status = document.querySelector(
        '.smarthr-ui-LiveRegion-visuallyHiddenText[role="status"]',
      )
      expect(status).not.toBeNull()

      const visibleContent = status!.parentElement!.querySelector(
        '.smarthr-ui-LiveRegion-visibleContent',
      )
      expect(visibleContent).not.toBeNull()
      expect(visibleContent).toHaveTextContent('処理中')

      const walker = document.createTreeWalker(visibleContent!, NodeFilter.SHOW_TEXT)
      const translatedText = walker.nextNode() as Text
      expect(translatedText).not.toBeNull()

      // Browser translation tools replace text nodes with elements such as <font>.
      const translatedElement = document.createElement('font')
      translatedElement.textContent = translatedText.textContent
      translatedText.parentNode!.replaceChild(translatedElement, translatedText)

      expect(() => {
        rerender(
          <IntlProvider locale="ja">
            <Button loading={false}>button</Button>
          </IntlProvider>,
        )
      }).not.toThrow()
    })
  })

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
