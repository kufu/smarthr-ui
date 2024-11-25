import React, { type FC } from 'react'
import { tv } from 'tailwind-variants'

import { FaCircleInfoIcon } from '../Icon'
import { Tooltip } from '../Tooltip'

type DisabledDetailProps = {
  button: React.JSX.Element
  disabledDetail: {
    icon?: React.FunctionComponent
    message: React.ReactNode
  }
}

const disabledDetailStyle = tv({
  slots: {
    disabledWrapper: [
      'smarthr-ui-Button-disabledWrapper',
      'shr-inline-flex shr-items-center shr-gap-0.25',
    ],
    disabledTooltip: [
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

export const DisabledDetail: FC<DisabledDetailProps> = ({ button, disabledDetail }) => {
  const { disabledWrapper, disabledTooltip } = disabledDetailStyle()
  const DisabledDetailIcon = disabledDetail.icon ?? FaCircleInfoIcon

  return (
    <div className={disabledWrapper()}>
      {button}
      <Tooltip
        message={disabledDetail.message}
        triggerType="icon"
        horizontal="auto"
        vertical="auto"
        className={disabledTooltip()}
      >
        <DisabledDetailIcon />
      </Tooltip>
    </div>
  )
}
