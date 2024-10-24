import React, {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  ReactElement,
  forwardRef,
  useMemo,
} from 'react'

import { Heading } from '../Heading'

type BaseProps = PropsWithChildren<{
  // via https://html.spec.whatwg.org/multipage/dom.html#sectioning-content
  as?: 'article' | 'aside' | 'nav' | 'section'
  baseLevel?: number
}>
type SectioningContentProps = Omit<ComponentPropsWithRef<'section'>, keyof BaseProps> & BaseProps

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
              item.type === Nav ||
              item.type === 'section' ||
              item.type === 'article' ||
              item.type === 'aside' ||
              item.type === 'nav'
            ) {
              return React.cloneElement(item as ReactElement, { baseLevel: baseLevel + 1 })
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
