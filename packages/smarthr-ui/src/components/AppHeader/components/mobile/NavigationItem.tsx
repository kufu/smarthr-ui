import React, { FC, useCallback, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { Navigation, NavigationButton } from '../../types'
import { isChildNavigation } from '../../utils'
import { CommonButton, commonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { MenuButton } from './MenuButton'
import { NavigationContext } from './NavigationContext'

const navigationItem = tv({
  base: ['[&&]:shr-px-0.5'],
})

type Props = { navigation: Navigation; onClickNavigation: () => void }

export const NavigationItem: FC<Props> = ({ navigation, onClickNavigation }) => {
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
      <OnClickableButton
        navigation={navigation}
        onClickNavigation={onClickNavigation}
        className={itemStyle}
      />
    )
  }

  return <ItemMenuButton navigation={navigation} />
}

const OnClickableButton = React.memo<
  Pick<Props, 'onClickNavigation'> & { navigation: NavigationButton; className: string }
>(({ navigation, onClickNavigation, className }) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      navigation.onClick(e)
      onClickNavigation()
    },
    [navigation, onClickNavigation],
  )

  return (
    <CommonButton
      elementAs="button"
      type="button"
      onClick={onClick}
      current={navigation.current}
      boldWhenCurrent
      className={className}
    >
      <Translate>{navigation.children}</Translate>
    </CommonButton>
  )
})

const ItemMenuButton = React.memo<{ navigation: Navigation }>(({ navigation }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  const onClick = useCallback(
    () => setSelectedNavigationGroup(navigation),
    [navigation, setSelectedNavigationGroup],
  )

  // 自身がcurrentか、子要素に current を持っているものがあるかどうか
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
