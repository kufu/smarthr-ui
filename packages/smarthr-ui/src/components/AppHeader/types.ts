import { ComponentProps, ComponentType, MouseEvent, ReactElement, ReactNode } from 'react'

import { Header } from '../Header'

type Locale = 'ja' | 'en-us' | 'id-id' | 'pt' | 'vi' | 'ko' | 'zh-cn' | 'zh-tw'

export type LocaleProps = {
  selectedLocale: Locale
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
}

export type Navigation = NavigationLink | NavigationCustomTag | NavigationButton | NavigationGroup

type NavigationLink = {
  children: ReactElement | string
  href: string
  current?: boolean
}

type NavigationCustomTag = {
  children: ReactElement | string
  elementAs: ComponentType<any>
  current?: boolean
} & { [key: string]: any }

type NavigationButton = {
  children: ReactElement | string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  current?: boolean
}

type NavigationGroup = {
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
