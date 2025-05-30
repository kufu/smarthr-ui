import { merge } from '../libs/lodash'

const hoverAnimationDuration = '.3s'
const hoverAnimationTiming = 'ease-out'

export type InteractionProperty = {
  hover?: {
    feedbackOpacity?: string
    animationDuration?: string
    animationTiming?: string
    animation?: string
  }
}

export type CreatedInteractionTheme = {
  hover: {
    feedbackOpacity: string
    animationDuration: string
    animationTiming: string
    animation: string
  }
}

export const defaultInteraction: CreatedInteractionTheme = {
  hover: {
    feedbackOpacity: '.7',
    animationDuration: hoverAnimationDuration,
    animationTiming: hoverAnimationTiming,
    animation: `${hoverAnimationDuration} ${hoverAnimationTiming}`,
  },
}

export const createInteraction = (
  userInteraction?: InteractionProperty,
): CreatedInteractionTheme => {
  if (!userInteraction) {
    return defaultInteraction
  }

  return merge(
    {
      ...defaultInteraction,
    },
    userInteraction,
  )
}
