import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { reelShadowStyle } from './useReelShadow'

export type Props = PropsWithChildren<VariantProps<typeof td>>
type ElementProps = Omit<ComponentPropsWithoutRef<'td'>, keyof Props>

export const Td: FC<Props & ElementProps> = ({
  nullable = false,
  fixed = false,
  className,
  ...props
}) => {
  const styles = useMemo(() => {
    const tdStyles = td({ nullable, fixed, className })
    const reelShadowStyles = fixed ? reelShadowStyle({ direction: 'right' }) : ''
    return `${tdStyles} ${reelShadowStyles}`.trim()
  }, [className, fixed, nullable])

  return <td {...props} className={styles} />
}

const td = tv({
  base: [
    'smarthr-ui-Td',
    'shr-border-t-shorthand shr-h-[calc(1em_*_theme(lineHeight.normal))] shr-px-1 shr-py-0.5 shr-align-middle shr-text-base shr-leading-normal shr-text-black',
  ],
  variants: {
    nullable: {
      true: "empty:after:shr-content-['-----']",
    },
    fixed: {
      true: [
        'fixedElement',
        '[&.fixed]:shr-sticky [&.fixed]:shr-right-0 [&.fixed]:shr-bg-white [&.fixed]:after:shr-opacity-100',
      ],
    },
  },
})
