import React, { useCallback, useState } from 'react'

import { mapToArray, arrayToMap } from './AccordionPanelHelper'

type Props = {
  children: React.ReactNode
  icon?: 'left' | 'right' | 'none'
  expandableMultiply?: boolean
  defaultExpanded?: string[]
  className?: string
  onClick?: (expandedItems: string[]) => void
}

export const AccordionPanelContext = React.createContext<any>({
  expandedItems: '',
  icon: 'left',
  onClick: () => {},
})

export const AccordionPanel: React.FC<Props> = ({
  children,
  icon = 'left',
  expandableMultiply = false,
  defaultExpanded = [],
  className = '',
  onClick,
}) => {
  const [expandedItems, setExpanded] = useState(new Map(arrayToMap(defaultExpanded)))

  const handleClick = useCallback(
    (itemName: string, isExpanded: boolean) => {
      if (expandableMultiply) {
        isExpanded ? expandedItems.set(itemName, itemName) : expandedItems.delete(itemName)
        setExpanded(new Map(expandedItems))
      } else {
        isExpanded ? setExpanded(new Map([[itemName, itemName]])) : setExpanded(new Map())
      }
    },
    [expandableMultiply, expandedItems],
  )

  // fires onClick after state of expanded changed
  React.useEffect(() => {
    if (onClick) onClick(mapToArray(expandedItems))
  }, [expandedItems, onClick])

  return (
    <AccordionPanelContext.Provider value={{ onClick: handleClick, expandedItems, icon }}>
      <div className={className} children={children} />
    </AccordionPanelContext.Provider>
  )
}
