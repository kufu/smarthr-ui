import type { Locale } from '../../intl/localeMap'
import type { Header } from '../Header'
import type { ComponentProps, ComponentType, MouseEvent, ReactElement, ReactNode } from 'react'

export type LocaleProps = {
  onSelectLocale: (locale: Locale) => void
}

export type UserInfoProps = {
  /** @deprecated 書式の統一のために、可能な限り使用しないでください */
  arbitraryDisplayName?: string | null
  email?: string | null
  empCode?: string | null
  firstName?: string | null
  lastName?: string | null
  accountUrl?: string | null
  accountImageUrl?: string
  enableNew?: boolean
}

export type HeaderProps = ComponentProps<typeof Header> & {
  locale?: LocaleProps | null
  enableNew?: boolean
  appName?: ReactNode
  schoolUrl?: string | null
  helpPageUrl?: string | null
  userInfo?: UserInfoProps | null
  desktopAdditionalContent?: ReactNode
  navigations?: Navigation[] | null
  desktopNavigationAdditionalContent?: ReactNode
  releaseNote?: ReleaseNoteProps | null
  features?: Array<Launcher['feature']>
  mobileAdditionalContent?: ReactNode
}

export type Navigation = NavigationLink | NavigationCustomTag | NavigationButton | NavigationGroup

export type NavigationLink = {
  children: ReactElement | string
  href: string
  current?: boolean
}

export type NavigationCustomTag = {
  children: ReactElement | string
  elementAs: ComponentType<any>
  current?: boolean
} & { [key: string]: any }

export type NavigationButton = {
  children: ReactElement | string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  current?: boolean
}

export type NavigationGroup = {
  children: ReactElement | string
  childNavigations: Array<ChildNavigation | ChildNavigationGroup>
  current?: boolean
}

export type ChildNavigationGroup = {
  title: ReactElement | string
  childNavigations: ChildNavigation[]
}

export type ChildNavigation = NavigationLink | NavigationCustomTag | NavigationButton

export type ReleaseNoteProps = {
  indexUrl: string
  links: Array<{
    title: string
    url: string
  }>
  loading?: boolean | null
  error?: boolean | null
}

const launcher = {
  pages: ['favorite', 'all'],
  modes: ['default', 'search'],
  sortTypes: ['default', 'name/asc', 'name/desc'],
} as const

export type Launcher = {
  feature: {
    id: string
    name: string
    url: string
    favorite: boolean
    position: number | null
  }
  page: (typeof launcher)['pages'][number]
  mode: (typeof launcher)['modes'][number]
  sortType: (typeof launcher)['sortTypes'][number]
}
