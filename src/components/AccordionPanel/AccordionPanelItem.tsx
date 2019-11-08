import * as React from 'react'

type Props = {
  children: React.ReactNode
  name: string
  className?: string
}

export const AccordionPanelItemContext = React.createContext<{ name: string }>({
  name: '',
})

export const AccordionPanelItem: React.FC<Props> = ({ children, name, className = '' }) => {
  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
      }}
    >
      <div className={className}>{children}</div>
    </AccordionPanelItemContext.Provider>
  )
}
