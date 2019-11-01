import * as React from 'react'
import { withTheme } from '../../hocs/withTheme'

type Props = {
  children: React.ReactNode
  name: string
  icon?: 'left' | 'right' | 'none'
}

type ContextType = Omit<Props, 'children'>

export const AccordionPanelItemContext = React.createContext<ContextType>({
  name: '',
  icon: 'left',
})

const AccordionPanelItemComponent: React.FC<Props> = ({ children, name, icon = 'left' }) => {
  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
        icon,
      }}
    >
      {children}
    </AccordionPanelItemContext.Provider>
  )
}

export const AccordionPanelItem = withTheme(AccordionPanelItemComponent)
