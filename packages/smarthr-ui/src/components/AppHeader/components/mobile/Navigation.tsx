import React, { FC, Fragment, PropsWithChildren, useMemo } from 'react'
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
    {navigations.map((navigation, i) => (
      <MemoizedNavigationItem
        key={i}
        navigation={navigation}
        onClickNavigation={onClickNavigation}
      />
    ))}
  </div>
)

const MemoizedNavigationItem = React.memo<
  Pick<Props, 'onClickNavigation'> & { navigation: NavigationType }
>(({ navigation, onClickNavigation }) => {
  if (isChildNavigationGroup(navigation)) {
    const { childNavigations } = navigation

    return (
      <Fragment>
        <ItemTitleText>{navigation.title}</ItemTitleText>

        {childNavigations.map((childNavigation, j) => (
          <NavigationItem
            key={j}
            navigation={childNavigation}
            onClickNavigation={onClickNavigation}
          />
        ))}

        {i + 1 !== navigations.length && <StyledHr />}
      </Fragment>
    )
  }

  const nextNavigation = navigations[i + 1]

  return (
    <Fragment>
      <NavigationItem navigation={navigation} onClickNavigation={onClickNavigation} />
      {isChildNavigationGroup(nextNavigation) && <StyledHr />}
    </Fragment>
  )
})

const ItemTitleText = React.memo<PropsWithChildren>(({ children }) => (
  <Text styleType="subSubBlockTitle" as="p" className="shr-py-0.5">
    {children}
  </Text>
))

const StyledHr = React.memo(() => {
  const style = useMemo(() => separator(), [])

  return <hr className={style} />
})
