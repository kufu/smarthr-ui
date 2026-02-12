'use client'

import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  forwardRef,
  useContext,
} from 'react'

import { LevelContext } from './levelContext'

type AbstractProps = PropsWithChildren<{
  // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
  as?: 'article' | 'aside' | 'nav' | 'section'
  baseLevel?: number
}>
type PropsWithAs = AbstractProps & Omit<ComponentPropsWithRef<'section'>, keyof AbstractProps>
type Props = Omit<ComponentProps<typeof SectioningContent>, 'as'>

const SectioningContent = forwardRef<HTMLElement, PropsWithAs>(
  ({ children, baseLevel, as: Wrapper = 'section', ...rest }, ref) => (
    <Wrapper {...rest} ref={ref}>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <SectioningFragment baseLevel={baseLevel}>{children}</SectioningFragment>
    </Wrapper>
  ),
)

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
