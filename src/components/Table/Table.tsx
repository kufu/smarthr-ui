import React, { ComponentProps, FC, PropsWithChildren, createContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export const TableGroupContext = createContext<{
  group: 'head' | 'body'
}>({
  group: 'body',
})

type Props = PropsWithChildren<{
  /** `true` のとき、スクロール時にヘッダーを固定表示する */
  fixedHead?: boolean
}>
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
    '[&_th]:shr-bg-head [&_th]:contrast-more:shr-border [&_th]:contrast-more:shr-border-solid [&_th]:contrast-more:shr-border-highContrast',
    '[&_td]:contrast-more:shr-border [&_td]:contrast-more:shr-border-solid [&_td]:contrast-more:shr-border-highContrast',
    'contrast-more:shr-border contrast-more:shr-border-solid contrast-more:shr-border-highContrast',
  ],
  variants: {
    fixedHead: {
      true: [
        '[&_thead]:shr-sticky',
        '[&_thead]:shr-start-0',
        '[&_thead]:shr-top-0',
        /* zIndexの値はセマンティックトークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
        '[&_thead]:shr-z-fixed-menu',
      ],
    },
  },
})

export const Table: FC<Props & ElementProps> = ({ fixedHead = false, className, ...props }) => {
  const styles = useMemo(() => table({ fixedHead, className }), [className, fixedHead])
  return <table {...props} className={styles} />
}
