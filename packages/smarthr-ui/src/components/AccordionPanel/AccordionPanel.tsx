'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type RefObject,
  createContext,
  useCallback,
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

const DEFAULT_EXPANDED_ARRAY: string[] = []
const DEFAULT_EXPANDED_MAP = flatArrayToMap(DEFAULT_EXPANDED_ARRAY)

export const AccordionPanelContext = createContext<{
  iconPosition: 'left' | 'right'
  expandedItems: Map<string, string>
  expandableMultiply: boolean
  parentRef: RefObject<HTMLDivElement> | null
  onClickTrigger?: (itemName: string, isExpanded: boolean) => void
  onClickProps?: (expandedItems: string[]) => void
}>({
  iconPosition: 'left',
  expandedItems: DEFAULT_EXPANDED_MAP,
  expandableMultiply: true,
  parentRef: null,
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

  const onClickRef = useRef(onClick)
  onClickRef.current = onClick

  const onClickProps = useCallback((items: string[]) => {
    onClickRef.current?.(items)
  }, [])

  const onClickTrigger = useCallback(
    (itemName: string, isExpanded: boolean) => {
      setExpanded((prevExpandedItems) =>
        getNewExpandedItems(prevExpandedItems, itemName, isExpanded, expandableMultiply),
      )
    },
    [expandableMultiply],
  )

  return (
    <AccordionPanelContext.Provider
      value={{
        onClickTrigger,
        onClickProps: onClick ? onClickProps : undefined,
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
