import { merge } from '../libs/lodash'

type Leading = {
  NONE: number
  TIGHT: number
  NORMAL: number
  RELAXED: number
}

export type LeadingProperty = Partial<Omit<Leading, 'NONE'>>
export type CreatedLeading = Leading

export type Leadings = keyof Leading

export const defaultLeading: CreatedLeading = {
  NONE: 1,
  TIGHT: 1.25,
  NORMAL: 1.5,
  RELAXED: 1.75,
}

export const createLeading = (userLeading: LeadingProperty = {}) => {
  const { ...userTokens } = userLeading
  const created: CreatedLeading = merge(defaultLeading, userTokens)
  return created
}
