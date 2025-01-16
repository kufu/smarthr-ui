import React, { ComponentProps, FC, Fragment, ReactNode } from 'react'
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
import { Text } from '../../../Text'
import {
  ChildNavigation,
  ChildNavigationGroup,
  Navigation as NavigationType,
  ReleaseNoteProps,
} from '../../types'
import { isChildNavigation, isChildNavigationGroup } from '../../utils'
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
  // const buttons = buildButtonsFromNavigations(navigations)

  <AppNavi
    label={enableNew ? undefined : appName}
    // buttons={buttons}
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

const navigationTitle = tv({
  base: ['shr-px-1 shr-pt-0.5 shr-pb-0.25'],
})

const separator = tv({
  base: ['[&&]:shr-mx-0 [&&]:shr-my-0.5 [&&]:shr-border-b-shorthand'],
})

const buildNavigations = (
  navigations: NavigationType[],
): ComponentProps<typeof AppNavi>['children'] => (
  <>
    {navigations.map((navigation) => {
      if ('elementAs' in navigation) {
        return <AppNaviCustomTag {...navigation} key="hoge" tag={navigation.elementAs} />
      }
      if ('href' in navigation) {
        return <AppNaviAnchor {...navigation} key="hoge" />
      }
      if ('childNavigations' in navigation) {
        return (
          <AppNaviDropdownMenuButton label={navigation.children} key="hoge">
            {buildDropdownMenu(navigation.childNavigations)}
          </AppNaviDropdownMenuButton>
        )
      }

      return <AppNaviButton {...navigation} key="hoge" />
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
        return <Component {...navigation} key="hoge" />
      }
      if ('href' in navigation) {
        return (
          <AnchorButton {...navigation} aria-current={navigation.current && 'page'} key="hoge" />
        )
      }
      if ('title' in navigation) {
        return (
          <DropdownMenuGroup name={navigation.title} key="hoge">
            {buildDropdownMenu(navigation.childNavigations)}
          </DropdownMenuGroup>
        )
      }
      return <Button {...navigation} aria-current={navigation.current && 'page'} key="hoge" />
    })}
  </>
)

// TODO smarthr-ui 側でグループ化された Navigation が対応されたら AppNaviDropdownMenuButton を使った実装に変更する
const buildButtonsFromNavigations = (
  navigations: NavigationType[],
): ComponentProps<typeof AppNavi>['buttons'] =>
  navigations.map((navigation) => {
    if (isChildNavigation(navigation)) {
      // smarthr-ui の buttons props ではカスタムエレメントは elementAs ではなく tag という名前なので変換する必要がある
      if ('elementAs' in navigation) {
        const { elementAs, ...rest } = navigation
        return {
          ...rest,
          tag: elementAs,
        }
      }
      return navigation
    }

    // 子要素に current を持っているものがあるかどうか
    const childrenHasCurrent = navigation.childNavigations.some((child) => {
      if (isChildNavigation(child)) return child.current
      return child.childNavigations.some((c) => c.current)
    })

    return {
      ...navigation,
      current: navigation.current || childrenHasCurrent,
      dropdownContent: (
        <div className="shr-py-0.5">
          {navigation.childNavigations.map((childNavigation, i) => {
            if (isChildNavigationGroup(childNavigation)) {
              const { childNavigations } = childNavigation

              return (
                <Fragment key={childNavigation.title.toString()}>
                  <div className="shr-px-0.5">
                    <Text styleType="subSubBlockTitle" as="p" className={navigationTitle()}>
                      {childNavigation.title}
                    </Text>

                    {childNavigations.map((child) => (
                      <Fragment key={child.children.toString()}>
                        {buildDropdownItemFromNavigation(child)}
                      </Fragment>
                    ))}
                  </div>

                  {i + 1 !== navigation.childNavigations.length && <hr className={separator()} />}
                </Fragment>
              )
            }

            const nextChildNavigation = navigation.childNavigations[i + 1]

            return (
              <Fragment key={childNavigation.children.toString()}>
                <div className="shr-px-0.5">{buildDropdownItemFromNavigation(childNavigation)}</div>
                {isChildNavigationGroup(nextChildNavigation) && <hr className={separator()} />}
              </Fragment>
            )
          })}
        </div>
      ),
    }
  })

const buildDropdownItemFromNavigation = (navigation: ChildNavigation) => {
  if ('elementAs' in navigation) {
    const { elementAs: Tag, current: isCurrent, ...rest } = navigation

    return (
      <Tag {...rest} className={commonButton({ current: isCurrent, className: rest.className })} />
    )
  }

  if ('href' in navigation) {
    return <CommonButton {...navigation} elementAs="a" current={navigation.current} />
  }

  return (
    <CommonButton {...navigation} elementAs="button" type="button" current={navigation.current} />
  )
}
