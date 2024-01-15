import React, { FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export type Props = PropsWithChildren<{
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  size: 'default' | 's'
}>

const buttonInner = tv({
  base: [
    /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
    'shr-min-w-0',
  ],
  variants: {
    size: {
      default: '',
      s: [
        /* SVG とテキストコンテンツの縦位置を揃えるために指定 */
        'shr-leading-[0]',
      ],
    },
  },
})

export const ButtonInner: FC<Props> = ({ prefix, suffix, size, ...props }) => {
  const styles = useMemo(() => buttonInner({ size }), [size])
  return (
    <>
      {prefix}
      <span {...props} className={styles} />
      {suffix}
    </>
  )
}
