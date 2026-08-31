import {
  type ComponentProps,
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  forwardRef,
} from 'react'

import { SectioningFragment } from './client/components'

type BaseProps = PropsWithChildren<{
  // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
  as?: 'article' | 'aside' | 'nav' | 'section'
  baseLevel?: number
}>
type PropsWithAs = BaseProps & Omit<ComponentPropsWithRef<'section'>, keyof BaseProps>
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
  <SectioningContent {...props} as="article" ref={ref} />
))
export const Aside: FC<Props> = forwardRef<HTMLElement, Props>((props, ref) => (
  <SectioningContent {...props} as="aside" ref={ref} />
))
export const Nav: FC<Props> = forwardRef<HTMLElement, Props>((props, ref) => (
  <SectioningContent {...props} as="nav" ref={ref} />
))
