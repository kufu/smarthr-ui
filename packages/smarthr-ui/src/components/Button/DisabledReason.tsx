import { type FC, type FunctionComponent, type JSX, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { FaCircleInfoIcon } from '../Icon'
import { Tooltip } from '../Tooltip'

import type { ObjectDisabledReasonType } from './types'

type Props = {
  button: JSX.Element
  disabledReason: ReactNode | ObjectDisabledReasonType
}

const disabledReasonObjectConverter = (message: ReactNode): ObjectDisabledReasonType => ({
  message,
})

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-Button-disabledWrapper', 'shr-inline-flex shr-items-center shr-gap-0.25'],
    tooltip: [
      'shr-overflow-y-visible',
      /* Tooltip との距離を変えずに反応範囲を広げるために negative space を使う */
      '[&_.smarthr-ui-Icon]:-shr-m-0.25',
      '[&_.smarthr-ui-Icon]:shr-box-content',
      '[&_.smarthr-ui-Icon]:shr-p-0.25',
      '[&_.smarthr-ui-Icon]:shr-text-grey',
    ],
  },
})

const CLASS_NAMES = (() => {
  // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
  const { wrapper, tooltip } = classNameGenerator()

  return {
    wrapper: wrapper(),
    tooltip: tooltip(),
  }
})()

export const DisabledReason: FC<Props> = ({ button, disabledReason: orgDisabledReason }) => {
  const disabledReason = useObjectAttributes<
    ReactNode | ObjectDisabledReasonType,
    ObjectDisabledReasonType
  >(orgDisabledReason, disabledReasonObjectConverter)

  return (
    <div className={CLASS_NAMES.wrapper}>
      {button}
      <TooltipIcon
        className={CLASS_NAMES.tooltip}
        icon={disabledReason.icon}
        message={disabledReason.message}
      />
    </div>
  )
}

const TooltipIcon = memo<{
  icon?: FunctionComponent
  message: ReactNode
  className: string
}>(({ icon, message, className }) => {
  const DisabledReasonIcon = icon ?? FaCircleInfoIcon

  return (
    <Tooltip triggerType="icon" className={className} message={message}>
      <DisabledReasonIcon />
    </Tooltip>
  )
})
