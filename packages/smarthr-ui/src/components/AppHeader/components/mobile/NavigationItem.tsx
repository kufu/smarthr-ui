import React, { type FC, memo, useCallback, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type Navigation, type NavigationGroup } from '../../types'
import { isChildNavigation } from '../../utils'
import { CommonButton, commonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { MenuButton } from './MenuButton'
import { NavigationContext } from './NavigationContext'

const classNameGenerator = tv({
  base: ['[&&]:shr-px-0.5'],
})

type Props = { navigation: Navigation; onClickNavigation: () => void }

export const NavigationItem: FC<Props> = ({ navigation, onClickNavigation }) => {
  const actualClassName = classNameGenerator()

  if ('elementAs' in navigation) {
    const { children, elementAs: Tag, current, className, ...rest } = navigation

    return (
      // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
      <Tag
        {...rest}
        onClick={onClickNavigation}
        className={commonButton({
          current,
          boldWhenCurrent: true,
          className: [actualClassName, className],
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
        className={actualClassName}
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
        className={actualClassName}
      >
        <Translate>{navigation.children}</Translate>
      </CommonButton>
    )
  }

  return <MemoizedMenuButton navigation={navigation} />
}

const MemoizedMenuButton = memo<{ navigation: NavigationGroup }>(({ navigation }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  const onClick = useCallback(
    () => setSelectedNavigationGroup(navigation),
    [navigation, setSelectedNavigationGroup],
  )

  // 子要素に current を持っているものがあるかどうか
  const isCurrent = useMemo(
    () =>
      navigation.current ||
      navigation.childNavigations.some((child) => {
        if (isChildNavigation(child)) {
          return child.current
        }

        return child.childNavigations.some((c) => c.current)
      }),
    [navigation],
  )

  return (
    <MenuButton onClick={onClick} isCurrent={isCurrent}>
      <Translate>{navigation.children}</Translate>
    </MenuButton>
  )
})
