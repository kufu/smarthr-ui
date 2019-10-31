import * as React from 'react'
import { withTheme } from '../../hocs/withTheme'

type Props = {
  children: React.ReactNode
  expanded?: boolean
  name: string
  icon?: 'left' | 'right' | 'none'
  onClick: (name: string, expanded: boolean) => void
}

type ContextType = Omit<Props, 'children'>

export const AccordionPanelItemContext = React.createContext<ContextType>({
  expanded: false,
  name: '',
  icon: 'left',
  onClick: () => {},
})

const AccordionPanelItemComponent: React.FC<Props> = ({
  children,
  name,
  expanded = false,
  icon = 'left',
  onClick,
}) => {
  return (
    <AccordionPanelItemContext.Provider
      value={{
        expanded,
        name,
        icon,
        onClick,
      }}
    >
      {children}
    </AccordionPanelItemContext.Provider>
  )
}

export const AccordionPanelItem = withTheme(AccordionPanelItemComponent)
