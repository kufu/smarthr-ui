import React, { FC, KeyboardEventHandler, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { Text } from '../Text'

import { BrowserColumn } from './BrowserColumn'
import { ItemNode, ItemNodeLike, RootNode } from './models'
import { getElementIdFromNode } from './utils'

const optionsListWrapper = tv({
  base: [
    'smarthr-ui-Browser shr-flex shr-flex-row shr-flex-nowrap shr-min-h-[355px]',
    '[&[data-column-length="0"]]:shr-justify-center [&[data-column-length="0"]]:shr-items-center',
    '[&[data-column-length="1"]]:[&>div]:shr-flex-1',
    '[&[data-column-length="2"]]:[&>div:nth-child(1)]:shr-flex-1 [&[data-column-length="2"]]:[&>div:nth-child(2)]:shr-flex-[2]',
    '[&[data-column-length="3"]]:[&>div]:shr-flex-1',
  ],
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

const DECORATOR_DEFAULT_TEXTS = {
  notFoundTitle: '該当する項目がありません。',
  notFoundDescription: '別の条件を試してください。',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

export const Browser: FC<Props> = ({ value, items, decorators, onSelectItem }) => {
  const style = useMemo(() => optionsListWrapper(), [])
  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)
  const rootNode = useMemo(() => RootNode.from({ children: items }), [items])

  const selectedNode = useMemo(() => {
    if (value) {
      return rootNode.findByValue(value)
    }
    return
  }, [rootNode, value])

  const columns = useMemo(() => rootNode.toViewData(value), [rootNode, value])

  // FIXME: focusメソッドのfocusVisibleが主要ブラウザでサポートされたら使うようにしたい(現状ではマウスクリックでもfocusのoutlineが出てしまう)
  // https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/focus
  const handleKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      let target: ItemNodeLike | null = null

      switch (e.key) {
        case 'ArrowUp': {
          if (selectedNode) {
            target = selectedNode.getPrev() ?? selectedNode.parent?.getLastChild()
          }

          break
        }
        case 'ArrowDown': {
          if (selectedNode) {
            target = selectedNode.getNext() ?? selectedNode.parent?.getFirstChild()
          }

          break
        }
        case 'ArrowLeft':
          target = selectedNode?.parent

          break
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          target = selectedNode?.getFirstChild()

          break
      }

      if (target) {
        e.preventDefault()
        onSelectItem?.(target.value)
        document.getElementById(getElementIdFromNode(target.value))?.focus()
      }
    },
    [selectedNode, onSelectItem],
  )

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation, jsx-a11y/no-noninteractive-element-interactions
    <div
      role="application"
      onKeyDown={handleKeyDown}
      data-column-length={columns.length}
      className={style}
    >
      {columns.length > 0 ? (
        columns.map((items, index) => (
          <BrowserColumn
            key={index}
            items={items}
            index={index}
            value={value}
            onSelectItem={onSelectItem}
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
