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
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'li'>, keyof AbstractProps>

export const DetailsItemContext = createContext<{ name: string }>({
  name: '',
})

const liClassNameGenerator = tv({
  base: ['smarthr-ui-Details-item', '[&_+_&]:shr-border-t-shorthand'],
})

const sectionClassNameGenerator = tv({
  base: 'shr-contents',
})

export const DetailsItem: FC<Props> = ({ name, className, children, ...rest }) => {
  const liClassName = useMemo(() => liClassNameGenerator({ className }), [className])
  const sectionClassName = useMemo(() => sectionClassNameGenerator(), [])

  return (
    <DetailsItemContext.Provider
      value={{
        name,
      }}
    >
      <li {...rest} className={liClassName}>
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content -- Summary 内に Heading が含まれている */}
        <Section className={sectionClassName}>{children}</Section>
      </li>
    </DetailsItemContext.Provider>
  )
}
