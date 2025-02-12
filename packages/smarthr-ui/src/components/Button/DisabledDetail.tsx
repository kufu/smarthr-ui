import React, { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaCircleInfoIcon } from '../Icon'
import { Tooltip } from '../Tooltip'

type Props = {
  button: React.JSX.Element
  disabledDetail: {
    icon?: React.FunctionComponent
    message: React.ReactNode
  }
}

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-Button-disabledWrapper', 'shr-inline-flex shr-items-center shr-gap-0.25'],
    tooltip: [
      'shr-overflow-y-visible',
      /* Tooltip との距離を変えずに反応範囲を広げるために negative space を使う */
      '[&_.smarthr-ui-Icon]:-shr-m-0.25',
      /* global style��どでborder-boxが適用されている場合表示崩れを起こす為、content-boxを指定する */
      '[&_.smarthr-ui-Icon]:shr-box-content',
      '[&_.smarthr-ui-Icon]:shr-p-0.25',
      '[&_.smarthr-ui-Icon]:shr-text-grey',
    ],
  },
})

export const DisabledDetail: FC<Props> = ({ button, disabledDetail }) => {
  const classNames = useMemo(() => {
    const { wrapper, tooltip } = classNameGenerator()

    return {
      wrapper: wrapper(),
      tooltip: tooltip(),
    }
  }, [])

  return (
    <div className={classNames.wrapper}>
      {button}
      <TooltipIcon
        icon={disabledDetail.icon}
        message={disabledDetail.message}
        className={classNames.tooltip}
      />
    </div>
  )
}

const TooltipIcon = React.memo<{
  icon?: React.FunctionComponent
  message: React.ReactNode
  className: string
}>(({ icon, message, className }) => {
  const DisabledDetailIcon = icon ?? FaCircleInfoIcon

  return (
    <Tooltip
      message={message}
      triggerType="icon"
      horizontal="auto"
      vertical="auto"
      className={className}
    >
      <DisabledDetailIcon />
    </Tooltip>
  )
})
