import React, {
  ComponentPropsWithoutRef,
  FC,
  PropsWithChildren,
  createContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Section } from '../SectioningContent'

type Props = PropsWithChildren<{
  /** アイテムを識別するための名前 */
  name: string
}>

type ElementProps = Omit<ComponentPropsWithoutRef<'section'>, keyof Props>

export const AccordionPanelItemContext = createContext<{ name: string }>({
  name: '',
})

const accordionPanelItem = tv({
  base: 'smarthr-ui-AccordionPanel-item',
})

export const AccordionPanelItem: FC<Props & ElementProps> = ({ name, className, ...props }) => {
  const styles = useMemo(() => accordionPanelItem({ className }), [className])
  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
      }}
    >
      <Section {...props} className={styles} />
    </AccordionPanelItemContext.Provider>
  )
}
