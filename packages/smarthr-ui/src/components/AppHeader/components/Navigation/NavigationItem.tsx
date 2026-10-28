'use client'

import { type FC, type MouseEvent, memo, useMemo } from 'react'

import { useLatest } from '../../../../hooks/useLatest'
import { AnchorButton } from '../../../Button'
import { CommonButton, commonButtonClassNameGenerator } from '../common/CommonButton'
import { MenuButton } from '../common/MenuButton'

import { isChildNavigation } from './utils'

import type {
  Navigation,
  NavigationButton,
  NavigationCustomTag,
  NavigationGroup,
  NavigationLink,
} from '../../types'

type Props = {
  navigation: Navigation
  handleClickNavigation: () => void
  handleOpenNavigationGroup: (navigation: NavigationGroup) => void
}

export const NavigationItem: FC<Props> = ({
  navigation,
  handleClickNavigation,
  handleOpenNavigationGroup,
}) => {
  const className = 'shr-px-0.5'

  if ('elementAs' in navigation) {
    return (
      <NavigationCustomTag
        {...navigation}
        className={`${className} ${navigation.className}`}
        handleClickNavigation={handleClickNavigation}
      />
    )
  }

  if ('href' in navigation) {
    return <NavigationLink {...navigation} className={className} />
  }

  if ('onClick' in navigation) {
    return (
      <NavigationButton
        navigation={navigation}
        className={className}
        handleClickNavigation={handleClickNavigation}
      />
    )
  }

  return (
    <NavigationGroupMenuButton
      navigation={navigation}
      handleOpenNavigationGroup={handleOpenNavigationGroup}
    />
  )
}

const NavigationCustomTag = memo<
  NavigationCustomTag & Pick<Props, 'handleClickNavigation'> & { className: string }
>(({ children, elementAs: Tag, current, className, handleClickNavigation, ...rest }) => {
  const actualClassName = useMemo(
    () =>
      commonButtonClassNameGenerator({
        current,
        boldWhenCurrent: true,
        className,
      }),
    [current, className],
  )

  return (
    <AnchorButton
      {...rest}
      elementAs={Tag}
      variant="text"
      wide
      className={actualClassName}
      onClick={handleClickNavigation}
    >
      {children}
    </AnchorButton>
  )
})

const NavigationLink = memo<NavigationLink & { className: string }>(
  ({ href, current, children, className }) => (
    <CommonButton elementAs="a" href={href} current={current} boldWhenCurrent className={className}>
      {children}
    </CommonButton>
  ),
)

const NavigationButton: FC<
  Pick<Props, 'handleClickNavigation'> & { navigation: NavigationButton; className: string }
> = ({ navigation, handleClickNavigation, className }) => {
  const latest = useLatest({ navigation, handleClickNavigation })

  const functions = useMemo(
    () => ({
      handleClick: (e: MouseEvent<HTMLButtonElement>) => {
        latest.navigation.onClick(e)
        latest.handleClickNavigation()
      },
    }),
    [latest],
  )

  return (
    <CommonButton
      elementAs="button"
      type="button"
      current={navigation.current}
      boldWhenCurrent
      className={className}
      handleClick={functions.handleClick}
    >
      {navigation.children}
    </CommonButton>
  )
}

const NavigationGroupMenuButton: FC<
  Pick<Props, 'handleOpenNavigationGroup'> & { navigation: NavigationGroup }
> = ({ navigation, handleOpenNavigationGroup }) => {
  const latest = useLatest({ navigation, handleOpenNavigationGroup })

  const functions = useMemo(
    () => ({
      handleClick: () => latest.handleOpenNavigationGroup(latest.navigation),
    }),
    [latest],
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
    <MenuButton isCurrent={isCurrent} handleClick={functions.handleClick}>
      {navigation.children}
    </MenuButton>
  )
}
