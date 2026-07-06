import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useEnvironment } from '../../hooks/useEnvironment'
import { backgroundColor, paddingBlock, paddingInline } from '../../tailwind'
import { Scroller } from '../Scroller'

import type { Gap } from '../../types'

export type Props = PropsWithChildren<
  Pick<VariantProps<typeof classNameGenerator>, 'contentBgColor'> & {
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

export const DialogBody: FC<Props> = ({ contentBgColor, contentPadding, className, ...rest }) => {
  const { mobile } = useEnvironment()

  const actualPaddings = useMemo(() => {
    const initialized = contentPadding === undefined ? (mobile ? 1 : 1.5) : contentPadding

    return initialized instanceof Object ? initialized : { block: initialized, inline: initialized }
  }, [contentPadding, mobile])
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
