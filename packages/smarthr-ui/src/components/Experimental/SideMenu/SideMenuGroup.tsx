import React, { ElementType, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../Text'

type Props<TitleElement extends ElementType = 'p'> = {
  title: ReactNode
  titleElementAs?: TitleElement

  /**
   * @default ul
   */
  listElementAs?: 'ul' | 'ol'
  children?: ReactNode
  className?: string
}

const sideMenuGroup = tv({
  slots: {
    wrapper: ['smarthr-ui-SideMenu-group', '[&:not(:first-of-type)]:shr-pt-1'],
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
  const { wrapperStyle, listStyle, groupTitleStyle } = useMemo(() => {
    const { wrapper, list, groupTitle } = sideMenuGroup()
    return {
      wrapperStyle: wrapper({ className }),
      listStyle: list(),
      groupTitleStyle: groupTitle(),
    }
  }, [className])

  const TitleComponent = titleElementAs ?? 'p'
  const ListComponent = listElementAs ?? 'ul'

  return (
    <li className={wrapperStyle}>
      <TitleComponent>
        <Text color="TEXT_BLACK" leading="TIGHT" size="S" weight="bold" className={groupTitleStyle}>
          {title}
        </Text>
      </TitleComponent>
      <ListComponent className={listStyle}>{children}</ListComponent>
    </li>
  )
}
