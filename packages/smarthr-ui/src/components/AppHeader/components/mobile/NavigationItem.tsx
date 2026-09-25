'use client'

import { type FC, type MouseEvent, memo, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../../../hooks/useLatest'
import { isChildNavigation } from '../../utils'
import { CommonButton, commonButtonClassNameGenerator } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { MenuButton } from './MenuButton'
import { NavigationContext } from './NavigationContext'

import type {
  Navigation,
  NavigationButton,
  NavigationCustomTag,
  NavigationGroup,
  NavigationLink,
} from '../../types'

const classNameGenerator = tv({
  base: ['[&&]:shr-px-0.5'],
})

type Props = { navigation: Navigation; handleClickNavigation: () => void }

export const NavigationItem: FC<Props> = ({ navigation, handleClickNavigation }) => {
  const className = classNameGenerator()

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

  return <NavigationGroupMenuButton navigation={navigation} />
}

const NavigationCustomTag = memo<
  NavigationCustomTag & Pick<Props, 'handleClickNavigation'> & { className: string }
>(
  ({
    children,
    elementAs: Tag,
    current,
    className,
    handleClickNavigation: handleDelegateClick,
    ...rest
  }) => {
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
      <Tag {...rest} className={actualClassName} onClick={handleDelegateClick}>
        <Translate>{children}</Translate>
      </Tag>
    )
  },
)

const NavigationLink = memo<NavigationLink & { className: string }>(
  ({ href, current, children, className }) => (
    <CommonButton elementAs="a" href={href} current={current} boldWhenCurrent className={className}>
      <Translate>{children}</Translate>
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
      <Translate>{navigation.children}</Translate>
    </CommonButton>
  )
}

const NavigationGroupMenuButton: FC<{ navigation: NavigationGroup }> = ({ navigation }) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)

  const latest = useLatest({ navigation, setSelectedNavigationGroup })

  const functions = useMemo(
    () => ({
      handleClick: () => latest.setSelectedNavigationGroup(latest.navigation),
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
