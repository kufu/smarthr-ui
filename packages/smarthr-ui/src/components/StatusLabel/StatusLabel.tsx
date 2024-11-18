import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { FaCircleExclamationIcon, FaTriangleExclamationIcon } from '../Icon'

export const statusLabel = tv({
  base: [
    'smarthr-ui-StatusLabel',
    'shr-box-content shr-inline-flex shr-items-center shr-justify-center shr-gap-0.25 shr-border-shorthand shr-border-current shr-bg-white shr-px-0.5 shr-py-0.25 shr-whitespace-nowrap shr-text-sm shr-font-bold shr-min-w-[3.5em] shr-min-h-em',
    // ラベルが天地中央に揃わないため暫定対応
    'shr-leading-[0]',
  ],
  variants: {
    type: {
      grey: ['shr-border-grey-20 shr-text-grey', 'contrast-more:shr-border-high-contrast'],
      blue: 'shr-text-main',
      /* SmartHR 基本色の Aqua04。StatusLabel 以外では使いません。
       * https://smarthr.design/basics/colors/#h4-1 */
      green: 'shr-text-[#0f7f85]',
      red: 'shr-text-danger',
      warning: 'shr-border-warning-yellow shr-bg-warning-yellow shr-text-black',
      error: 'shr-bg-danger shr-border-danger shr-text-white',
    },
    bold: {
      true: 'shr-text-white',
    },
  },
  compoundVariants: [
    {
      type: 'grey',
      bold: true,
      class: 'shr-border-grey-65 shr-bg-[theme(colors.grey.65)]',
    },
    {
      type: 'blue',
      bold: true,
      class: 'shr-border-main shr-bg-main',
    },
    {
      type: 'green',
      bold: true,
      /* SmartHR 基本色の Aqua04。StatusLabel 以外では使いません。
       * https://smarthr.design/basics/colors/#h4-1 */
      class: 'shr-border-[#0f7f85] shr-bg-[#0f7f85]',
    },
    {
      type: 'red',
      bold: true,
      class: 'shr-border-danger shr-bg-danger',
    },
    {
      type: 'warning',
      bold: true,
      class: 'shr-border-current shr-text-black',
    },
  ],
})

type Props = VariantProps<typeof statusLabel>
type ElementProps = Omit<ComponentPropsWithoutRef<'span'>, keyof Props>

export const StatusLabel: FC<PropsWithChildren<Props & ElementProps>> = ({
  type = 'grey',
  bold = false,
  className,
  children,
  ...props
}) => {
  const Icon = useMemo(() => {
    switch (true) {
      case type === 'warning' && bold: {
        return FaTriangleExclamationIcon
      }
      case type === 'error' && bold: {
        return FaCircleExclamationIcon
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
    [className, type, bold],
  )

  return (
    <span {...props} className={wrapperStyle}>
      <Icon />
      {children}
    </span>
  )
}
