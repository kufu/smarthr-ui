import { merge } from '../libs/lodash'

const hoverAnimationDuration = '.3s'
const hoverAnimationTiming = 'ease-out'

type HoverProps = {
  feedbackOpacity?: string
  animationDuration?: string
  animationTiming?: string
  animation?: string
}

export type InteractionProperty = {
  hover?: HoverProps
}

export type CreatedInteractionTheme = {
  hover: Required<HoverProps>
}

export const defaultInteraction: CreatedInteractionTheme = {
  hover: {
    feedbackOpacity: '.7',
    animationDuration: hoverAnimationDuration,
    animationTiming: hoverAnimationTiming,
    animation: `${hoverAnimationDuration} ${hoverAnimationTiming}`,
  },
}

export const createInteraction = (userInteraction: InteractionProperty = {}) => {
  const created: CreatedInteractionTheme = merge(
    {
      ...defaultInteraction,
    },
    userInteraction,
  )

  return created
}
