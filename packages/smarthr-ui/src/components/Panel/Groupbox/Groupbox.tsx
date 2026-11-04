import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { backgroundColor } from '../../../tailwind'
import { Panel } from '../Panel'

import type { ExtendElementPropsWithRef } from '../../../types'

type Props = ExtendElementPropsWithRef<
  typeof Panel,
  {
    /** 背景色 */
    bgColor?: keyof typeof backgroundColor
    /** 角丸を適用する範囲 */
    rounded?: boolean | 'all' | 'top' | 'right' | 'bottom' | 'left'
    /** childrenの内容に併せてサイズを縮小させます */
    fit?: boolean
  },
  { omit: 'radius' | 'layer' }
>

const classNameGenerator = tv({
  base: 'shr-rounded-[unset]',
  variants: {
    bgColor: backgroundColor,
    rounded: {
      true: 'shr-rounded-l',
      all: 'shr-rounded-l',
      top: 'shr-rounded-t-l',
      right: 'shr-rounded-r-l',
      bottom: 'shr-rounded-b-l',
      left: 'shr-rounded-l-l',
    } satisfies Record<Exclude<NonNullable<Props['rounded']>, boolean> | 'true', string>,
    fit: {
      true: 'shr-inline-block shr-self-start',
    },
  },
})

export const Groupbox: FC<Props> = ({ bgColor, rounded, padding = 1, fit, className, ...rest }) => {
  const actualClassName = useMemo(
    () =>
      classNameGenerator({
        bgColor: bgColor ?? 'COLUMN',
        rounded: rounded ?? false,
        fit: fit ?? false,
        className,
      }),
    [bgColor, rounded, fit, className],
  )

  return <Panel {...rest} layer={0} padding={padding} className={actualClassName} />
}

/** @deprecated BaseColumn は非推奨です。Groupbox を使ってください。 */
/** @alias */
export const BaseColumn = Groupbox
