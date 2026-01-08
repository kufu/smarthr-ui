import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { FaCircleExclamationIcon, FaTriangleExclamationIcon } from '../Icon'

export const classNameGenerator = tv({
  base: [
    'smarthr-ui-StatusLabel',
    'shr-border-shorthand shr-box-content shr-inline-flex shr-min-h-em shr-min-w-[3.5em] shr-items-center shr-justify-center shr-gap-0.25 shr-whitespace-nowrap shr-border-current shr-bg-white shr-px-0.5 shr-py-0.25 shr-text-sm shr-font-bold',
    // ラベルが天地中央に揃わないため暫定対応
    'shr-leading-[0]',
  ],
  variants: {
    type: {
      grey: ['shr-border-grey-20 shr-text-grey', 'contrast-more:shr-border-high-contrast'],
      blue: 'shr-text-main',
      /* SmartHR 基本色の Aqua04。StatusLabel 以外では使いません。
       * https://smarthr.design/basics/colors/#h4-1 */
      green: 'shr-text-green',
      red: 'shr-text-danger',
      warning: 'shr-border-warning-yellow shr-bg-warning-yellow shr-text-black',
      error: 'shr-border-danger shr-bg-danger shr-text-white',
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
      class: 'shr-border-green shr-bg-green',
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

type AbstractProps = PropsWithChildren<VariantProps<typeof classNameGenerator>>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'span'>, keyof AbstractProps>

export const StatusLabel = memo<Props>(
  ({ type = 'grey', bold = false, className, children, ...rest }) => {
    const actualClassName = useMemo(
      () =>
        classNameGenerator({
          className,
          type,
          bold,
        }),
      [type, bold, className],
    )

    return (
      <span {...rest} className={actualClassName}>
        <Icon type={type} bold={bold} />
        {children}
      </span>
    )
  },
)

const Icon: FC<Pick<Props, 'type' | 'bold'>> = ({ type, bold }) => {
  if (bold) {
    switch (type) {
      case 'warning':
        return <FaTriangleExclamationIcon />
      case 'error':
        return <FaCircleExclamationIcon />
    }
  }

  return null
}
