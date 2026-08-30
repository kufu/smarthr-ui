import { merge } from '../libs/lodash'

type Leading = {
  NONE: number
  TIGHT: number
  NORMAL: number
  RELAXED: number
}

export type LeadingProperty = Partial<Omit<Leading, 'NONE'>>
export type CreatedLeading = Leading

// TODO: リポジトリ内では利用していない。smarthr-design-systemからdeep importされている
// 可能性があるため残している。利用状況を確認し、使われていなければ削除する:
// import type { Leadings } from 'smarthr-ui/lib/themes/createLeading'
/** @public */
export type Leadings = keyof Leading

export const defaultLeading: CreatedLeading = {
  NONE: 1,
  TIGHT: 1.25,
  NORMAL: 1.5,
  RELAXED: 1.75,
}

export const createLeading = (userLeading?: LeadingProperty): CreatedLeading => {
  if (!userLeading) {
    return defaultLeading
  }

  return merge({ ...defaultLeading }, userLeading)
}
