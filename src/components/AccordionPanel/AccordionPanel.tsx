import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { mapToArray, arrayToMap } from './AccordionPanelHelper'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

type Props = InjectedProps & {
  children: React.ReactNode
  className?: string
  icon?: 'left' | 'right' | 'none'
  expandableMultiply?: boolean
  defaultExpanded?: string[]
  onClick?: (expandedItems: string[]) => void
}

export const AccordionPanelContext = React.createContext<any>({
  expanded: '',
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
  const [expanded, setExpanded] = useState(new Map(arrayToMap(defaultExpanded)))

  const handleClick = useCallback(
    (itemName: string, isExpanded: boolean) => {
      if (expandableMultiply) {
        isExpanded ? expanded.set(itemName, itemName) : expanded.delete(itemName)
        setExpanded(new Map(expanded))
      } else {
        isExpanded ? setExpanded(new Map([[itemName, itemName]])) : setExpanded(new Map())
      }

      if (onClick) onClick(mapToArray(expanded))
    },
    [expandableMultiply, expanded, onClick],
  )

  return (
    <AccordionPanelContext.Provider value={{ onClick: handleClick, expanded, icon }}>
      <Wrapper {...props} />
    </AccordionPanelContext.Provider>
  )
}

export const AccordionPanel = withTheme(AccordionPanelComponent)

const Wrapper = styled.div``
