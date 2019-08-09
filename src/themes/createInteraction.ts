import { merge } from '../libs/lodash'

const hoverAnimationDuration = '.3s'
const hoverAnimationTiming = 'ease-out'

export interface InteractionProperty {
  hover?: {
    feedbackOpacity?: string
    animationDuration?: string
    animationTiming?: string
    animation?: string
  }
}

export interface CreatedInteractionTheme {
  hover: {
    feedbackOpacity: string
    animationDuration: string
    animationTiming: string
    animation: string
  }
}

export const defaultHover = {
  feedbackOpacity: '.7',
  animationDuration: hoverAnimationDuration,
  animationTiming: hoverAnimationTiming,
  animation: `${hoverAnimationDuration} ${hoverAnimationTiming}`,
}

export const createInteraction = (userInteraction: InteractionProperty = {}) => {
  const created: CreatedInteractionTheme = merge(
    {
      hover: defaultHover,
    },
    userInteraction,
  )

  return created
}
