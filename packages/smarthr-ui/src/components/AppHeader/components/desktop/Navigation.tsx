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
import { CommonButton, commonButton } from '../common/CommonButton'

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

const buildNavigations = (
  navigations: NavigationType[],
): ComponentProps<typeof AppNavi>['children'] => (
  <>
    {navigations.map((navigation) => {
      if ('elementAs' in navigation) {
        return (
          <AppNaviCustomTag
            {...navigation}
            key={navigation.children.toString()}
            tag={navigation.elementAs}
          />
        )
      }
      if ('href' in navigation) {
        return <AppNaviAnchor {...navigation} key={navigation.children.toString()} />
      }
      if ('childNavigations' in navigation) {
        return (
          <AppNaviDropdownMenuButton
            label={navigation.children}
            key={navigation.children.toString()}
          >
            {buildDropdownMenu(navigation.childNavigations)}
          </AppNaviDropdownMenuButton>
        )
      }
      return <AppNaviButton {...navigation} key={navigation.children.toString()} />
    })}
  </>
)

const buildDropdownMenu = (
  navigations: Array<ChildNavigation | ChildNavigationGroup>,
): ComponentProps<typeof AppNaviDropdownMenuButton>['children'] => (
  <>
    {navigations.map((navigation) => {
      if ('elementAs' in navigation) {
        const Component = navigation.elementAs
        // TODO: DropdownMenuItemを作成し、elementAsを渡せるようにする
        return (
          <Component
            {...navigation}
            key={navigation.children}
            aria-current={navigation.current}
            className={commonButton({
              current: navigation.current,
              className: navigation.className,
            })}
          />
        )
      }
      if ('href' in navigation) {
        return (
          <AnchorButton
            {...navigation}
            aria-current={navigation.current && 'page'}
            key={navigation.children.toString()}
          />
        )
      }
      if ('title' in navigation) {
        return (
          <DropdownMenuGroup name={navigation.title} key={navigation.title.toString()}>
            {buildDropdownMenu(navigation.childNavigations)}
          </DropdownMenuGroup>
        )
      }
      return (
        <Button
          {...navigation}
          aria-current={navigation.current && 'page'}
          key={navigation.children.toString()}
        />
      )
    })}
  </>
)
