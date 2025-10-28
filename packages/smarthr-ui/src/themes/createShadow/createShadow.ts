import { merge } from '../../libs/lodash'

import { defaultShadow } from './defaultShadow'

export type ShadowProperty = {
  LAYER0?: string
  LAYER1?: string
  LAYER2?: string
  LAYER3?: string
  LAYER4?: string
  UNDERLINE?: string
}

export type CreatedShadowTheme = {
  LAYER0?: string
  LAYER1?: string
  LAYER2?: string
  LAYER3?: string
  LAYER4?: string
  UNDERLINE: string
}

export const createShadow = (userShadow?: ShadowProperty): CreatedShadowTheme => {
  if (!userShadow) {
    return defaultShadow
  }

  return merge({ ...defaultShadow }, userShadow)
}
