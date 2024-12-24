import React, { FC, useContext } from 'react'
import { tv } from 'tailwind-variants'

import { Navigation } from '../../types'
import { isChildNavigation } from '../../utils'
import { CommonButton, commonButton } from '../common/CommonButton'
import { Translate } from '../common/Translate'

import { MenuButton } from './MenuButton'
import { NavigationContext } from './NavigationContext'

const navigationItem = tv({
  base: ['[&&]:shr-px-0.5'],
})

export const NavigationItem: FC<{ navigation: Navigation; onClickNavigation: () => void }> = ({
  navigation,
  onClickNavigation,
}) => {
  const { setSelectedNavigationGroup } = useContext(NavigationContext)
  const navigationItemStyle = navigationItem()

  if ('elementAs' in navigation) {
    const { children, elementAs: Tag, current, ...rest } = navigation

    return (
      <>
        {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
        <Tag
          {...rest}
          onClick={onClickNavigation}
          className={commonButton({
            current,
            boldWhenCurrent: true,
            className: [navigationItemStyle, rest.className],
          })}
        >
          <Translate>{children}</Translate>
        </Tag>
      </>
    )
  }

  if ('href' in navigation) {
    return (
      <CommonButton
        elementAs="a"
        href={navigation.href}
        current={navigation.current}
        boldWhenCurrent
        className={navigationItemStyle}
      >
        <Translate>{navigation.children}</Translate>
      </CommonButton>
    )
  }

  if ('onClick' in navigation) {
    return (
      <CommonButton
        elementAs="button"
        type="button"
        onClick={(e) => {
          navigation.onClick(e)
          onClickNavigation()
        }}
        current={navigation.current}
        boldWhenCurrent
        className={navigationItemStyle}
      >
        <Translate>{navigation.children}</Translate>
      </CommonButton>
    )
  }

  // 子要素に current を持っているものがあるかどうか
  const childrenHasCurrent = navigation.childNavigations.some((child) => {
    if (isChildNavigation(child)) {
      return child.current
    }

    return child.childNavigations.some((c) => c.current)
  })

  return (
    <MenuButton
      onClick={() => setSelectedNavigationGroup(navigation)}
      isCurrent={navigation.current || childrenHasCurrent}
    >
      <Translate>{navigation.children}</Translate>
    </MenuButton>
  )
}
