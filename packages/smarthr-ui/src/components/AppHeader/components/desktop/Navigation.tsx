import React, { type ComponentProps, type FC, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import {
  AppNavi,
  AppNaviAnchor,
  AppNaviButton,
  AppNaviCustomTag,
  AppNaviDropdownMenuButton,
} from '../../../AppNavi'
import { AnchorButton, Button } from '../../../Button'
import { DropdownMenuGroup } from '../../../Dropdown'
import { Cluster } from '../../../Layout'
import { commonButton } from '../common/CommonButton'

import { ReleaseNotesDropdown } from './ReleaseNotesDropdown'

import type {
  ChildNavigation,
  ChildNavigationGroup,
  NavigationButton,
  NavigationCustomTag,
  NavigationLink,
  Navigation as NavigationType,
  ReleaseNoteProps,
} from '../../types'

const classNameGenerator = tv({
  base: [
    'shr-overflow-x-auto shr-min-w-[auto]',
    'max-[751px]:!shr-hidden',
    'data-[with-releasenote="true"]:shr-pe-0',
  ],
})

type Props = {
  appName: ReactNode
  navigations: NavigationType[]
  additionalContent: ReactNode
  releaseNote?: ReleaseNoteProps | null
  enableNew?: boolean
}

export const Navigation: FC<Props> = ({
  appName,
  navigations,
  additionalContent,
  releaseNote,
  enableNew,
}) => {
  const className = useMemo(() => classNameGenerator(), [])
  const buildedNavigations = useMemo(() => buildNavigations(navigations), [navigations])

  return (
    <AppNavi
      label={enableNew ? undefined : appName}
      displayDropdownCaret
      additionalArea={
        <Cluster align="center" className="shr-flex-nowrap shr-ps-1">
          {additionalContent}
          {releaseNote && <ReleaseNotesDropdown {...releaseNote} />}
        </Cluster>
      }
      data-with-releasenote={!!releaseNote}
      className={className}
    >
      {buildedNavigations}
    </AppNavi>
  )
}

const buildNavigations = (navigations: NavigationType[]) =>
  navigations.map((navigation, index) => {
    if ('elementAs' in navigation) {
      const { elementAs, ...rest } = navigation

      return <AppNaviCustomTag {...rest} key={index} tag={navigation.elementAs} />
    }
    if ('href' in navigation) {
      return <AppNaviAnchor {...navigation} key={index} />
    }
    if ('childNavigations' in navigation) {
      return (
        <AppNaviDropdownMenuButton key={index} label={navigation.children}>
          {buildDropdownMenu(navigation.childNavigations)}
        </AppNaviDropdownMenuButton>
      )
    }

    return <AppNaviButton {...navigation} key={index} />
  })

const buildDropdownMenu = (navigations: Array<ChildNavigation | ChildNavigationGroup>) =>
  navigations.map((navigation, index) => {
    if ('elementAs' in navigation) {
      return <DropdownCustomTag {...navigation} key={index} />
    }
    if ('href' in navigation) {
      return <DropdownMenuAnchorButton {...navigation} key={index} />
    }
    if ('title' in navigation) {
      return (
        <DropdownMenuGroup key={index} name={navigation.title}>
          {buildDropdownMenu(navigation.childNavigations)}
        </DropdownMenuGroup>
      )
    }

    return <DropdownNavigationButton {...navigation} key={index} />
  })

const DropdownCustomTag = memo<NavigationCustomTag>(
  ({ elementAs: Component, current, className, ...rest }) => {
    const actualClassName = useMemo(
      () =>
        commonButton({
          current,
          className,
        }),
      [current, className],
    )

    return <Component {...rest} aria-current={current} className={actualClassName} />
  },
)
const DropdownMenuAnchorButton = memo<NavigationLink>(({ current, ...rest }) => (
  <AnchorButton {...rest} aria-current={current && 'page'} />
))
const DropdownNavigationButton = memo<NavigationButton>(({ current, ...rest }) => (
  <Button {...rest} aria-current={current && 'page'} />
))
