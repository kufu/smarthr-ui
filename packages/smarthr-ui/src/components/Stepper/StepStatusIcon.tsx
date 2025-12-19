import { type ComponentProps, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { FaCircleCheckIcon, FaCircleXmarkIcon } from '../Icon'

import type { Step } from './types'

const classNameGenerator = tv({
  base: [
    'shr-rounded-full shr-bg-white shr-shadow-[0_0_0_theme(borderWidth.2)_theme(colors.white)]',
    'forced-colors:shr-bg-[CanvasText] forced-colors:shr-fill-[Canvas] forced-colors:shr-shadow-[0_0_0_theme(borderWidth.2)_Canvas]',
  ],
  variants: {
    status: {
      completed: [
        'shr-text-main',
        'forced-colors:shr-bg-[Canvas] forced-colors:shr-fill-[Highlight]',
      ],
      closed: ['shr-text-grey', 'forced-colors:shr-bg-[Canvas] forced-colors:shr-fill-[GrayText]'],
    },
  },
})

type StatusProps = { status?: Step['status'] }
type AbstractProps = ComponentProps<typeof FaCircleCheckIcon>
type Props = AbstractProps & StatusProps
type ActualProps = AbstractProps & Required<StatusProps>

export const StepStatusIcon: FC<Props> = (props) =>
  props.status ? <ActualStepStatusIcon {...(props as ActualProps)} /> : null

const ICON_MAPPER = {
  completed: {
    alt: <Localizer id="smarthr-ui/StepStatusIcon/completedAlt" defaultText="完了" />,
    Component: FaCircleCheckIcon,
  },
  closed: {
    alt: <Localizer id="smarthr-ui/StepStatusIcon/closedAlt" defaultText="中断" />,
    Component: FaCircleXmarkIcon,
  },
}

const ActualStepStatusIcon: FC<ActualProps> = ({ status, className, ...rest }) => {
  const actualStatus = useMemo(() => {
    const isObject = typeof status === 'object'
    const statusType = isObject ? status.type : status
    const { alt, Component } = ICON_MAPPER[statusType]

    return {
      type: statusType,
      text: isObject ? status.text || alt : alt,
      Component,
    }
  }, [status])

  const actualClassName = useMemo(
    () => classNameGenerator({ status: actualStatus.type, className }),
    [actualStatus.type, className],
  )
  const Component = actualStatus.Component

  return <Component {...rest} alt={actualStatus.text} className={actualClassName} />
}
