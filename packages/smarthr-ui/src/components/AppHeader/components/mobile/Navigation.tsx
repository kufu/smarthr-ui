import React, { FC, Fragment } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../../Text'
import { NavigationGroup, Navigation as NavigationType } from '../../types'
import { isChildNavigationGroup } from '../../utils'

import { NavigationItem } from './NavigationItem'

type Props = {
  navigations: NavigationType[] | NavigationGroup['childNavigations']
  onClickNavigation: () => void
}

const separator = tv({
  base: ['[&&]:shr-mx-0 [&&]:shr-my-0.5 [&&]:shr-border-b-shorthand'],
})

export const Navigation: FC<Props> = ({ navigations, onClickNavigation }) => (
  <div>
    {navigations.map((navigation, i) => {
      if (isChildNavigationGroup(navigation)) {
        const { childNavigations } = navigation

        return (
          <Fragment key={`title-${i}`}>
            <Text styleType="subSubBlockTitle" as="p" className="shr-py-0.5">
              {navigation.title}
            </Text>

            {childNavigations.map((childNavigation) => (
              <NavigationItem
                key={childNavigation.children.toString()}
                navigation={childNavigation}
                onClickNavigation={onClickNavigation}
              />
            ))}

            {i + 1 !== navigations.length && <hr className={separator()} />}
          </Fragment>
        )
      }

      const nextNavigation = navigations[i + 1]

      return (
        <Fragment key={`children-${i}`}>
          <NavigationItem navigation={navigation} onClickNavigation={onClickNavigation} />
          {isChildNavigationGroup(nextNavigation) && <hr className={separator()} />}
        </Fragment>
      )
    })}
  </div>
)
