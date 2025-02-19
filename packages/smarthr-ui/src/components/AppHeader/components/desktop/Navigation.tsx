import React, { ComponentProps, FC, ReactNode } from 'react'
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
import {
  ChildNavigation,
  ChildNavigationGroup,
  Navigation as NavigationType,
  ReleaseNoteProps,
} from '../../types'
import { commonButton } from '../common/CommonButton'

import { ReleaseNotesDropdown } from './ReleaseNotesDropdown'

const appNavi = tv({
  base: ['shr-overflow-x-auto shr-min-w-[auto]', 'max-[751px]:!shr-hidden'],
  variants: {
    withReleaseNote: {
      true: ['[&&]:shr-pe-0'],
    },
  },
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
}) => (
  <AppNavi
    label={enableNew ? undefined : appName}
    className={appNavi({ withReleaseNote: !!releaseNote })}
    displayDropdownCaret
    additionalArea={
      <Cluster align="center" className="shr-flex-nowrap shr-ps-1">
        {additionalContent}
        {releaseNote && <ReleaseNotesDropdown {...releaseNote} />}
      </Cluster>
    }
  >
    {buildNavigations(navigations)}
  </AppNavi>
)

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
      const { elementAs: Component, current, className, ...rest } = navigation

      // TODO: DropdownMenuItemを作成し、elementAsを渡せるようにする
      return (
        <Component
          {...rest}
          key={index}
          aria-current={current}
          className={commonButton({
            current,
            className,
          })}
        />
      )
    }
    if ('href' in navigation) {
      const { current, ...rest } = navigation

      return <AnchorButton {...rest} key={index} aria-current={current && 'page'} />
    }

    if ('title' in navigation) {
      return (
        <DropdownMenuGroup key={index} name={navigation.title}>
          {buildDropdownMenu(navigation.childNavigations)}
        </DropdownMenuGroup>
      )
    }

    const { current, ...rest } = navigation

    return <Button {...rest} key={index} aria-current={current && 'page'} />
  })
