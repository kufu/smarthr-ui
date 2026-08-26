import {
  type ChangeEvent,
  type ComponentProps,
  type FC,
  type KeyboardEventHandler,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
import { findDelegateTarget } from '../../libs/delegate'

import { BrowserColumn } from './BrowserColumn'
import { ItemNode, type ItemNodeLike, RootNode } from './models'
import { getElementIdFromNode } from './utils'

const INPUT_SELECTOR = 'input[type="radio"][data-smarthr-ui-browser-item-input="true"]'

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-Browser', 'shr-flex'],
    column: ['shr-min-w-[13em] shr-list-none', '[&_+_&]:shr-border-l-shorthand'],
  },
  variants: {
    isSingleColumn: {
      true: {
        column: 'shr-max-w-[theme(width.1/3)]',
      },
      false: {
        column: 'last:shr-grow',
      },
    },
  },
})

type BaseProps = {
  /** 表示する item の配列 */
  items: ItemNodeLike[]
  /** 選択中の item の値 */
  value?: string
  /** 選択された際に呼び出されるコールバック。第一引数に item の value を取る。 */
  onSelectItem?: (value: string) => void
}
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

export const Browser: FC<Props> = ({ value, items, onSelectItem, className, ...rest }) => {
  const rootNode = useMemo(() => RootNode.from({ children: items }), [items])
  const columns = useMemo(() => rootNode.toViewData(value), [rootNode, value])

  const isSingleColumn = columns.length === 1
  const classNames = useMemo(() => {
    const { wrapper, column } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      column: column({ isSingleColumn }),
    }
  }, [isSingleColumn, className])

  const selectedPath = useMemo(() => {
    if (!value) return []
    const node = rootNode.findByValue(value)
    if (!node) return []
    return [...node.getAncestors().map((n) => n.value), node.value]
  }, [rootNode, value])

  const latest = useLatest({ onSelectItem, value, rootNode })
  const hasOnSelectItem = !!onSelectItem

  const functions = useMemo(() => {
    // FIXME: focusメソッドのfocusVisibleが主要ブラウザでサポートされたら使うようにしたい(現状ではマウスクリックでもfocusのoutlineが出てしまう)
    // https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/focus
    const handleDelegateKeyDown: KeyboardEventHandler = (e) => {
      const selectedNode = latest.value ? latest.rootNode.findByValue(latest.value) : undefined

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
        latest.onSelectItem?.(target.value)
        document.getElementById(getElementIdFromNode(target.value))?.focus()
      }
    }

    return {
      handleDelegateKeyDown,
      handleDelegateChange: hasOnSelectItem
        ? (e: ChangeEvent<HTMLDivElement>) => {
            const el = findDelegateTarget<HTMLInputElement>(e, INPUT_SELECTOR)

            if (el) {
              latest.onSelectItem?.(el.value)
            }
          }
        : undefined,
    }
  }, [hasOnSelectItem, latest])

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      {...rest}
      role="application"
      onKeyDown={functions.handleDelegateKeyDown}
      onChange={functions.handleDelegateChange}
      className={classNames.wrapper}
    >
      {columns.map((colItems, index) => (
        <BrowserColumn
          key={index}
          items={colItems}
          index={index}
          value={selectedPath[index]}
          className={classNames.column}
        />
      ))}
    </div>
  )
}
