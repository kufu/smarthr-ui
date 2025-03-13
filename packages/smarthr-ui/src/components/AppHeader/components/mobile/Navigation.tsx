import React, { type FC, Fragment, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../../Text'
import { isChildNavigationGroup } from '../../utils'

import { NavigationItem } from './NavigationItem'

import type {
  ChildNavigationGroup,
  NavigationGroup,
  Navigation as NavigationType,
} from '../../types'

type Props = {
  navigations: NavigationType[] | NavigationGroup['childNavigations']
  onClickNavigation: () => void
}

const separatorClassNameGenerator = tv({
  base: ['[&&]:shr-mx-0 [&&]:shr-my-0.5 [&&]:shr-border-b-shorthand'],
})

export const Navigation: FC<Props> = ({ navigations, onClickNavigation }) => (
  <div>
    {navigations.map((navigation, i) =>
      isChildNavigationGroup(navigation) ? (
        <ItemGroup
          key={i}
          navigation={navigation}
          separated={i + 1 !== navigations.length}
          onClickNavigation={onClickNavigation}
        />
      ) : (
        <TerminalItem
          key={i}
          navigation={navigation}
          nextNavigation={navigations[i + 1]}
          onClickNavigation={onClickNavigation}
        />
      ),
    )}
  </div>
)

const ItemGroup: FC<
  Pick<Props, 'onClickNavigation'> & {
    navigation: ChildNavigationGroup
    separated: boolean
  }
> = ({ navigation: { childNavigations, title }, onClickNavigation, separated }) => (
  <>
    <ItemGroupTitleText>{title}</ItemGroupTitleText>
    {childNavigations.map((childNavigation, j) => (
      <NavigationItem key={j} navigation={childNavigation} onClickNavigation={onClickNavigation} />
    ))}
    {separated && <Separator />}
  </>
)

const ItemGroupTitleText = memo<PropsWithChildren>(({ children }) => (
  <Text styleType="subSubBlockTitle" as="p" className="shr-py-0.5">
    {children}
  </Text>
))

const TerminalItem: FC<
  Pick<Props, 'onClickNavigation'> & {
    navigation: NavigationType
    nextNavigation: NavigationType | NavigationGroup['childNavigations'][number]
  }
> = ({ navigation, nextNavigation, onClickNavigation }) => {
  const isSeparated = useMemo(() => isChildNavigationGroup(nextNavigation), [nextNavigation])

  return (
    <>
      <NavigationItem navigation={navigation} onClickNavigation={onClickNavigation} />
      {isSeparated && <Separator />}
    </>
  )
}

const Separator = memo(() => <hr className={separatorClassNameGenerator()} />)
