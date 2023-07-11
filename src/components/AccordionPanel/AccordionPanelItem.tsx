import React, { HTMLAttributes, VFC, createContext } from 'react'

import { Section } from '../SectioningContent'

import { useClassNames } from './useClassNames'

type Props = {
  /** アイテムを識別するための名前 */
  name: string
  /** アコーディオンのアイテムの内容 */
  children: React.ReactNode
  /** アイテムのクラス名 */
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
      <Section {...props} className={`${className} ${classNames.item}`}>
        {children}
      </Section>
    </AccordionPanelItemContext.Provider>
  )
}
