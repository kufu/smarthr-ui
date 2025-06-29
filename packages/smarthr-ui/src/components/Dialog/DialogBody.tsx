import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { bgColors, paddingBlock, paddingInline } from '../../themes/tailwind'

import type { Gap } from '../../types'

export type Props = PropsWithChildren<
  Pick<VariantProps<typeof classNameGenerator>, 'contentBgColor'> & {
    contentPadding?: Gap | { block?: Gap; inline?: Gap }
    className?: string | undefined
  } & Pick<ComponentProps<'div'>, 'ref'>
>

const classNameGenerator = tv({
  base: ['smarthr-ui-Dialog-body', 'shr-flex-auto shr-overflow-auto'],
  variants: {
    paddingBlock,
    paddingInline,
    contentBgColor: bgColors,
  },
})

export const DialogBody: FC<Props> = ({ contentBgColor, contentPadding, className, ...rest }) => {
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

  return <div {...rest} className={actualClassName} />
}
