'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type RefObject,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { flatArrayToMap } from '../../libs/map'

import { getNewExpandedItems } from './accordionPanelHelper'

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

export const AccordionPanelContext = createContext<{
  iconPosition: 'left' | 'right'
  expandedItems: Map<string, string>
  expandableMultiply: boolean
  parentRef: RefObject<HTMLDivElement> | null
  onClickTrigger?: (itemName: string, isExpanded: boolean) => void
  onClickProps?: (expandedItems: string[]) => void
}>({
  iconPosition: 'left',
  expandedItems: new Map(),
  expandableMultiply: true,
  parentRef: null,
})

const ITEM_SELECTOR = '&>.smarthr-ui-AccordionPanel-item'
const TRIGGER_SELECTOR = '.smarthr-ui-AccordionPanel-trigger'
const ROUNDED = {
  t_l: `[${ITEM_SELECTOR}:first-child_${TRIGGER_SELECTOR}]:shr-rounded-tl-l`,
  t_r: `[${ITEM_SELECTOR}:first-child_${TRIGGER_SELECTOR}]:shr-rounded-tr-l`,
  b_l: `[${ITEM_SELECTOR}:last-child_${TRIGGER_SELECTOR}:not([aria-expanded="true"])]:shr-rounded-bl-l`,
  b_r: `[${ITEM_SELECTOR}:last-child_${TRIGGER_SELECTOR}:not([aria-expanded="true"])]:shr-rounded-br-l`,
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
  defaultExpanded = [],
  className,
  onClick: onClickProps,
  rounded,
  ...rest
}) => {
  const [expandedItems, setExpanded] = useState(flatArrayToMap(defaultExpanded))
  const parentRef = useRef<HTMLDivElement>(null)
  const actualClassName = useMemo(
    () => classNameGenerator({ className, rounded }),
    [rounded, className],
  )

  const onClickTrigger = useCallback(
    (itemName: string, isExpanded: boolean) => {
      setExpanded(getNewExpandedItems(expandedItems, itemName, isExpanded, expandableMultiply))
    },
    [expandableMultiply, expandedItems],
  )

  useEffect(() => {
    if (defaultExpanded.length > 0) setExpanded(flatArrayToMap(defaultExpanded))
  }, [defaultExpanded])

  return (
    <AccordionPanelContext.Provider
      value={{
        onClickTrigger,
        onClickProps,
        expandedItems,
        iconPosition,
        expandableMultiply,
        parentRef,
      }}
    >
      <div {...rest} ref={parentRef} role="presentation" className={actualClassName} />
    </AccordionPanelContext.Provider>
  )
}
