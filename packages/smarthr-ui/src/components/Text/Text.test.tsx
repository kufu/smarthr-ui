/* eslint-disable smarthr/best-practice-for-text-component */
import { act, render } from '@testing-library/react'
import { createRef } from 'react'

import { Text } from './Text'

describe('Text', () => {
  // HINT: React 19 は ref を通常の props として扱うため forwardRef がなくても動いてしまい、
  // 挙動のテストだけでは React 18 でのデグレを検知できない。そのため構造そのものを検証する
  test('React 18 でも ref を転送できるよう memo(forwardRef()) でラップされている', () => {
    const memoized = Text as unknown as { $$typeof: symbol; type: { $$typeof: symbol } }

    expect(memoized.$$typeof).toBe(Symbol.for('react.memo'))
    expect(memoized.type.$$typeof).toBe(Symbol.for('react.forward_ref'))
  })

  test('ref を転送する', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Text ref={ref}>テキスト</Text>)

    expect(ref.current?.tagName).toBe('SPAN')
  })

  describe('maxLines', () => {
    test('number を指定した場合、Tooltip 関連の要素は追加されない', () => {
      const { container } = render(<Text maxLines={3}>テキスト</Text>)

      expect(container.querySelector('.smarthr-ui-Text-overflowTooltipWrapper')).toBeNull()
    })

    test('object 指定で tooltip が未指定の場合、Tooltip 関連の要素は追加されない', () => {
      const { container } = render(<Text maxLines={{ max: 3 }}>テキスト</Text>)

      expect(container.querySelector('.smarthr-ui-Text-overflowTooltipWrapper')).toBeNull()
    })

    test('"maxLines.max" が範囲外の場合エラーになる', () => {
      expect(() =>
        render(<Text maxLines={{ max: 7 as 1 | 2 | 3 | 4 | 5 | 6 }}>テキスト</Text>),
      ).toThrow('"maxLines" は 1 ~ 6 の範囲で指定してください')
    })

    describe('object指定でtooltipがtrueの場合', () => {
      // HINT: -webkit-line-clamp の高さ比較用 shadow 要素との clientHeight 比較で
      // オーバーフローを判定している。isOverflowingがtrueに切り替わるとTooltipで
      // ラップされる形にJSXのルート要素が変わり、Reactがサブツリーごと再マウントするため、
      // 個別のDOM要素にモックを仕込んでも再マウントで失われる。className基準の
      // prototypeレベルのgetterにすることで再マウント後も一貫した値を返すようにする
      const originalClientHeight = Object.getOwnPropertyDescriptor(
        Element.prototype,
        'clientHeight',
      )!

      afterEach(() => {
        Object.defineProperty(Element.prototype, 'clientHeight', originalClientHeight)
      })

      const mockClientHeight = (visible: number, shadow: number) => {
        Object.defineProperty(Element.prototype, 'clientHeight', {
          configurable: true,
          get(this: Element) {
            return this.classList.contains('smarthr-ui-Text-overflowTooltipShadow')
              ? shadow
              : visible
          },
        })
      }

      test('テキストが省略されている場合、Tooltip で全文を表示する', () => {
        mockClientHeight(24, 72)

        const { container } = render(<Text maxLines={{ max: 3, tooltip: true }}>テキスト</Text>)

        act(() => {
          window.dispatchEvent(new Event('resize'))
        })

        expect(container.querySelector('.smarthr-ui-Tooltip')).not.toBeNull()
      })

      test('テキストが省略されていない場合、Tooltip を表示しない', () => {
        mockClientHeight(72, 72)

        const { container } = render(<Text maxLines={{ max: 3, tooltip: true }}>テキスト</Text>)

        act(() => {
          window.dispatchEvent(new Event('resize'))
        })

        expect(container.querySelector('.smarthr-ui-Tooltip')).toBeNull()
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
