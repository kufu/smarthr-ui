import * as React from 'react'
import { withTheme } from '../../hocs/withTheme'

type Props = {
  children: React.ReactNode
  expanded?: boolean
  name: string
  onClick: (name: string, expanded: boolean) => void
}

type ContextType = Omit<Props, 'children'>

export const AccordionContext = React.createContext<ContextType>({
  expanded: false,
  name: '',
  onClick: () => {},
})

const AccordionComponent: React.FC<Props> = ({ children, name, expanded = false, onClick }) => {
  return (
    <>
      <AccordionContext.Provider
        value={{
          expanded,
          name,
          onClick,
        }}
      >
        {children}
      </AccordionContext.Provider>
    </>
  )
}

export const Accordion = withTheme(AccordionComponent)
