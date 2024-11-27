'use client'

import React, { ComponentPropsWithRef, FC, PropsWithChildren, forwardRef, useContext } from 'react'

import { LevelContext } from './levelContext'

type BaseProps = PropsWithChildren<{
  // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
  as?: 'article' | 'aside' | 'nav' | 'section'
  baseLevel?: number
}>
type SectioningContentProps = Omit<ComponentPropsWithRef<'section'>, keyof BaseProps> & BaseProps

const SectioningContent = forwardRef<HTMLElement, SectioningContentProps>(
  ({ children, baseLevel, as: Wrapper = 'section', ...props }, ref) => (
    <Wrapper {...props} ref={ref}>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <SectioningFragment baseLevel={baseLevel}>{children}</SectioningFragment>
    </Wrapper>
  ),
)

type Props = Omit<React.ComponentProps<typeof SectioningContent>, 'as'>

export const Section: FC<Props> = SectioningContent
export const Article: FC<Props> = forwardRef<HTMLElement, Props>((props, ref) => (
  <SectioningContent {...props} ref={ref} as="article" />
))
export const Aside: FC<Props> = forwardRef<HTMLElement, Props>((props, ref) => (
  <SectioningContent {...props} ref={ref} as="aside" />
))
export const Nav: FC<Props> = forwardRef<HTMLElement, Props>((props, ref) => (
  <SectioningContent {...props} ref={ref} as="nav" />
))

export const SectioningFragment: FC<PropsWithChildren<{ baseLevel?: number }>> = ({
  children,
  baseLevel,
}) => {
  const level = useContext(LevelContext)

  return <LevelContext.Provider value={baseLevel || level + 1}>{children}</LevelContext.Provider>
}
