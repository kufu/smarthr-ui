import { type FC, type MouseEvent, memo, useCallback, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

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

type Props = { navigation: Navigation; onClickNavigation: () => void }

export const NavigationItem: FC<Props> = ({ navigation, onClickNavigation }) => {
  const className = classNameGenerator()

  if ('elementAs' in navigation) {
    return (
      <NavigationCustomTag
        {...navigation}
        onClickNavigation={onClickNavigation}
        className={`${className} ${navigation.className}`}
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
        onClickNavigation={onClickNavigation}
        className={className}
      />
    )
  }

  return <NavigationGroupMenuButton navigation={navigation} />
}

const NavigationCustomTag = memo<
  NavigationCustomTag & Pick<Props, 'onClickNavigation'> & { className: string }
>(
  ({
    children,
    elementAs: Tag,
    current,
    className,
    onClickNavigation: onDelegateClick,
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
      <Tag {...rest} onClick={onDelegateClick} className={actualClassName}>
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
  Pick<Props, 'onClickNavigation'> & { navigation: NavigationButton; className: string }
> = ({ navigation, onClickNavigation, className }) => {
  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
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
}

const NavigationGroupMenuButton: FC<{ navigation: NavigationGroup }> = ({ navigation }) => {
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
      {navigation.children}
    </MenuButton>
  )
}
