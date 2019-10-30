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

export const AccordionContext = React.createContext<ContextType>({
  expanded: false,
  name: '',
  onClick: () => {},
})

const AccordionComponent: React.FC<Props> = ({
  children,
  name,
  expanded = false,
  icon = 'left',
  onClick,
}) => {
  return (
    <AccordionContext.Provider
      value={{
        expanded,
        name,
        icon,
        onClick,
      }}
    >
      {children}
    </AccordionContext.Provider>
  )
}

export const Accordion = withTheme(AccordionComponent)
