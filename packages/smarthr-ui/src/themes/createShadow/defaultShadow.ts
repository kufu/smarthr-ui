import { transparentize } from 'polished'

import { defaultColor } from '../createColor'

const createOutline = (color: string) => `0 0 0 2px white, 0 0 0 4px ${color}`
const defaultOutline = createOutline(defaultColor.OUTLINE)
const defaultOutlineMargin = '4px'

const createLayerShadow = (depth: number) =>
  depth === 0
    ? 'none'
    : `0 ${2 ** (depth - 1)}px ${2 ** depth}px ${depth - 1 > 0 ? `${2 ** (depth - 2)}px` : 0} ${
        defaultColor.TRANSPARENCY_30
      }`

export const defaultShadow = {
  BASE: `${defaultColor.TRANSPARENCY_15} 0 0 4px 0`,
  DIALOG: `${defaultColor.TRANSPARENCY_30} 0 4px 10px 0`,
  LAYER0: createLayerShadow(0),
  LAYER1: createLayerShadow(1),
  LAYER2: createLayerShadow(2),
  LAYER3: createLayerShadow(3),
  LAYER4: createLayerShadow(4),
  OUTLINE: defaultOutline,
  OUTLINE_MARGIN: defaultOutlineMargin,
  UNDERLINE: '0 1px 0 0',
  INPUT_HOVER: `0 0 0 2px ${transparentize(0.78, defaultColor.MAIN)}`,
}
