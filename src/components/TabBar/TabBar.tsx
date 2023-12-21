import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Reel } from '../Layout'

const tabBar = tv({
  slots: {
    wrapper: ['smarthr-ui-TabBar'],
    inner: ['shr-grow', 'shr-m-0.25'],
  },
  variants: {
    bordered: {
      true: {
        inner: [
          'shr-relative',
          'before:shr-absolute',
          'before:shr-inset-x-0',
          'before:shr-bottom-0',
          'before:shr-border-b',
          'before:shr-border-t-0',
          'before:shr-border-l-0',
          'before:shr-border-r-0',
          'before:shr-border-solid',
          'before:shr-border-default',
          'before:shr-content-[""]',
        ],
      },
    },
  },
})

type Props = {
  /** タブバーの内容。通常は TabItem を並べる。 */
  children: ReactNode
  /** `true` のとき、TabBar に下線を表示する */
  bordered?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'role'>

export const TabBar: FC<Props & ElementProps> = ({
  className,
  bordered = true,
  children,
  ...props
}) => {
  const { wrapperStyle, innerStyle } = useMemo(() => {
    const { wrapper, inner } = tabBar()
    return {
      wrapperStyle: wrapper({ className }),
      innerStyle: inner({ bordered }),
    }
  }, [bordered, className])

  return (
    <Reel {...props} role="tablist" className={wrapperStyle}>
      <div className={innerStyle}>{children}</div>
    </Reel>
  )
}
