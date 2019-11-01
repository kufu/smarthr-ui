import React, { useCallback, useState } from 'react'

import { mapToArray, arrayToMap } from './AccordionPanelHelper'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

type Props = InjectedProps & {
  children: React.ReactNode
  icon?: 'left' | 'right' | 'none'
  expandableMultiply?: boolean
  defaultExpanded?: string[]
  onClick?: (expandedItems: string[]) => void
}

export const AccordionPanelContext = React.createContext<any>({
  expandedItems: '',
  icon: 'left',
  onClick: () => {},
})

const AccordionPanelComponent: React.FC<Props> = ({
  onClick,
  icon = 'left',
  expandableMultiply = false,
  defaultExpanded = [],
  ...props
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
      <div {...props} />
    </AccordionPanelContext.Provider>
  )
}

export const AccordionPanel = withTheme(AccordionPanelComponent)
