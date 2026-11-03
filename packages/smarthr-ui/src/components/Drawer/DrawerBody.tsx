import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { backgroundColor, paddingBlock, paddingInline } from '../../tailwind'
import { Scroller } from '../Scroller'

import type { ExtendElementPropsWithRef, Gap } from '../../types'

type Props = ExtendElementPropsWithRef<
  typeof Scroller,
  {
    /** コンテンツ部分の背景色 */
    contentBgColor?: keyof typeof backgroundColor
    contentPadding?: Gap | { block?: Gap; inline?: Gap }
  },
  { omit: 'as' | 'direction' | 'styleType' }
>

// DialogBody とほぼ同一だが、Drawer 側は今後 bottom のドラッグ連動で責務が変わる
// 見込みがあり、共通化すると Dialog 側の変更が波及するため複製に留めている。
const classNameGenerator = tv({
  base: ['smarthr-ui-Drawer-body', 'shr-flex-auto shr-overscroll-contain'],
  variants: {
    paddingBlock,
    paddingInline,
    contentBgColor: backgroundColor,
  },
})

export const DrawerBody: FC<Props> = ({ contentBgColor, contentPadding, className, ...rest }) => {
  const actualPaddings = useMemo(() => {
    const initialized = contentPadding === undefined ? 1.5 : contentPadding

    return initialized instanceof Object ? initialized : { block: initialized, inline: initialized }
  }, [contentPadding])

  const actualClassName = useMemo(
    () =>
      classNameGenerator({
        contentBgColor,
        paddingBlock: actualPaddings.block,
        paddingInline: actualPaddings.inline,
        className,
      }),
    [actualPaddings.block, actualPaddings.inline, contentBgColor, className],
  )

  return <Scroller {...rest} className={actualClassName} />
}
