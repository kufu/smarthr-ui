import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { Button } from '../../Button'
import { FaPencilIcon } from '../../Icon'

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
        <Tooltip tabIndex={-1} message="説明">
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

    it('children の既存の説明にツールチップの説明を追加する', () => {
      const helpId = 'save\u00a0help'
      render(
        <>
          <span id={helpId}>入力内容を確認</span>
          <span id="save-target">下書きが対象</span>
          <Tooltip message="あとから編集できます">
            <Button aria-describedby={`${helpId} save-target`}>保存</Button>
          </Tooltip>
        </>,
      )

      expect(screen.getByRole('button', { name: '保存' })).toHaveAccessibleDescription(
        '入力内容を確認 下書きが対象 あとから編集できます',
      )
    })

    it('children の説明が更新されても、ツールチップの説明を維持する', async () => {
      const renderTooltip = (descriptionId: string) => (
        <>
          <span id="first-help">変更前の説明</span>
          <span id="next-help">変更後の説明</span>
          <Tooltip message="ツールチップの説明">
            <Button aria-describedby={descriptionId}>保存</Button>
          </Tooltip>
        </>
      )
      const { rerender } = render(renderTooltip('first-help'))

      rerender(renderTooltip('next-help'))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '保存' })).toHaveAccessibleDescription(
          '変更後の説明 ツールチップの説明',
        )
      })
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
        // eslint-disable-next-line smarthr/best-practice-for-default-props -- ariaDescribedbyTarget="wrapper"を明示指定した場合の挙動を検証するテストのため
        <Tooltip ariaDescribedbyTarget="wrapper" message="説明テキスト">
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

  it('type を切り替えると、前のツールチップの関連付けを解除する', () => {
    const labelId = 'save-label'
    const renderTooltip = (type?: 'label') => (
      <>
        <span id={labelId}>保存</span>
        <span id="save-help">入力内容を確認</span>
        <Tooltip type={type} message="ツールチップ">
          <Button aria-labelledby={labelId} aria-describedby="save-help">
            操作
          </Button>
        </Tooltip>
      </>
    )
    const { rerender } = render(renderTooltip())
    const button = screen.getByRole('button', { name: '保存' })

    rerender(renderTooltip('label'))
    expect(button).toHaveAccessibleName('ツールチップ')
    expect(button).toHaveAccessibleDescription('入力内容を確認')

    rerender(renderTooltip())
    expect(button).toHaveAccessibleName('保存')
    expect(button).toHaveAccessibleDescription('入力内容を確認 ツールチップ')
  })

  // 非表示中に幅計算が走って壊れた maxWidth が inline style に残り、再表示しても直らない不具合の回帰テスト
  describe('非表示時の位置計算スタイルのクリア', () => {
    const showTooltip = (wrapper: Element) => fireEvent.pointerEnter(wrapper)
    const hideTooltip = (wrapper: Element) => fireEvent.pointerLeave(wrapper)
    const getPopup = () => document.querySelector<HTMLElement>('.smarthr-ui-Tooltip-popup')

    it('ツールチップを閉じると、表示中に算出した位置計算の inline style が残らない', () => {
      render(
        <Tooltip message="説明">
          <Button>ボタン</Button>
        </Tooltip>,
      )
      const wrapper = screen.getByRole('button', { name: 'ボタン' }).closest('.smarthr-ui-Tooltip')!

      showTooltip(wrapper)
      // 表示中は位置計算の style が付与される
      expect(getPopup()!.style.maxWidth).not.toBe('')

      hideTooltip(wrapper)
      // 非表示になったら位置計算の style を引きずらない
      expect(getPopup()!.style.maxWidth).toBe('')
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

        expect(getPopup()!.style.maxWidth).toBe('')
      } finally {
        vi.useRealTimers()
      }
    })
  })
})
