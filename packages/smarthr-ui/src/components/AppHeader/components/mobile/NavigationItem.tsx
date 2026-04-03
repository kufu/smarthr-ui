import { type FC, type MouseEvent, memo, useCallback, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton, Button } from '../../../Button'
import { isChildNavigation } from '../../utils'
import { commonButtonClassNameGenerator } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { MenuButton } from './MenuButton'
import { NavigationContext } from './NavigationContext'

import type {
  Navigation,
  NavigationButton as NavigationButtonType,
  NavigationCustomTag,
  NavigationGroup,
  NavigationLink as NavigationLinkType,
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

const NavigationLink = memo<NavigationLinkType & { className: string }>(
  ({ href, current, children, className }) => {
    const buttonClassName = useMemo(
      () => commonButtonClassNameGenerator({ current, boldWhenCurrent: true, className }),
      [current, className],
    )

    return (
      <AnchorButton href={href} className={buttonClassName}>
        <Translate>{children}</Translate>
      </AnchorButton>
    )
  },
)

const NavigationButton: FC<
  Pick<Props, 'onClickNavigation'> & { navigation: NavigationButtonType; className: string }
> = ({ navigation, onClickNavigation, className }) => {
  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      navigation.onClick(e)
      onClickNavigation()
    },
    [navigation, onClickNavigation],
  )

  const buttonClassName = useMemo(
    () => commonButtonClassNameGenerator({ current: navigation.current, boldWhenCurrent: true, className }),
    [navigation.current, className],
  )

  return (
    <Button type="button" onClick={onClick} className={buttonClassName}>
      <Translate>{navigation.children}</Translate>
    </Button>
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
