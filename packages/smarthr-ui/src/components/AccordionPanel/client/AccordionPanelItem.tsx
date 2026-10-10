'use client'

import { type FC, createContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Section } from '../../SectioningContent'

import type { SHRComponentPropsWithoutRef } from '../../../types'

type Props = SHRComponentPropsWithoutRef<
  'section',
  {
    /** アイテムを識別するための名前 */
    name: string
  }
>

export const AccordionPanelItemContext = createContext<{
  name: string
  triggerId: string
  contentId: string
}>({
  name: '',
  triggerId: '',
  contentId: '',
})

const classNameGenerator = tv({
  base: ['smarthr-ui-AccordionPanel-item', '[&_+_&]:shr-border-t-shorthand'],
})

export const AccordionPanelItem: FC<Props> = ({ name, className, children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <AccordionPanelItemContext.Provider
      value={{
        name,
        triggerId: `${name}-trigger`,
        contentId: `${name}-content`,
      }}
    >
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content -- 組み合わせて利用するAccordionPanelTriggerが内部でHeadingを持つ */}
      <Section {...rest} className={actualClassName}>
        {children}
      </Section>
    </AccordionPanelItemContext.Provider>
  )
}
