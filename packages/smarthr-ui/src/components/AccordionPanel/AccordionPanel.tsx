'use client'

import {
  type ComponentProps,
  type FC,
  type KeyboardEventHandler,
  type MouseEvent,
  type PropsWithChildren,
  createContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
import { flatArrayToMap, mapToKeyArray } from '../../libs/map'

import {
  focusFirstSibling,
  focusLastSibling,
  focusNextSibling,
  focusPreviousSibling,
  getNewExpandedItems,
} from './accordionPanelHelper'

type AbstractProps = PropsWithChildren<{
  /** アイコンの左右位置 */
  iconPosition?: 'left' | 'right'
  /** 複数のパネルを同時に開くことを許容するかどうか */
  expandableMultiply?: boolean
  /** デフォルトで開いた状態にするアイテムの `name` の配列 */
  defaultExpanded?: string[]
  /** トリガのクリックイベントを処理するハンドラ */
  onClick?: (expandedItems: string[]) => void
}> &
  VariantProps<typeof classNameGenerator>
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

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
    },
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
  ...rest
}) => {
  const [expandedItems, setExpanded] = useState(() => flatArrayToMap(defaultExpanded))
  const parentRef = useRef<HTMLDivElement>(null)
  const actualClassName = useMemo(
    () => classNameGenerator({ className, rounded }),
    [rounded, className],
  )

  const latest = useLatest({ onClick, expandableMultiply })

  const functions = useMemo(
    () => ({
      handleClickTrigger: (e: MouseEvent<HTMLButtonElement>) => {
        const { currentTarget } = e

        setExpanded((prevExpandedItems) => {
          const newExpandedItems = getNewExpandedItems(
            prevExpandedItems,
            currentTarget.value,
            currentTarget.getAttribute('aria-expanded') !== 'true',
            latest.expandableMultiply,
          )

          latest.onClick?.(mapToKeyArray(newExpandedItems))

          return newExpandedItems
        })
      },
      handleKeyDown: (e: Parameters<KeyboardEventHandler<HTMLButtonElement>>[0]): void => {
        if (!parentRef.current) {
          return
        }

        const item = e.target as HTMLElement

        switch (e.key) {
          case 'Home': {
            e.preventDefault()
            focusFirstSibling(parentRef.current)
            break
          }
          case 'End': {
            e.preventDefault()
            focusLastSibling(parentRef.current)
            break
          }
          case 'ArrowLeft':
          case 'ArrowUp': {
            e.preventDefault()
            focusPreviousSibling(item, parentRef.current)
            break
          }
          case 'ArrowRight':
          case 'ArrowDown': {
            e.preventDefault()
            focusNextSibling(item, parentRef.current)
            break
          }
        }
      },
    }),
    [latest],
  )

  return (
    <AccordionPanelContext.Provider
      value={{
        handleClickTrigger: functions.handleClickTrigger,
        handleKeyDown: functions.handleKeyDown,
        expandedItems,
        iconPosition,
      }}
    >
      <div {...rest} ref={parentRef} role="presentation" className={actualClassName} />
    </AccordionPanelContext.Provider>
  )
}
