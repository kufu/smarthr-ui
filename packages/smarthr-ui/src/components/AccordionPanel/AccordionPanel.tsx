'use client'

import React, {
  ComponentProps,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { flatArrayToMap } from '../../libs/map'

import {
  focusFirstSibling,
  focusLastSibling,
  focusNextSibling,
  focusPreviousSibling,
  getNewExpandedItems,
  keycodes,
} from './accordionPanelHelper'

type Props = PropsWithChildren<{
  /** アイコンの左右位置 */
  iconPosition?: 'left' | 'right'
  /** 複数のパネルを同時に開くことを許容するかどうか */
  expandableMultiply?: boolean
  /** デフォルトで開いた状態にするアイテムの `name` の配列 */
  defaultExpanded?: string[]
  /** トリガのクリックイベントを処理するハンドラ */
  onClick?: (expandedItems: string[]) => void
}>
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const AccordionPanelContext = React.createContext<{
  iconPosition: 'left' | 'right'
  expandedItems: Map<string, string>
  expandableMultiply: boolean
  parentRef: React.RefObject<HTMLDivElement> | null
  onClickTrigger?: (itemName: string, isExpanded: boolean) => void
  onClickProps?: (expandedItems: string[]) => void
}>({
  iconPosition: 'left',
  expandedItems: new Map(),
  expandableMultiply: true,
  parentRef: null,
})

const accordionWrapper = tv({
  base: 'smarthr-ui-AccordionPanel',
})

export const AccordionPanel: React.FC<Props & ElementProps> = ({
  iconPosition = 'left',
  expandableMultiply = true,
  defaultExpanded = [],
  className,
  onClick: onClickProps,
  ...props
}) => {
  const [expandedItems, setExpanded] = useState(flatArrayToMap(defaultExpanded))
  const parentRef = useRef<HTMLDivElement>(null)
  const styles = useMemo(() => accordionWrapper({ className }), [className])

  const onClickTrigger = useCallback(
    (itemName: string, isExpanded: boolean) => {
      setExpanded(getNewExpandedItems(expandedItems, itemName, isExpanded, expandableMultiply))
    },
    [expandableMultiply, expandedItems],
  )

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!parentRef?.current) {
      return
    }

    const keyCode = event.keyCode
    const item = event.target as HTMLElement

    switch (keyCode) {
      case keycodes.HOME: {
        event.preventDefault()
        focusFirstSibling(parentRef.current)
        break
      }
      case keycodes.END: {
        event.preventDefault()
        focusLastSibling(parentRef.current)
        break
      }
      case keycodes.LEFT:
      case keycodes.UP: {
        event.preventDefault()
        focusPreviousSibling(item, parentRef.current)
        break
      }
      case keycodes.RIGHT:
      case keycodes.DOWN: {
        event.preventDefault()
        focusNextSibling(item, parentRef.current)
        break
      }
    }
  }

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
      {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <div
        {...props}
        className={styles}
        ref={parentRef}
        onKeyDown={handleKeyPress}
        role="presentation"
      />
    </AccordionPanelContext.Provider>
  )
}
