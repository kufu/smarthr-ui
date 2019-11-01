import * as React from 'react'

type Props = {
  children: React.ReactNode
  name: string
  className?: string
}

type ContextType = Omit<Props, 'children'>

export const AccordionPanelItemContext = React.createContext<ContextType>({
  name: '',
})

export const AccordionPanelItem: React.FC<Props> = ({ children, name, className = '' }) => {
  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
      }}
    >
      <div className={className}> {children}</div>
    </AccordionPanelItemContext.Provider>
  )
}
