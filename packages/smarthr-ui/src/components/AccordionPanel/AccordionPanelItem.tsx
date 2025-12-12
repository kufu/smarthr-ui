'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  createContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Section } from '../SectioningContent'

type AbstractProps = PropsWithChildren<{
  /** アイテムを識別するための名前 */
  name: string
}>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'section'>, keyof AbstractProps>

export const AccordionPanelItemContext = createContext<{ name: string }>({
  name: '',
})

const classNameGenerator = tv({
  base: ['smarthr-ui-AccordionPanel-item', '[&_+_&]:shr-border-t-shorthand'],
})

export const AccordionPanelItem: FC<Props> = ({ name, className, ...props }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
      }}
    >
      <Section {...props} className={actualClassName} />
    </AccordionPanelItemContext.Provider>
  )
}
