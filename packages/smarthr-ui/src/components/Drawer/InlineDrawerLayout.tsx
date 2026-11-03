import { type FC, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Scroller } from '../Scroller'

import type { ExtendElementPropsWithRef } from '../../types'

type Props = ExtendElementPropsWithRef<
  'div',
  {
    /** メインの左に並べるパネル。InlineDrawer か、狭い画面向けに差し替えた Drawer を渡す */
    left?: ReactNode
    /** メインの右に並べるパネル。InlineDrawer か、狭い画面向けに差し替えた Drawer を渡す */
    right?: ReactNode
    /**
     * メイン領域。パネルが開くと幅が縮む。InlineDrawerLayout の高さが確定している（親要素に height がある、
     * または className で高さを指定する）と、この領域だけがスクロールする。親要素の max-height だけでは確定しない。
     * 確定していないとメインはページと一緒にスクロールし、メイン内の position: sticky はページのスクロールに対して効かない
     */
    children: ReactNode
  }
>

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-InlineDrawerLayout', 'shr-flex shr-h-full shr-min-h-0'],
    main: ['smarthr-ui-InlineDrawerLayout-main', 'shr-min-w-0 shr-flex-1'],
  },
})

export const InlineDrawerLayout: FC<Props> = ({ left, right, className, children, ...rest }) => {
  const classNames = useMemo(() => {
    const { wrapper, main } = classNameGenerator()

    return { wrapper: wrapper({ className }), main: main() }
  }, [className])

  return (
    <div {...rest} className={classNames.wrapper}>
      {left}
      {/* vertical だと overflow-x: hidden になり、パネルで細くなったメインの幅広い中身が切れる */}
      <Scroller direction="both" className={classNames.main}>
        {children}
      </Scroller>
      {right}
    </div>
  )
}
