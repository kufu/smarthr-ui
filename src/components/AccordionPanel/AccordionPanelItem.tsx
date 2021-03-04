import React, { HTMLAttributes, VFC, createContext } from 'react'
import { useClassNames } from './useClassNames'

type Props = {
  name: string
  children: React.ReactNode
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const AccordionPanelItemContext = createContext<{ name: string }>({
  name: '',
})

export const AccordionPanelItem: VFC<Props & ElementProps> = ({
  name,
  children,
  className = '',
  ...props
}) => {
  const classNames = useClassNames()
  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
      }}
    >
      <div className={`${className} ${classNames.item}`} {...props}>
        {children}
      </div>
    </AccordionPanelItemContext.Provider>
  )
}
