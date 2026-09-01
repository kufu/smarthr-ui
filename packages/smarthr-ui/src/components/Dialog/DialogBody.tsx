import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { backgroundColor, paddingBlock, paddingInline } from '../../tailwind'
import { Scroller } from '../Scroller'

import type { Gap } from '../../types'

export type Props = PropsWithChildren<
  Pick<VariantProps<typeof classNameGenerator>, 'contentBgColor'> & {
    mobile: boolean
    contentPadding?: Gap | { block?: Gap; inline?: Gap }
    className?: string | undefined
  } & Pick<ComponentProps<'div'>, 'ref'>
>

const classNameGenerator = tv({
  base: ['smarthr-ui-Dialog-body', 'shr-flex-auto'],
  variants: {
    paddingBlock,
    paddingInline,
    contentBgColor: backgroundColor,
  },
})

export const DialogBody: FC<Props> = ({
  mobile,
  contentBgColor,
  contentPadding,
  className,
  ...rest
}) => {
  const initialized = contentPadding === undefined ? (mobile ? 1 : 1.5) : contentPadding
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
