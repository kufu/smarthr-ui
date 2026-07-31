import { act, fireEvent, render, screen } from '@testing-library/react'

import { Button } from '../Button'
import { FaPencilIcon } from '../Icon'

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  describe('tabIndex', () => {
    it('children がフォーカス可能な要素の場合、wrapper に tabIndex が設定されない', () => {
      render(
        <Tooltip message="説明">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      const wrapper = screen.getByRole('button', { name: 'ボタン' }).closest('.smarthr-ui-Tooltip')!
      expect(wrapper).not.toHaveAttribute('tabindex')
    })

    it('children がフォーカス不可能な要素の場合、wrapper に tabIndex=0 が設定される', () => {
      render(<Tooltip message="説明">テキスト</Tooltip>)
      const wrapper = screen.getByText('テキスト').closest('.smarthr-ui-Tooltip')!
      expect(wrapper).toHaveAttribute('tabindex', '0')
    })

    it('tabIndex を明示的に指定した場合、その値が使われる', () => {
      render(
        // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
        <Tooltip message="説明" tabIndex={-1}>
          <Button>ボタン</Button>
        </Tooltip>,
      )
      const wrapper = screen.getByRole('button', { name: 'ボタン' }).closest('.smarthr-ui-Tooltip')!
      expect(wrapper).toHaveAttribute('tabindex', '-1')
    })
  })

  describe('type="description"（デフォルト）', () => {
    it('children が focusable な場合、message が children の accessible description になる', () => {
      render(
        <Tooltip message="説明テキスト">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      expect(
        screen.getByRole('button', { name: 'ボタン', description: '説明テキスト' }),
      ).toBeInTheDocument()
    })

    it('children が non-focusable な場合、wrapper に aria-describedby が付与される', () => {
      render(<Tooltip message="説明テキスト">テキスト</Tooltip>)
      const wrapper = screen.getByText('テキスト').closest('.smarthr-ui-Tooltip')!
      expect(wrapper).toHaveAttribute('aria-describedby')
      const describedbyId = wrapper.getAttribute('aria-describedby')!
      expect(document.getElementById(describedbyId)).toHaveTextContent('説明テキスト')
    })

    it('children が focusable なとき ariaDescribedbyTarget="wrapper" を指定しても children の accessible description になる', () => {
      render(
        <Tooltip message="説明テキスト" ariaDescribedbyTarget="wrapper">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      expect(
        screen.getByRole('button', { name: 'ボタン', description: '説明テキスト' }),
      ).toBeInTheDocument()
    })
  })

  describe('type="label"', () => {
    it('message が children のアクセシブルネームになる', () => {
      render(
        <Tooltip type="label" message="保存">
          <Button>
            <FaPencilIcon />
          </Button>
        </Tooltip>,
      )
      expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
    })
  })

  // 非表示中に幅計算が走って壊れた maxWidth が inline style に残り、再表示しても直らない不具合の回帰テスト
  describe('非表示時の位置計算スタイルのクリア', () => {
    const showTooltip = (wrapper: Element) => fireEvent.pointerEnter(wrapper)
    const hideTooltip = (wrapper: Element) => fireEvent.pointerLeave(wrapper)
    const getPopup = () => document.querySelector('.smarthr-ui-Tooltip-popup') as HTMLElement

    it('ツールチップを閉じると、表示中に算出した位置計算の inline style が残らない', () => {
      render(
        <Tooltip message="説明">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      const wrapper = screen.getByRole('button', { name: 'ボタン' }).closest('.smarthr-ui-Tooltip')!

      showTooltip(wrapper)
      // 表示中は位置計算の style が付与される
      expect(getPopup().style.maxWidth).not.toBe('')

      hideTooltip(wrapper)
      // 非表示になったら位置計算の style を引きずらない
      expect(getPopup().style.maxWidth).toBe('')
    })

    it('非表示中に window の resize が発火しても、位置計算の inline style が付与されない', () => {
      vi.useFakeTimers()
      try {
        render(
          <Tooltip message="説明">
            <Button>ボタン</Button>
          </Tooltip>,
        )
        const wrapper = screen
          .getByRole('button', { name: 'ボタン' })
          .closest('.smarthr-ui-Tooltip')!

        showTooltip(wrapper)
        hideTooltip(wrapper)

        // 非表示中の resize（debounce 100ms）を発火させる
        act(() => {
          window.dispatchEvent(new Event('resize'))
          vi.advanceTimersByTime(100)
        })

        expect(getPopup().style.maxWidth).toBe('')
      } finally {
        vi.useRealTimers()
      }
    })
  })
})
