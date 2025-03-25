import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../Text'

type Props<TitleElement extends ElementType = 'p'> = PropsWithChildren<{
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
    groupTitle: 'shr-block shr-px-1 shr-py-0.5',
  },
})

export const SideMenuGroup = <TitleElement extends ElementType = 'p'>({
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
      <GroupTitle titleElementAs={titleElementAs} className={classNames.groupTitle}>
        {title}
      </GroupTitle>
      <ListComponent className={classNames.list}>{children}</ListComponent>
    </li>
  )
}

const GroupTitle = memo<PropsWithChildren<{ titleElementAs?: ElementType; className: string }>>(
  ({ titleElementAs: Wrapper = 'p', children, className }) => (
    <Wrapper>
      <Text color="TEXT_BLACK" leading="TIGHT" size="S" weight="bold" className={className}>
        {children}
      </Text>
    </Wrapper>
  ),
)
