import React, { FC, useCallback, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Navigation } from '../../types'
import { isChildNavigation } from '../../utils'
import { CommonButton, commonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { MenuButton } from './MenuButton'
import { NavigationContext } from './NavigationContext'

const navigationItem = tv({
  base: ['[&&]:shr-px-0.5'],
})

export const NavigationItem: FC<{ navigation: Navigation; onClickNavigation: () => void }> = ({
  navigation,
  onClickNavigation,
}) => {
  const itemStyle = useMemo(() => navigationItem(), [])

  if ('elementAs' in navigation) {
    const { children, elementAs: Tag, current, ...rest } = navigation

    return (
      /* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */
      <Tag
        {...rest}
        onClick={onClickNavigation}
        className={commonButton({
          current,
          boldWhenCurrent: true,
          className: [itemStyle, rest.className],
        })}
      >
        <Translate>{children}</Translate>
      </Tag>
    )
  }

  if ('href' in navigation) {
    return (
      <CommonButton
        elementAs="a"
        href={navigation.href}
        current={navigation.current}
        boldWhenCurrent
        className={itemStyle}
      >
        <Translate>{navigation.children}</Translate>
      </CommonButton>
    )
  }

  if ('onClick' in navigation) {
    return (
      <CommonButton
        elementAs="button"
        type="button"
        onClick={(e) => {
          navigation.onClick(e)
          onClickNavigation()
        }}
        current={navigation.current}
        boldWhenCurrent
        className={itemStyle}
      >
        <Translate>{navigation.children}</Translate>
      </CommonButton>
    )
  }

  return <ItemMenuButton navigation={navigation} />
}

const ItemMenuButton = React.memo<{ navigation: Navigation }>(({ navigation }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  const onClick = useCallback(() => setSelectedNavigationGroup(navigation), [navigation, setSelectedNavigationGroup])

  // 子要素に current を持っているものがあるかどうか
  const childrenHasCurrent = navigation.childNavigations.some((child) => {
    if (isChildNavigation(child)) {
      return child.current
    }

    return child.childNavigations.some((c) => c.current)
  })

  return (
    <MenuButton
      onClick={onClick}
      isCurrent={navigation.current || childrenHasCurrent}
    >
      <Translate>{navigation.children}</Translate>
    </MenuButton>
  )
})
