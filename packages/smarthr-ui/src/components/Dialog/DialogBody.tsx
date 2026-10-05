import { type ComponentPropsWithRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { backgroundColor, paddingBlock, paddingInline } from '../../tailwind'
import { Scroller } from '../Scroller'

import type { Gap } from '../../types'

type BaseProps = PropsWithChildren<{
  /** コンテンツ部分の背景色 */
  contentBgColor?: keyof typeof backgroundColor
  contentPadding?: Gap | { block?: Gap; inline?: Gap }
}>
type Props = BaseProps &
  Omit<ComponentPropsWithRef<typeof Scroller>, keyof BaseProps | 'as' | 'direction' | 'styleType'>

const classNameGenerator = tv({
  base: ['smarthr-ui-Dialog-body', 'shr-flex-auto'],
  variants: {
    paddingBlock,
    paddingInline,
    contentBgColor: backgroundColor,
  },
})

export const DialogBody: FC<Props> = ({ contentBgColor, contentPadding, className, ...rest }) => {
  const initialized = contentPadding === undefined ? 1.5 : contentPadding
  const actualPaddings =
    initialized instanceof Object ? initialized : { block: initialized, inline: initialized }

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
