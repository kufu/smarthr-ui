import React, { HTMLAttributes, useCallback, useEffect, useState } from 'react'

import { flatArrayToMap } from '../../libs/map'
import { getNewExpandedItems } from './accordionPanelHelper'
import { useClassNames } from './useClassNames'

type Props = {
  children: React.ReactNode
  iconPosition?: 'left' | 'right'
  displayIcon?: boolean
  expandableMultiply?: boolean
  defaultExpanded?: string[]
  className?: string
  onClick?: (expandedItems: string[]) => void
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const AccordionPanelContext = React.createContext<{
  iconPosition: 'left' | 'right'
  displayIcon: boolean
  expandedItems: Map<string, string>
  expandableMultiply: boolean
  onClickTrigger?: (itemName: string, isExpanded: boolean) => void
  onClickProps?: (expandedItems: string[]) => void
}>({
  iconPosition: 'left',
  displayIcon: true,
  expandedItems: new Map(),
  expandableMultiply: false,
})

export const AccordionPanel: React.FC<Props & ElementProps> = ({
  children,
  iconPosition = 'left',
  displayIcon = true,
  expandableMultiply = false,
  defaultExpanded = [],
  className = '',
  onClick: onClickProps,
  ...props
}) => {
  const [expandedItems, setExpanded] = useState(flatArrayToMap(defaultExpanded))
  const classNames = useClassNames()

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
        displayIcon,
        expandableMultiply,
      }}
    >
      <div className={`${className} ${classNames.wrapper}`} {...props}>
        {children}
      </div>
    </AccordionPanelContext.Provider>
  )
}
