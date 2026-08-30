import { type ComponentProps, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { FaCircleCheckIcon, FaCircleXmarkIcon } from '../Icon'

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

type ActualProps = ComponentProps<typeof FaCircleCheckIcon> & {
  statusType: 'completed' | 'closed'
  statusText?: string
}
type Props = Partial<ActualProps>

export const StepStatusIcon: FC<Props> = (props) =>
  props.statusType ? <ActualStepStatusIcon {...(props as ActualProps)} /> : null

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

const ActualStepStatusIcon: FC<ActualProps> = ({ statusType, statusText, className, ...rest }) => {
  const { alt, Component } = ICON_MAPPER[statusType]
  const actualAlt = statusText || alt

  const actualClassName = useMemo(
    () => classNameGenerator({ status: statusType, className }),
    [statusType, className],
  )

  return <Component {...rest} alt={actualAlt} className={actualClassName} />
}
