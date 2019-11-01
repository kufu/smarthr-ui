import * as React from 'react'
import { withTheme } from '../../hocs/withTheme'

type Props = {
  children: React.ReactNode
  name: string
}

type ContextType = Omit<Props, 'children'>

export const AccordionPanelItemContext = React.createContext<ContextType>({
  name: '',
})

const AccordionPanelItemComponent: React.FC<Props> = ({ children, name }) => {
  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
      }}
    >
      {children}
    </AccordionPanelItemContext.Provider>
  )
}

export const AccordionPanelItem = withTheme(AccordionPanelItemComponent)
