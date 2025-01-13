import React, { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaCircleCheckIcon, FaCircleXmarkIcon } from '../Icon'

import { Step } from './types'

import type { ComponentProps, FC } from 'react'

const stepStatusIcon = tv({
  base: [
    'shr-bg-white shr-rounded-full shr-shadow-[0_0_0_theme(borderWidth.2)_theme(colors.white)]',
    'forced-colors:shr-fill-[Canvas] forced-colors:shr-bg-[CanvasText] forced-colors:shr-shadow-[0_0_0_theme(borderWidth.2)_Canvas]',
  ],
  variants: {
    status: {
      completed: [
        'shr-text-main',
        'forced-colors:shr-fill-[Highlight] forced-colors:shr-bg-[Canvas]',
      ],
      closed: ['shr-text-grey', 'forced-colors:shr-fill-[GrayText] forced-colors:shr-bg-[Canvas]'],
    },
  },
})

type StatusProps = { status?: Step['status'] }
type BaseProps = ComponentProps<typeof FaCircleCheckIcon>
type Props = BaseProps & StatusProps
type ActualProps = BaseProps & Required<StatusProps>

export const StepStatusIcon: FC<Props> = (props) =>
  props.status ? <ActualStepStatusIcon {...(props as ActualProps)} /> : null

const ICON_ALT_MAPPER = {
  completed: '完了',
  closed: '中断',
}
const ICON_COMPONENT_MAPPER = {
  completed: FaCircleCheckIcon,
  closed: FaCircleXmarkIcon,
}

const ActualStepStatusIcon: FC<ActualProps> = ({ status, className, ...rest }) => {
  const actualStatus = useMemo(() => {
    const isObject = typeof status === 'object'
    const statusType = isObject ? status.type : status

    return {
      type: statusType,
      text: (isObject ? status.text : '') || ICON_ALT_MAPPER[statusType],
      icon: ICON_COMPONENT_MAPPER[statusType],
    }
  }, [status])

  const style = stepStatusIcon({ status: actualStatus.type, className })
  const Component = actualStatus.icon

  return <Component {...rest} alt={actualStatus.text} className={style} />
}
