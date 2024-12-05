export const TEXT = {
  triggerLabel: 'アプリ',
  searchInputTitle: 'アプリ名を入力してください。',
  favoriteModeText: 'よく使うアプリ',
  allModeText: 'すべてのアプリ',
  listText: 'アプリ一覧',
  searchResultText: '検索結果',
  emptyText: '該当するアプリが見つかりませんでした。',
  sortDropdownLabel: '表示順',
  sortDropdownSelected: '選択中',
  sortDropdownOrderDefault: 'デフォルト',
  sortDropdownOrderNameAsc: 'アプリ名の昇順',
  sortDropdownOrderNameDesc: 'アプリ名の降順',
} as const

export const pages = ['favorite', 'all'] as const
export type Page = (typeof pages)[number]

export const modes = ['default', 'search'] as const
export type Mode = (typeof modes)[number]

export const sortTypes = ['default', 'name/asc', 'name/desc'] as const
export type SortType = (typeof sortTypes)[number]

export type Feature = {
  id: string
  name: string
  url: string
  favorite: boolean
  position: number | null
}
