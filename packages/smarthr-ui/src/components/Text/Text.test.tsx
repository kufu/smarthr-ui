/* eslint-disable smarthr/best-practice-for-text-component */
import { act, render, waitFor } from '@testing-library/react'
import { type ComponentPropsWithoutRef, createRef } from 'react'

import { Text } from './Text'

describe('Text', () => {
  test('ref を転送する', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Text ref={ref}>テキスト</Text>)

    expect(ref.current?.tagName).toBe('SPAN')
  })

  describe('maxLines', () => {
    test.each([1, { max: 1, tooltip: true }] as const)(
      '%j を指定した場合、親の幅は上限としてのみ使う',
      (maxLines) => {
        const ref = createRef<HTMLSpanElement>()
        render(
          <Text ref={ref} maxLines={maxLines}>
            短い文章
          </Text>,
        )

        expect(ref.current).toHaveClass('shr-max-w-full')
        expect(ref.current).not.toHaveClass('shr-w-full')
      },
    )

    test('number を指定した場合、Tooltip 関連の要素は追加されない', () => {
      const { container } = render(<Text maxLines={3}>テキスト</Text>)

      expect(container.querySelector('.smarthr-ui-Text-overflowTooltipWrapper')).toBeNull()
    })

    test('object 指定で tooltip が未指定の場合、Tooltip 関連の要素は追加されない', () => {
      const { container } = render(<Text maxLines={3}>テキスト</Text>)

      expect(container.querySelector('.smarthr-ui-Text-overflowTooltipWrapper')).toBeNull()
    })

    test('"maxLines.max" が範囲外の場合エラーになる', () => {
      expect(() => render(<Text maxLines={7 as 1 | 2 | 3 | 4 | 5 | 6}>テキスト</Text>)).toThrow(
        '"maxLines" は 1 ~ 6 の範囲で指定してください',
      )
    })

    describe('object指定でtooltipがtrueの場合', () => {
      // jsdom ではレイアウトを計測できないため、本文と shadow の高さを設定する
      const originalClientHeight = Object.getOwnPropertyDescriptor(
        Element.prototype,
        'clientHeight',
      )!

      afterEach(() => {
        Object.defineProperty(Element.prototype, 'clientHeight', originalClientHeight)
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
        vi.useRealTimers()
      })

      const mockClientHeight = (
        visible: number,
        shadow: number | ((node: HTMLElement) => number),
      ) => {
        Object.defineProperty(Element.prototype, 'clientHeight', {
          configurable: true,
          get(this: HTMLElement) {
            if (!this.classList.contains('smarthr-ui-Text-overflowTooltipShadow')) {
              return visible
            }
            return typeof shadow === 'number' ? shadow : shadow(this)
          },
        })
      }

      test('テキストが省略されている場合、Tooltip で全文を表示する', () => {
        mockClientHeight(24, 72)

        const { container } = render(<Text maxLines={{ max: 3, tooltip: true }}>テキスト</Text>)

        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()
      })

      test('テキストが省略されていない場合、Tooltip を表示しない', () => {
        mockClientHeight(72, 72)

        const { container } = render(<Text maxLines={{ max: 3, tooltip: true }}>テキスト</Text>)

        expect(container.querySelector('.smarthr-ui-Tooltip')).toBeNull()
      })

      test('children が変化した場合、MutationObserver により再判定される', async () => {
        mockClientHeight(24, 72)

        const { container, rerender } = render(
          <Text maxLines={{ max: 3, tooltip: true }}>テキスト</Text>,
        )

        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()

        mockClientHeight(72, 72)

        rerender(<Text maxLines={{ max: 3, tooltip: true }}>別のテキスト</Text>)

        await waitFor(() => expect(container.querySelector('.smarthr-ui-Tooltip')).toBeNull())
      })

      test('一行表示では折り返さない文字列の横方向の省略を判定する', () => {
        mockClientHeight(24, 24)
        vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(120)
        vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(240)

        const { container } = render(
          <Text maxLines={{ max: 1, tooltip: true }}>Employee_IDENTIFIER_1234567890</Text>,
        )

        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()
      })

      test('行数の指定がなくCSSで横方向に省略された場合もTooltipを表示する', () => {
        mockClientHeight(24, 24)
        vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(120)
        vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(240)

        const { container } = render(
          <Text
            maxLines={{ max: undefined, tooltip: true }}
            style={{
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            長いテキスト
          </Text>,
        )

        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()
      })

      test('カスタムコンポーネントの本文要素が変わった場合は省略を再判定する', async () => {
        const SwitchableText = ({
          link,
          children,
          ...rest
        }: ComponentPropsWithoutRef<'span'> & { link: boolean }) =>
          link ? (
            <a {...rest} href="#text">
              {children}
            </a>
          ) : (
            <span {...rest}>{children}</span>
          )
        vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(120)
        vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (
          this: Element,
        ) {
          return this.tagName === 'A' ? 240 : 120
        })
        const { container, rerender } = render(
          <Text as={SwitchableText} link={false} maxLines={{ max: 1, tooltip: true }}>
            長いテキスト
          </Text>,
        )
        expect(container.querySelector('.smarthr-ui-Tooltip')).toBeNull()

        rerender(
          <Text as={SwitchableText} link maxLines={{ max: 1, tooltip: true }}>
            長いテキスト
          </Text>,
        )

        await waitFor(() => expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull())
      })

      test('複数行の計測では、端数を含む本文の幅と文字のスタイルを使う', () => {
        mockClientHeight(84, (shadow) =>
          shadow.style.width === '403.75px' &&
          shadow.style.fontSize === '24px' &&
          shadow.style.lineHeight === '26px' &&
          shadow.style.paddingTop === '14px' &&
          shadow.style.paddingBottom === ''
            ? 92
            : 84,
        )

        const { container } = render(
          <Text
            maxLines={{ max: 2, tooltip: true }}
            style={{
              boxSizing: 'border-box',
              width: '423.75px',
              padding: '14px 8px 18px',
              border: '2px solid',
              fontSize: '24px',
              lineHeight: '26px',
            }}
          >
            本文
          </Text>,
        )

        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()
      })

      test.each([
        {
          description: '行数制限で省略された場合',
          display: '-webkit-box',
          paddingBottom: '24px',
          targetHeight: 72,
          shadowHeight: 72,
          expected: true,
        },
        {
          description: '端数の余白があっても本文が収まる場合',
          display: '-webkit-box',
          paddingBottom: '0.54px',
          targetHeight: 49,
          shadowHeight: 49,
          expected: false,
        },
        {
          description: 'display の上書きで行数制限が無効な場合',
          display: 'flow-root',
          paddingBottom: '24px',
          targetHeight: 72,
          shadowHeight: 72,
          expected: false,
        },
      ] as const)(
        '下余白があるときも省略の有無を判定する ($description)',
        ({ display, paddingBottom, targetHeight, shadowHeight, expected }) => {
          mockClientHeight(targetHeight, shadowHeight)

          const { container } = render(
            <Text
              maxLines={{ max: 2, tooltip: true }}
              style={{
                display,
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                paddingBottom,
              }}
            >
              本文
            </Text>,
          )

          expect(Boolean(container.querySelector('.smarthr-ui-Tooltip'))).toBe(expected)
        },
      )

      test('サイズ変更後も本文のフォーカスを保ち、アンマウント時に監視と予約を解除する', () => {
        vi.useFakeTimers()
        let notifyResize = () => {}
        const disconnect = vi.fn()
        vi.stubGlobal(
          'ResizeObserver',
          class {
            constructor(callback: () => void) {
              notifyResize = callback
            }
            observe() {}
            disconnect = disconnect
          },
        )
        const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame')
        mockClientHeight(48, 48)
        const ref = createRef<HTMLAnchorElement>()
        const { container, unmount } = render(
          <Text as="a" ref={ref} href="#text" maxLines={{ max: 2, tooltip: true }}>
            折り返す本文
          </Text>,
        )
        const link = ref.current
        act(() => link?.focus())

        expect(container.querySelector('.smarthr-ui-Tooltip')).toBeNull()
        expect(link).toHaveFocus()

        mockClientHeight(48, 72)
        act(() => {
          notifyResize()
          vi.advanceTimersToNextFrame()
        })
        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()
        expect(ref.current).toBe(link)
        expect(link).toHaveFocus()
        expect(document.querySelector('[role=tooltip]')).toHaveAttribute('aria-hidden', 'false')

        mockClientHeight(48, 48)
        act(() => {
          notifyResize()
          vi.advanceTimersToNextFrame()
        })
        expect(container.querySelector('.smarthr-ui-Tooltip')).toBeNull()
        expect(ref.current).toBe(link)
        expect(link).toHaveFocus()

        mockClientHeight(48, 72)
        act(() => {
          window.dispatchEvent(new Event('resize'))
          vi.advanceTimersToNextFrame()
        })
        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()

        disconnect.mockClear()
        cancelFrame.mockClear()
        notifyResize()
        unmount()

        expect(disconnect).toHaveBeenCalled()
        expect(cancelFrame).toHaveBeenCalled()
      })

      test('ref は実際にレンダリングされた要素を指す', () => {
        const ref = createRef<HTMLSpanElement>()
        render(
          <Text ref={ref} maxLines={{ max: 3, tooltip: true }}>
            テキスト
          </Text>,
        )

        expect(ref.current?.tagName).toBe('SPAN')
        expect(ref.current?.textContent).toBe('テキスト')
      })
    })
  })
})
