import * as React from 'react'
import { withTheme } from '../../hocs/withTheme'

type Props = {
  children: React.ReactNode
  expanded?: boolean
  name: string
  icon?: 'left' | 'right' | 'none'
  onClick: (name: string, expanded: boolean) => void
}

type ContextType = Omit<Props, 'children' | 'bordered'>

export const AccordionPanelContext = React.createContext<ContextType>({
  expanded: false,
  name: '',
  onClick: () => {},
})

const AccordionPanelComponent: React.FC<Props> = ({
  children,
  name,
  expanded = false,
  icon = 'left',
  onClick,
}) => {
  return (
    <AccordionPanelContext.Provider
      value={{
        expanded,
        name,
        icon,
        onClick,
      }}
    >
      {children}
    </AccordionPanelContext.Provider>
  )
}

export const AccordionPanel = withTheme(AccordionPanelComponent)
