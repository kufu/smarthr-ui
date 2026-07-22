import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
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
  handleClickNavigation: () => void
}

const separatorClassNameGenerator = tv({
  base: ['[&&]:shr-border-b-shorthand [&&]:shr-mx-0 [&&]:shr-my-0.5'],
})

export const Navigation: FC<Props> = ({ navigations, handleClickNavigation }) => (
  <div>
    {navigations.map((navigation, i) =>
      isChildNavigationGroup(navigation) ? (
        <ItemGroup
          key={i}
          navigation={navigation}
          separated={i + 1 !== navigations.length}
          handleClickNavigation={handleClickNavigation}
        />
      ) : (
        <TerminalItem
          key={i}
          navigation={navigation}
          nextNavigation={navigations[i + 1]}
          handleClickNavigation={handleClickNavigation}
        />
      ),
    )}
  </div>
)

const ItemGroup: FC<
  Pick<Props, 'handleClickNavigation'> & {
    navigation: ChildNavigationGroup
    separated: boolean
  }
> = ({ navigation: { childNavigations, title }, handleClickNavigation, separated }) => (
  <>
    <ItemGroupTitleText>{title}</ItemGroupTitleText>
    {childNavigations.map((childNavigation, j) => (
      <NavigationItem
        key={j}
        navigation={childNavigation}
        handleClickNavigation={handleClickNavigation}
      />
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
  Pick<Props, 'handleClickNavigation'> & {
    navigation: NavigationType
    nextNavigation: NavigationType | NavigationGroup['childNavigations'][number]
  }
> = ({ navigation, nextNavigation, handleClickNavigation }) => {
  const isSeparated = useMemo(() => isChildNavigationGroup(nextNavigation), [nextNavigation])

  return (
    <>
      <NavigationItem navigation={navigation} handleClickNavigation={handleClickNavigation} />
      {isSeparated && <Separator />}
    </>
  )
}

const Separator = memo(() => <hr className={separatorClassNameGenerator()} />)
