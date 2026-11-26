import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Reel } from '../Layout'

import type { ExtendElementPropsWithoutRef } from '../../types'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-TabBar',
    inner: 'shr-grow',
  },
  variants: {
    bordered: {
      true: {
        inner: [
          'shr-relative',
          'before:shr-border-b-shorthand before:shr-absolute before:shr-inset-x-0 before:shr-bottom-0 before:shr-z-1 before:shr-content-[""]',
        ],
      },
    },
    grow: {
      true: {
        inner: [
          // HINT: flex-1 では子要素のパディング有無(Tooltip で包まれた TabItem など)で幅がずれるため、
          // パディングに関係なく均等幅にできる grid の 1fr 列を使う
          'shr-grid shr-auto-cols-[1fr] shr-grid-flow-col',
          // HINT: Reel 内で最大幅まで広がらず、TabItem のタイトルを折り返させるため、
          // 幅を「min-content と TabBar の幅のうち大きい方」に収める
          'shr-w-min shr-min-w-full',
        ],
      },
    },
  },
})

type Props = ExtendElementPropsWithoutRef<
  'div',
  {
    /** `true` のとき、TabBar に下線を表示する */
    bordered?: boolean
    /** `true` のとき、TabItem を均等幅で横幅いっぱいに配置する */
    grow?: boolean
  },
  { omit: 'role' }
>

export const TabBar: FC<Props> = ({ className, bordered, grow, children, ...rest }) => {
  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      inner: inner({ bordered: bordered ?? true, grow }),
    }
  }, [bordered, grow, className])

  return (
    <Reel {...rest} role="tablist" className={classNames.wrapper}>
      <div className={classNames.inner}>{children}</div>
    </Reel>
  )
}
