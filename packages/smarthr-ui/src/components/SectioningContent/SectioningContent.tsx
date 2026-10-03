import { SectioningFragment } from './client/components'

import type { ComponentPropsWithRef, FC, PropsWithChildren } from 'react'

type BaseProps = PropsWithChildren<{
  // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
  as?: 'article' | 'aside' | 'nav' | 'section'
  baseLevel?: number
}>
// HINT: article/aside/nav/sectionはHTML仕様上いずれも固有のDOM interfaceを持たずHTMLElementとして
// 扱われるため、refの型は'section'を代表にしてもas指定時と差異は生じない
type PropsWithAs = BaseProps & Omit<ComponentPropsWithRef<'section'>, keyof BaseProps>
type Props = Omit<PropsWithAs, 'as'>

const SectioningContent: FC<PropsWithAs> = ({
  children,
  baseLevel,
  as: Wrapper = 'section',
  ...rest
}) => (
  <Wrapper {...rest}>
    {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
    <SectioningFragment baseLevel={baseLevel}>{children}</SectioningFragment>
  </Wrapper>
)

export const Section: FC<Props> = SectioningContent
export const Article: FC<Props> = (props) => <SectioningContent {...props} as="article" />
export const Aside: FC<Props> = (props) => <SectioningContent {...props} as="aside" />
export const Nav: FC<Props> = (props) => <SectioningContent {...props} as="nav" />
