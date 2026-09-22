'use client'

import {
  type ComponentProps,
  type FC,
  type KeyboardEventHandler,
  type MouseEvent,
  type PropsWithChildren,
  createContext,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
import { flatArrayToMap, mapToKeyArray } from '../../libs/map'

type BaseProps = PropsWithChildren<{
  /** アイコンの左右位置 */
  iconPosition?: 'left' | 'right'
  /** 複数のパネルを同時に開くことを許容するかどうか */
  expandableMultiply?: boolean
  /** デフォルトで開いた状態にするアイテムの `name` の配列 */
  defaultExpanded?: string[]
  /** トリガのクリックイベントを処理するハンドラ */
  onClick?: (expandedItems: string[]) => void
  /** 角丸を適用する範囲 */
  rounded?: boolean | 'all' | 'top' | 'right' | 'bottom' | 'left'
}>
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

const DEFAULT_EXPANDED_ARRAY: string[] = []
const DEFAULT_EXPANDED_MAP = flatArrayToMap(DEFAULT_EXPANDED_ARRAY)

export const AccordionPanelContext = createContext<{
  iconPosition: 'left' | 'right'
  expandedItems: Map<string, string>
  handleClickTrigger: (e: MouseEvent<HTMLButtonElement>) => void
  handleKeyDown: KeyboardEventHandler<HTMLButtonElement>
}>({
  iconPosition: 'left',
  expandedItems: DEFAULT_EXPANDED_MAP,
  handleClickTrigger: () => {},
  handleKeyDown: () => {},
})

const ROUNDED = {
  t_l: '[&>.smarthr-ui-AccordionPanel-item:first-child_.smarthr-ui-AccordionPanel-trigger]:shr-rounded-tl-l',
  t_r: '[&>.smarthr-ui-AccordionPanel-item:first-child_.smarthr-ui-AccordionPanel-trigger]:shr-rounded-tr-l',
  b_l: '[&>.smarthr-ui-AccordionPanel-item:last-child_.smarthr-ui-AccordionPanel-trigger:not([aria-expanded="true"])]:shr-rounded-bl-l',
  b_r: '[&>.smarthr-ui-AccordionPanel-item:last-child_.smarthr-ui-AccordionPanel-trigger:not([aria-expanded="true"])]:shr-rounded-br-l',
}

const ROUNDED_ALL = [ROUNDED.t_l, ROUNDED.t_r, ROUNDED.b_l, ROUNDED.b_r]

const classNameGenerator = tv({
  base: 'smarthr-ui-AccordionPanel',
  variants: {
    rounded: {
      true: ROUNDED_ALL,
      false: '',
      all: ROUNDED_ALL,
      top: [ROUNDED.t_l, ROUNDED.t_r],
      right: [ROUNDED.t_r, ROUNDED.b_r],
      bottom: [ROUNDED.b_l, ROUNDED.b_r],
      left: [ROUNDED.t_l, ROUNDED.b_l],
    } satisfies Record<
      Exclude<NonNullable<BaseProps['rounded']>, boolean> | 'true' | 'false',
      string | string[]
    >,
  },
  defaultVariants: {
    rounded: false,
  },
})

export const AccordionPanel: FC<Props> = ({
  iconPosition = 'left',
  expandableMultiply = true,
  defaultExpanded = DEFAULT_EXPANDED_ARRAY,
  className,
  onClick,
  rounded,
  children,
  ...rest
}) => {
  const [expandedItems, setExpanded] = useState(() => flatArrayToMap(defaultExpanded))
  const actualClassName = useMemo(
    () => classNameGenerator({ className, rounded }),
    [rounded, className],
  )

  const latest = useLatest({ onClick, expandableMultiply })

  const functions = useMemo(() => {
    let wrapper: HTMLElement | null = null

    return {
      callbackRef: (node: HTMLElement | null) => {
        wrapper = node
      },
      handleClickTrigger: (e: MouseEvent<HTMLButtonElement>) => {
        const { currentTarget } = e

        setExpanded((prevExpandedItems) => {
          let newExpandedItems: Map<string, string>
          const itemName = currentTarget.value
          const isExpanded = currentTarget.getAttribute('aria-expanded') !== 'true'

          if (latest.expandableMultiply) {
            newExpandedItems = new Map(prevExpandedItems)

            if (isExpanded) {
              newExpandedItems.set(itemName, itemName)
            } else {
              newExpandedItems.delete(itemName)
            }
          } else {
            newExpandedItems = isExpanded ? new Map([[itemName, itemName]]) : new Map()
          }

          latest.onClick?.(mapToKeyArray(newExpandedItems))

          return newExpandedItems
        })
      },
      handleKeyDown: (e: Parameters<KeyboardEventHandler<HTMLButtonElement>>[0]): void => {
        if (!wrapper) {
          return
        }

        const item = e.target as HTMLElement

        switch (e.key) {
          case 'Home': {
            e.preventDefault()
            focusSibling({
              mode: 'first',
              wrapper,
            })
            break
          }
          case 'End': {
            e.preventDefault()
            focusSibling({
              mode: 'last',
              wrapper,
            })
            break
          }
          case 'ArrowLeft':
          case 'ArrowUp': {
            e.preventDefault()
            focusSibling({
              mode: 'prev',
              wrapper,
              current: item,
            })
            break
          }
          case 'ArrowRight':
          case 'ArrowDown': {
            e.preventDefault()
            focusSibling({
              mode: 'next',
              wrapper,
              current: item,
            })
            break
          }
        }
      },
    }
  }, [latest])

  return (
    <AccordionPanelContext.Provider
      value={{
        handleClickTrigger: functions.handleClickTrigger,
        handleKeyDown: functions.handleKeyDown,
        expandedItems,
        iconPosition,
      }}
    >
      <div {...rest} ref={functions.callbackRef} role="presentation" className={actualClassName}>
        {children}
      </div>
    </AccordionPanelContext.Provider>
  )
}

const focusSibling = (
  props:
    | {
        mode: 'first' | 'last'
        wrapper: HTMLElement
        current?: undefined
      }
    | {
        mode: 'next' | 'prev'
        wrapper: HTMLElement
        current: HTMLElement
      },
) => {
  const siblings = props.wrapper.querySelectorAll<HTMLElement>(
    '[data-component="AccordionHeaderButton"]',
  )
  let target: HTMLElement | undefined = undefined

  switch (props.mode) {
    case 'first':
      target = siblings[0]
      break
    case 'last':
      target = siblings[siblings.length - 1]
      break
    case 'next': {
      const index = Array.prototype.indexOf.call(siblings, props.current)

      if (index === siblings.length - 1) {
        target = siblings[0]
      } else if (index !== -1) {
        target = siblings[index + 1]
      }

      break
    }
    case 'prev': {
      const index = Array.prototype.indexOf.call(siblings, props.current)

      if (index === 0) {
        target = siblings[siblings.length - 1]
      } else if (index !== -1) {
        target = siblings[index - 1]
      }

      break
    }
  }

  target?.focus()
}
