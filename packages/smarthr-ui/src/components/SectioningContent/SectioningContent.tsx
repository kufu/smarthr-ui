import { SectioningFragment } from './client/components'

import type { ComponentProps, ComponentPropsWithRef, FC, PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<{
  // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
  as?: 'article' | 'aside' | 'nav' | 'section'
  baseLevel?: number
}>
type PropsWithAs = BaseProps & Omit<ComponentPropsWithRef<'section'>, keyof BaseProps>
type Props = Omit<ComponentProps<typeof SectioningContent>, 'as'>

const SectioningContent: FC<PropsWithAs> = ({
  children,
  baseLevel,
  as: Wrapper = 'section',
  ref,
  ...rest
}) => (
  <Wrapper {...rest} ref={ref}>
    {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
    <SectioningFragment baseLevel={baseLevel}>{children}</SectioningFragment>
  </Wrapper>
)

export const Section: FC<Props> = SectioningContent
export const Article: FC<Props> = (props) => <SectioningContent {...props} as="article" />
export const Aside: FC<Props> = (props) => <SectioningContent {...props} as="aside" />
export const Nav: FC<Props> = (props) => <SectioningContent {...props} as="nav" />
