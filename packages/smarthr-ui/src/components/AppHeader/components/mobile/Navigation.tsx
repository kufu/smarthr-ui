import React, { type FC, Fragment, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../../Text'
import { NavigationGroup, Navigation as NavigationType } from '../../types'
import { isChildNavigationGroup } from '../../utils'

import { NavigationItem } from './NavigationItem'

type Props = {
  navigations: NavigationType[] | NavigationGroup['childNavigations']
  onClickNavigation: () => void
}

const separatorClassNameGenerator = tv({
  base: ['[&&]:shr-mx-0 [&&]:shr-my-0.5 [&&]:shr-border-b-shorthand'],
})

export const Navigation: FC<Props> = ({ navigations, onClickNavigation }) => (
  <div>
    {navigations.map((navigation, i) => {
      if (isChildNavigationGroup(navigation)) {
        return (
          <ItemGroup
            key={`title-${i}`}
            navigation={navigation}
            separated={i + 1 !== navigations.length}
            onClickNavigation={onClickNavigation}
          />
        )
      }

      return (
        <TerminalItem
          key={`children-${i}`}
          navigation={navigation}
          nextNavigation={navigations[i + 1]}
          onClickNavigation={onClickNavigation}
        />
      )
    })}
  </div>
)

const ItemGroup: FC<
  Pick<Props, 'onClickNavigation'> & {
    navigation: NavigationGroup['childNavigations'][number]
    separated: boolean
  }
> = ({ navigation: { childNavigations, title }, onClickNavigation, separated }) => (
  <>
    <Text styleType="subSubBlockTitle" as="p" className="shr-py-0.5">
      {title}
    </Text>

    {childNavigations.map((childNavigation, j) => (
      <NavigationItem key={j} navigation={childNavigation} onClickNavigation={onClickNavigation} />
    ))}

    {separated && <Separator />}
  </>
)

const TerminalItem: FC<
  Pick<Props, 'onClickNavigation'> & {
    navigation: NavigationType
    nextNavigation: NavigationType | NavigationGroup['childNavigations'][number]
  }
> = ({ navigation, nextNavigation, onClickNavigation }) => (
  <>
    <NavigationItem navigation={navigation} onClickNavigation={onClickNavigation} />
    {isChildNavigationGroup(nextNavigation) && <Separator />}
  </>
)

const Separator = memo(() => <hr className={separatorClassNameGenerator()} />)
