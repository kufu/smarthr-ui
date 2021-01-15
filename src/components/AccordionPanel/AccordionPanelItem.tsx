import React, { FC, createContext } from 'react'
import { useClassNames } from './useClassNames'

type Props = {
  name: string
  children: React.ReactNode
  className?: string
}

export const AccordionPanelItemContext = createContext<{ name: string }>({
  name: '',
})

export const AccordionPanelItem: FC<Props> = ({ name, children, className = '' }) => {
  const classNames = useClassNames()
  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
      }}
    >
      <div className={`${className} ${classNames.item}`}>{children}</div>
    </AccordionPanelItemContext.Provider>
  )
}
