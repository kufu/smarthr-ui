import React, { useCallback, useState } from 'react'

import { arrayToMap } from '../../libs/map'

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
  onClickTrigger: () => {},
  onClickProps: () => {},
  expandedItems: new Map(),
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
  const [expandedItems, setExpanded] = useState(new Map(arrayToMap(defaultExpanded)))

  const onClickTrigger = useCallback(
    (itemName: string, isExpanded: boolean) => {
      if (expandableMultiply) {
        const newState = new Map(expandedItems)
        isExpanded ? newState.set(itemName, itemName) : newState.delete(itemName)
        setExpanded(newState)
      } else {
        isExpanded ? setExpanded(new Map([[itemName, itemName]])) : setExpanded(new Map())
      }
    },
    [expandableMultiply, expandedItems],
  )

  return (
    <AccordionPanelContext.Provider
      value={{ onClickTrigger, onClickProps, expandedItems, iconPosition, displayIcon }}
    >
      <div className={className}>{children}</div>
    </AccordionPanelContext.Provider>
  )
}
