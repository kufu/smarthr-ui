/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import React, {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
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
const adjustChildrenHeadingLevel = (children: ReactNode, baseLevel: number): ReactNode =>
  React.Children.map(children, (item): ReactNode => {
    // item が ReactElement である場合
    if (React.isValidElement(item)) {
      if (
        item.type === Section ||
        item.type === Article ||
        item.type === Aside ||
        item.type === Nav
      ) {
        return React.cloneElement(item as ReactElement, { baseLevel: baseLevel + 1 })
      } else if (item.type === 'section') {
        return <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>
      } else if (item.type === 'article') {
        return <Article baseLevel={baseLevel + 1}>{item.props.children}</Article>
      } else if (item.type === 'aside') {
        return <Aside baseLevel={baseLevel + 1}>{item.props.children}</Aside>
      } else if (item.type === 'nav') {
        return <Nav baseLevel={baseLevel + 1}>{item.props.children}</Nav>
      } else if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'section') {
        return React.cloneElement(item as ReactElement, {
          as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
        })
      } else if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'article') {
        return React.cloneElement(item as ReactElement, {
          as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
        })
      } else if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'aside') {
        return React.cloneElement(item as ReactElement, {
          as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
        })
      } else if (ALTERNATIVE_COMPONENTS.includes(item.type) && item.props.as === 'nav') {
        return React.cloneElement(item as ReactElement, {
          as: () => <Section baseLevel={baseLevel + 1}>{item.props.children}</Section>,
        })
      } else if (item.type === Heading) {
        return React.cloneElement(item as ReactElement, { level: baseLevel + 1 })
      } else if (item.props.children) {
        return React.cloneElement(item as ReactElement, {
          children: adjustChildrenHeadingLevel(item.props.children, baseLevel),
        })
      }
      return item
    } else {
      return item
    }
  })

const SectioningContent = forwardRef<HTMLElement, SectioningContentProps>(
  ({ children, baseLevel = 1, as: Wrapper = 'section', ...props }, ref) => {
    const actualChildren = useMemo(
      () => adjustChildrenHeadingLevel(children, baseLevel),
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
