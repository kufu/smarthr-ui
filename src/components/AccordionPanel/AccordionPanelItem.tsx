import React, { FC, createContext } from 'react'

type Props = {
  name: string
  children: React.ReactNode
  className?: string
}

export const AccordionPanelItemContext = createContext<{ name: string }>({
  name: '',
})

export const AccordionPanelItem: FC<Props> = ({ name, children, className = '' }) => (
  <AccordionPanelItemContext.Provider
    value={{
      name,
    }}
  >
    <div className={className}>{children}</div>
  </AccordionPanelItemContext.Provider>
)
