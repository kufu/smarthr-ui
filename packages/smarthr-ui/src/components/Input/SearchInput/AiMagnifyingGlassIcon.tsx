import { memo, useId } from 'react'

import { aiGradationColors } from '../../../themes'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import type { ReactNode } from 'react'

type Props = {
  alt: ReactNode
}

export const AiMagnifyingGlassIcon = memo<Props>(({ alt }) => {
  const gradientId = useId()

  return (
    <span className="smarthr-ui-Icon-extended smarthr-ui-Icon-withAlt shr-relative shr-leading-[0]">
      <VisuallyHiddenText>{alt}</VisuallyHiddenText>
      <svg
        role="img"
        focusable={false}
        viewBox="0 0 512 512"
        width="1em"
        height="1em"
        className="smarthr-ui-Icon group-[]/iconWrapper:shr-shrink-0 group-[]/iconWrapper:shr-translate-y-[0.125em] forced-colors:shr-fill-[CanvasText]"
        aria-hidden
      >
        <path
          fill={`url(#${gradientId})`}
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
          className="[.smarthr-ui-Input:has(:disabled)_&]:shr-fill-[theme(colors.grey.30)]"
        />
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="512"
            y2="457"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".1" stopColor={aiGradationColors.start} />
            <stop offset=".66" stopColor={aiGradationColors.mid} />
            <stop offset="1" stopColor={aiGradationColors.end} />
          </linearGradient>
        </defs>
      </svg>
    </span>
  )
})
