import { type FC, type ReactNode, memo, useMemo } from 'react'
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
    'shr-min-w-[auto] shr-overflow-x-auto',
    'max-[751px]:!shr-hidden',
    'data-[with-releasenote="true"]:shr-pe-0',
  ],
})

// eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
const CLASS_NAME = classNameGenerator()

// HINT: カスタムタグの項目は、他の項目より行間が広く current 時に背景色が付く見た目を維持するための上書き
// shr-border-none は、focus-indicator の白い内枠が border-shorthand によって細くならないようにするため
const dropdownCustomTagClassNameGenerator = tv({
  base: 'shr-border-none shr-leading-normal',
  variants: {
    current: {
      true: 'shr-bg-white-darken',
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
}) => {
  const actualNavigations = useMemo(() => buildNavigations(navigations), [navigations])

  return (
    <AppNavi
      displayDropdownCaret
      additionalArea={
        <Cluster align="center" className="shr-flex-nowrap shr-ps-1">
          {additionalContent}
          {releaseNote && <ReleaseNotesDropdown {...releaseNote} />}
        </Cluster>
      }
      className={CLASS_NAME}
      data-with-releasenote={!!releaseNote}
      label={enableNew ? undefined : appName}
    >
      {actualNavigations}
    </AppNavi>
  )
}

const buildNavigations = (navigations: NavigationType[]) =>
  navigations.map((navigation, index) => {
    if ('elementAs' in navigation) {
      const { elementAs, ...rest } = navigation

      return <AppNaviCustomTag {...rest} key={index} tag={elementAs} />
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

const DropdownCustomTag = memo<NavigationCustomTag>(({ current, className, ...rest }) => {
  const actualClassName = useMemo(
    () => dropdownCustomTagClassNameGenerator({ current, className }),
    [current, className],
  )

  return <AnchorButton {...rest} className={actualClassName} aria-current={current || undefined} />
})
const DropdownMenuAnchorButton = memo<NavigationLink>(({ current, ...rest }) => (
  <AnchorButton {...rest} aria-current={current ? 'page' : undefined} />
))
const DropdownNavigationButton = memo<NavigationButton>(({ current, ...rest }) => (
  <Button {...rest} aria-current={current ? 'page' : undefined} />
))
