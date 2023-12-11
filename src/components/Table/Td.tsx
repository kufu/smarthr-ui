import React, { FC, PropsWithChildren, TdHTMLAttributes, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { reelShadowStyle } from './useReelShadow'

export type Props = PropsWithChildren<{
  /** `true` のとき、セル内が空であれば "----" を表示する */
  nullable?: boolean
  /** `true` のとき、TableReel内で固定表示になる */
  fixed?: boolean
}>
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>

export const Td: FC<Props & ElementProps> = ({
  nullable = false,
  fixed = false,
  className = '',
  ...props
}) => {
  const styles = useMemo(() => {
    const tdStyles = td({ nullable, fixed, className })
    const reelShadowStyles = fixed ? reelShadowStyle({ direction: 'right' }) : ''
    return `${tdStyles} ${reelShadowStyles}`.trim()
  }, [className, fixed, nullable])

  return <td {...props} className={`${fixed ? 'fixedElement' : ''} ${styles}`} />
}

const td = tv({
  base: [
    'smarthr-ui-Td',
    'shr-text-black',
    'shr-h-[calc(1em_*_theme(lineHeight.normal))]',
    'shr-px-1',
    'shr-py-0.5',
    'shr-border-t',
    'shr-border-l-0',
    'shr-border-r-0',
    'shr-border-b-0',
    'shr-border-solid',
    'shr-border-default',
    'shr-text-base',
    'shr-leading-normal',
    'shr-align-middle',
  ],
  variants: {
    nullable: {
      true: "empty:after:shr-content-['-----']",
    },
    fixed: {
      true: [
        '[&.fixed]:shr-sticky',
        '[&.fixed]:shr-right-0',
        '[&.fixed]:shr-bg-white',
        '[&.fixed]:after:shr-opacity-100',
      ],
    },
  },
})
