import React, { useCallback, useState, useEffect } from 'react'

import { flatArrayToMap } from '../../libs/map'
import { getNewExpandedItems } from './accordionPanelHelper'

type Props = {
  children: React.ReactNode
  iconPosition?: 'left' | 'right'
  displayIcon?: boolean
  expandableMultiply?: boolean
  defaultExpanded?: string[]
  className?: string
  onClick?: (expandedItems: string[]) => void
}

export const AccordionPanelContext = React.createContext<any>({
  iconPosition: 'left',
  displayIcon: true,
  expandedItems: new Map(),
  expandableMultiply: false,
  onClickTrigger: () => {},
  onClickProps: () => {},
})

export const AccordionPanel: React.FC<Props> = ({
  children,
  iconPosition = 'left',
  displayIcon = true,
  expandableMultiply = false,
  defaultExpanded = [],
  className = '',
  onClick: onClickProps,
}) => {
  const [expandedItems, setExpanded] = useState(flatArrayToMap(defaultExpanded))

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
      <div className={className}>{children}</div>
    </AccordionPanelContext.Provider>
  )
}
