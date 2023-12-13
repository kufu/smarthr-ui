import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaExclamationCircleIcon, FaExclamationTriangleIcon } from '../Icon'

const statusLabel = tv({
  base: [
    'shr-box-content',
    'shr-font-bold',
    'shr-inline-flex',
    'shr-items-center',
    'shr-justify-center',
    'shr-gap-0.25',
    'shr-px-0.5',
    'shr-py-0.25',
    'shr-whitespace-nowrap',
    'shr-text-sm',
    'shr-leading-[0]',
    'shr-min-w-[3.5em]',
    'shr-min-h-[1em]',
    'shr-border',
    'shr-border-solid',
  ],
  variants: {
    type: {
      grey: ['shr-border-grey-20', 'shr-text-grey', 'contrast-more:shr-border-high-contrast'],
      blue: ['shr-border-main', 'shr-text-link'],
      /* SmartHR 基本色の Aqua04。StatusLabel 以外では使いません。
       * https://smarthr.design/basics/colors/#h4-1 */
      green: ['shr-border-[#0f7f85]', 'shr-text-[#0f7f85]'],
      red: ['shr-border-danger', 'shr-text-danger'],
      warning: ['shr-bg-warning-yellow', 'shr-text-black'],
      error: ['shr-bg-danger', 'shr-border-danger', 'shr-text-white'],
    },
    bold: {
      true: [],
    },
  },
  compoundVariants: [
    {
      type: 'grey',
      bold: true,
      class: ['shr-bg-[theme(colors.grey.65)]', 'shr-border-grey-65', 'shr-text-white'],
    },
    {
      type: 'blue',
      bold: true,
      class: ['shr-bg-main', 'shr-border-main', 'shr-text-white'],
    },
    {
      type: 'green',
      bold: true,
      class: ['shr-bg-[#0f7f85]', 'shr-border-[#0f7f85]', 'shr-text-white'],
    },
    {
      type: 'red',
      bold: true,
      class: ['shr-bg-danger', 'shr-border-danger', 'shr-text-white'],
    },
    { type: 'warning', bold: false, class: ['shr-border-warning-yellow'] },
  ],
})

type Color = 'grey' | 'blue' | 'green' | 'red'
type State = 'warning' | 'error'
type Props = {
  /** ラベルが表す状態の種類 */
  type?: Color | State
  /** 強調するかどうか */
  bold?: boolean
  /** ラベル */
  children: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLSpanElement>, keyof Props>

export const StatusLabel: FC<Props & ElementProps> = ({
  type = 'grey',
  bold = false,
  className = '',
  children,
  ...props
}) => {
  const Icon = useMemo(() => {
    switch (true) {
      case type === 'warning' && bold: {
        return FaExclamationTriangleIcon
      }
      case type === 'error' && bold: {
        return FaExclamationCircleIcon
      }
      default: {
        return React.Fragment
      }
    }
  }, [type, bold])

  const wrapperStyle = useMemo(
    () =>
      statusLabel({
        className,
        type,
        bold,
      }),
    [],
  )

  return (
    <span {...props} className={wrapperStyle}>
      <Icon />
      {children}
    </span>
  )
}
