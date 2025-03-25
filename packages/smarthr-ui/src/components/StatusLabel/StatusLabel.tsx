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

type BaseProps = VariantProps<typeof classNameGenerator>
type ElementProps = Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps>
type Props = PropsWithChildren<BaseProps & ElementProps>

export const StatusLabel = memo<Props>(
  ({ type = 'grey', bold = false, className, children, ...props }) => {
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
      <span {...props} className={actualClassName}>
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
