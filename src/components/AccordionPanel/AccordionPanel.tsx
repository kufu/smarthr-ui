import React, { useContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

console.log({ useContext, useCallback })

type ExpandedItems = Map<string, string>

type Props = InjectedProps & {
  children: React.ReactNode
  className?: string
  icon?: 'left' | 'right' | 'none'
  onClick?: (expandedItems: ExpandedItems) => void
}

export const AccordionPanelContext = React.createContext<any>({
  expanded: '',
  icon: 'left',
  onClick: () => {},
})

const AccordionPanelComponent: React.FC<Props> = ({ onClick, icon = 'left', ...props }) => {
  const [expanded, setExpanded] = useState(new Map())

  const handleClick = (itemName: string, isExpanded: boolean) => {
    isExpanded ? expanded.set(itemName, itemName) : expanded.delete(itemName)
    setExpanded(new Map(expanded))
    if (onClick) onClick(expanded)
  }

  return (
    <AccordionPanelContext.Provider value={{ onClick: handleClick, expanded, icon }}>
      <Wrapper {...props} />
    </AccordionPanelContext.Provider>
  )
}

export const AccordionPanel = withTheme(AccordionPanelComponent)

const Wrapper = styled.div``
