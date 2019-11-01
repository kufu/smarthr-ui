import React, { useContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

console.log({ useContext, useCallback })

type Props = InjectedProps & {
  children: React.ReactNode
  className?: string
  onClick?: (expandedItem: string) => void
}

export const AccordionPanelContext = React.createContext<any>({
  expanded: '',
  onClick: () => {},
})

const AccordionPanelComponent: React.FC<Props> = ({ onClick, ...props }) => {
  const [expanded, setExpanded] = useState('')

  const handleClick = (itemName: string) => {
    setExpanded(itemName)
    if (onClick) onClick(expanded)
  }

  return (
    <AccordionPanelContext.Provider value={{ onClick: handleClick, expanded }}>
      <Wrapper {...props} />
    </AccordionPanelContext.Provider>
  )
}

export const AccordionPanel = withTheme(AccordionPanelComponent)

const Wrapper = styled.div``
