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

const ICON_MAPPER = {
  completed: {
    alt: '完了',
    Component: FaCircleCheckIcon,
  },
  closed: {
    alt: '中断',
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

  const style = useMemo(
    () => stepStatusIcon({ status: actualStatus.type, className }),
    [actualStatus.type, className],
  )
  const Component = actualStatus.Component

  return <Component {...rest} alt={actualStatus.text} className={style} />
}
