'use client'

import { type ChangeEvent, type FC, type KeyboardEventHandler, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { useIntl } from '../../intl'
import { Text } from '../Text'

import { BrowserColumn } from './BrowserColumn'
import { ItemNode, type ItemNodeLike, RootNode } from './models'
import { getElementIdFromNode } from './utils'

const classNameGenerator = tv({
  base: 'smarthr-ui-Browser shr-flex shr-min-h-[355px] shr-flex-row shr-flex-nowrap',
  variants: {
    columnCount: {
      0: 'shr-items-center shr-justify-center',
      1: '[&>div]:shr-flex-1',
      2: '[&>div:nth-child(1)]:shr-flex-1 [&>div:nth-child(2)]:shr-flex-[2]',
      3: '[&>div]:shr-flex-1',
    },
  },
  defaultVariants: {
    columnCount: 0,
  },
})

type Props = {
  /** 表示する item の配列 */
  items: ItemNodeLike[]
  /** 選択中の item の値 */
  value?: string
  /** 選択された際に呼び出されるコールバック。第一引数に item の value を取る。 */
  onSelectItem?: (value: string) => void
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

type DecoratorKeyTypes = 'notFoundTitle' | 'notFoundDescription'

export const Browser: FC<Props> = ({ value, items, decorators, onSelectItem }) => {
  const { localize } = useIntl()
  const rootNode = useMemo(() => RootNode.from({ children: items }), [items])
  const columns = useMemo(() => rootNode.toViewData(value), [rootNode, value])

  const className = useMemo(
    () => classNameGenerator({ columnCount: columns.length as 0 | 1 | 2 | 3 }),
    [columns.length],
  )

  const decoratorDefaultTexts = useMemo(
    () => ({
      notFoundTitle: localize({
        id: 'smarthr-ui/Browser/notFoundTitle',
        defaultText: '該当する項目がありません。',
      }),
      notFoundDescription: localize({
        id: 'smarthr-ui/Browser/notFoundDescription',
        defaultText: '別の条件を試してください。',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

  const selectedNode = useMemo(
    () => (value ? rootNode.findByValue(value) : undefined),
    [value, rootNode],
  )

  // FIXME: focusメソッドのfocusVisibleが主要ブラウザでサポートされたら使うようにしたい(現状ではマウスクリックでもfocusのoutlineが出てしまう)
  // https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/focus
  const handleKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      if (!selectedNode) {
        return
      }

      let target: ItemNode | undefined = undefined

      switch (e.key) {
        case 'ArrowUp': {
          target = selectedNode.getPrev() ?? selectedNode.parent?.getLastChild()

          break
        }
        case 'ArrowDown': {
          target = selectedNode.getNext() ?? selectedNode.parent?.getFirstChild()

          break
        }
        case 'ArrowLeft': {
          const node = selectedNode.parent

          if (node instanceof ItemNode) {
            target = node
          }

          break
        }
        case 'ArrowRight':
        case 'Enter':
        case ' ': {
          target = selectedNode.getFirstChild()

          break
        }
      }

      if (target) {
        e.preventDefault()
        onSelectItem?.(target.value)
        document.getElementById(getElementIdFromNode(target.value))?.focus()
      }
    },
    [selectedNode, onSelectItem],
  )

  const onChangeInput = useMemo(
    () =>
      onSelectItem
        ? (e: ChangeEvent<HTMLInputElement>) => onSelectItem(e.currentTarget.value)
        : undefined,
    [onSelectItem],
  )

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation, jsx-a11y/no-noninteractive-element-interactions
    <div role="application" onKeyDown={handleKeyDown} className={className}>
      {columns.length > 0 ? (
        columns.map((colItems, index) => (
          <BrowserColumn
            key={index}
            items={colItems}
            index={index}
            value={value}
            onChangeInput={onChangeInput}
          />
        ))
      ) : (
        <Text>
          {decorated.notFoundTitle}
          <br />
          {decorated.notFoundDescription}
        </Text>
      )}
    </div>
  )
}
