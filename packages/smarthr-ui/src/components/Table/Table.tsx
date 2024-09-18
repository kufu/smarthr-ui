import React, { ComponentProps, FC, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

type Props = PropsWithChildren<VariantProps<typeof table>>
type ElementProps = Omit<ComponentProps<'table'>, keyof Props>

const table = tv({
  base: [
    'smarthr-ui-Table',
    'shr-w-full',
    /* Headがfixed=trueの場合、separate以外だとHeadとBodyの間に隙間が生まれるため、明示的に指定しています */
    'shr-broder-separate',
    'shr-border-spacing-0',
    'shr-bg-column',
    '[&_tbody]:shr-bg-white',
    '[&_th]:contrast-more:shr-border-shorthand [&_th]:shr-bg-head [&_th]:contrast-more:shr-border-high-contrast',
    '[&_td]:contrast-more:shr-border-shorthand [&_td]:contrast-more:shr-border-high-contrast',
    'contrast-more:shr-border-shorthand contrast-more:shr-border-high-contrast',
  ],
  variants: {
    layout: {
      auto: '',
      fixed: 'shr-table-fixed',
    },
    fixedHead: {
      true: [
        '[&_thead]:shr-sticky [&_thead]:shr-start-0 [&_thead]:shr-top-0',
        /* zIndexの値はセマンティックトークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
        '[&_thead]:shr-z-fixed-menu',
      ],
    },
  },
})

export const Table: FC<Props & ElementProps> = ({
  fixedHead = false,
  layout = 'auto',
  className,
  ...props
}) => {
  const styles = useMemo(
    () => table({ fixedHead, layout, className }),
    [className, fixedHead, layout],
  )
  return <table {...props} className={styles} />
}
