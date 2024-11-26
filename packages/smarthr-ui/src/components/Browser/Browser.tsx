import React, { FC, KeyboardEventHandler, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DecoratorsType } from '../../types'
import { Text } from '../Text'

import { BrowserColumn } from './BrowserColumn'
import { ItemNode, ItemNodeLike, RootNode } from './models'
import { getElementIdFromNode } from './utils'

const optionsListWrapper = tv({
  base: 'smarthr-ui-Browser shr-flex shr-flex-row shr-flex-nowrap shr-min-h-[355px]',
  variants: {
    columnCount: {
      0: 'shr-justify-center shr-items-center',
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
  decorators?: DecoratorsType<'notFoundTitle' | 'notFoundDescription'>
}

const NOT_FOUND_TITLE = '該当する項目がありません。'
const NOT_FOUND_DESCRIPTION = '別の条件を試してください。'

export const Browser: FC<Props> = (props) => {
  const { value, decorators, onSelectItem } = props

  const decoratedTexts = useMemo(
    () => ({
      notFoundTitle: decorators?.notFoundTitle?.(NOT_FOUND_TITLE) ?? NOT_FOUND_TITLE,
      notFoundDescription:
        decorators?.notFoundDescription?.(NOT_FOUND_DESCRIPTION) ?? NOT_FOUND_DESCRIPTION,
    }),
    [decorators],
  )

  const rootNode = useMemo(() => RootNode.from({ children: props.items }), [props.items])

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
      if (e.key === 'ArrowUp' && selectedNode) {
        const target = selectedNode.getPrev() ?? selectedNode.parent?.getLastChild()
        if (target) {
          e.preventDefault()
          onSelectItem?.(target.value)
          document.getElementById(getElementIdFromNode(target))?.focus()
        }
      }

      if (e.key === 'ArrowDown' && selectedNode) {
        const target = selectedNode.getNext() ?? selectedNode.parent?.getFirstChild()
        if (target) {
          e.preventDefault()
          onSelectItem?.(target.value)
          document.getElementById(getElementIdFromNode(target))?.focus()
        }
      }

      if (e.key === 'ArrowLeft') {
        const target = selectedNode?.parent
        if (target instanceof ItemNode) {
          e.preventDefault()
          onSelectItem?.(target.value)
          document.getElementById(getElementIdFromNode(target))?.focus()
        }
      }

      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        const target = selectedNode?.getFirstChild()
        if (target) {
          e.preventDefault()
          onSelectItem?.(target.value)
          document.getElementById(getElementIdFromNode(target))?.focus()
        }
      }
    },
    [selectedNode, onSelectItem],
  )

  return (
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation, jsx-a11y/no-noninteractive-element-interactions
    <div
      className={optionsListWrapper({ columnCount: columns.length as 0 | 1 | 2 | 3 })}
      onKeyDown={handleKeyDown}
      role="application"
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
          {decoratedTexts.notFoundTitle}
          <br />
          {decoratedTexts.notFoundDescription}
        </Text>
      )}
    </div>
  )
}
