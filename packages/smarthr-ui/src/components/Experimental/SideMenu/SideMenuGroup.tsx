import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../../Heading'
import { Section } from '../../SectioningContent'

type Props<TitleElement extends ElementType> = PropsWithChildren<{
  title: ReactNode
  titleElementAs?: TitleElement

  /**
   * @default ul
   */
  listElementAs?: 'ul' | 'ol'
}> &
  ComponentPropsWithoutRef<TitleElement>

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-SideMenu-group', '[&:not(:first-of-type)]:shr-mt-1'],
    list: 'shr-list-none',
    groupTitle: 'shr-px-1 shr-py-0.5 shr-text-sm',
  },
})

export const SideMenuGroup = <TitleElement extends ElementType = 'span'>({
  title,
  titleElementAs,
  listElementAs,
  children,
  className,
}: Props<TitleElement>) => {
  const classNames = useMemo(() => {
    const { wrapper, list, groupTitle } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      list: list(),
      groupTitle: groupTitle(),
    }
  }, [className])

  const ListComponent = listElementAs ?? 'ul'

  return (
    <li className={classNames.wrapper}>
      <Section>
        <GroupHeading titleElementAs={titleElementAs} className={classNames.groupTitle}>
          {title}
        </GroupHeading>
        <ListComponent className={classNames.list}>{children}</ListComponent>
      </Section>
    </li>
  )
}

const GroupHeading = memo<PropsWithChildren<{ titleElementAs?: ElementType; className: string }>>(
  ({ titleElementAs: Inner, children, className }) => (
    <Heading type="blockTitle" className={className}>
      {Inner ? <Inner>{children}</Inner> : children}
    </Heading>
  ),
)
