import {
  type ChangeEvent,
  type ComponentProps,
  type FC,
  type KeyboardEventHandler,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { BrowserColumn } from './BrowserColumn'
import { ItemNode, type ItemNodeLike, RootNode } from './models'
import { getElementIdFromNode } from './utils'

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-Browser', 'shr-flex'],
    column: ['shr-min-w-[13em] shr-list-none', '[&_+_&]:shr-border-l-shorthand'],
  },
  variants: {
    maxColumn: {
      1: {
        column: 'shr-max-w-[theme(width.1/3)]',
      },
      2: {},
      3: {},
    },
  },
  compoundVariants: [
    {
      maxColumn: [2, 3],
      className: {
        column: 'last:shr-grow',
      },
    },
  ],
})

type AbstractProps = {
  /** 表示する item の配列 */
  items: ItemNodeLike[]
  /** 選択中の item の値 */
  value?: string
  /** 選択された際に呼び出されるコールバック。第一引数に item の value を取る。 */
  onSelectItem?: (value: string) => void
}
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

export const Browser: FC<Props> = ({ value, items, onSelectItem, className, ...rest }) => {
  const rootNode = useMemo(() => RootNode.from({ children: items }), [items])
  const columns = useMemo(() => rootNode.toViewData(value), [rootNode, value])

  const classNames = useMemo(() => {
    const { wrapper, column } = classNameGenerator({ className })
    return {
      wrapper: wrapper(),
      column: column({
        maxColumn: columns.length as 1 | 2 | 3,
      }),
    }
  }, [className, columns.length])

  const selectedPath = useMemo(() => {
    if (!value) return []
    const node = rootNode.findByValue(value)
    if (!node) return []
    return [...node.getAncestors().map((n) => n.value), node.value]
  }, [rootNode, value])

  const selectedNode = useMemo(
    () => (value ? rootNode.findByValue(value) : undefined),
    [value, rootNode],
  )

  // FIXME: focusメソッドのfocusVisibleが主要ブラウザでサポートされたら使うようにしたい(現状ではマウスクリックでもfocusのoutlineが出てしまう)
  // https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/focus
  const onDelegateKeyDown: KeyboardEventHandler = useCallback(
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
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div {...rest} role="application" onKeyDown={onDelegateKeyDown} className={classNames.wrapper}>
      {columns.map((colItems, index) => (
        <BrowserColumn
          key={index}
          items={colItems}
          index={index}
          value={selectedPath[index]}
          onChangeInput={onChangeInput}
          className={classNames.column}
        />
      ))}
    </div>
  )
}
