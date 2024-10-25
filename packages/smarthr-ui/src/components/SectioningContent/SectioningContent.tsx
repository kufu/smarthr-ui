import React, {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  ReactElement,
  forwardRef,
  useMemo,
} from 'react'

import { Base } from '../Base'
import { Heading } from '../Heading'
import { Center, Cluster, Reel, Sidebar, Stack } from '../Layout'

type BaseProps = PropsWithChildren<{
  // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
  as?: 'article' | 'aside' | 'nav' | 'section'
  baseLevel?: number
}>
type SectioningContentProps = Omit<ComponentPropsWithRef<'section'>, keyof BaseProps> & BaseProps

const ALTERNATIVE_COMPONENTS = [Stack, Cluster, Center, Base, Reel, Sidebar] as any // FIXME: 型をどうにかする

const SectioningContent = forwardRef<HTMLElement, SectioningContentProps>(
  ({ children, baseLevel = 1, as: Wrapper = 'section', ...props }, ref) => {
    const actualChildren = useMemo(
      () =>
        React.Children.map(children, (item) => {
          // item が ReactElement である場合
          if (React.isValidElement(item)) {
            if (
              item.type === Section ||
              item.type === Article ||
              item.type === Aside ||
              item.type === Nav
            ) {
              return React.cloneElement(item as ReactElement, { baseLevel: baseLevel + 1 })
            }
            if (item.type === 'section') {
              // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
              return <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>
            }
            if (item.type === 'article') {
              // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
              return <Article baseLevel={baseLevel + 1}>{item.props.children}</Article>
            }
            if (item.type === 'aside') {
              // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
              return <Aside baseLevel={baseLevel + 1}>{item.props.children}</Aside>
            }
            if (item.type === 'nav') {
              // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
              return <Nav baseLevel={baseLevel + 1}>{item.props.children}</Nav>
            }
            if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'section') {
              return React.cloneElement(item as ReactElement, {
                // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
                as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
              })
            }
            if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'article') {
              return React.cloneElement(item as ReactElement, {
                // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
                as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
              })
            }
            if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'aside') {
              return React.cloneElement(item as ReactElement, {
                // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
                as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
              })
            }
            if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'nav') {
              return React.cloneElement(item as ReactElement, {
                // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
                as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
              })
            }
            if (item.type === Heading) {
              return React.cloneElement(item as ReactElement, { level: baseLevel + 1 })
            }
            return item
          } else {
            return item
          }
        }),
      [baseLevel, children],
    )

    return (
      <Wrapper {...props} ref={ref}>
        {actualChildren}
      </Wrapper>
    )
  },
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
