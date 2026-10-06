import { type ComponentPropsWithRef, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AutoColSpanTd } from './client'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-BulkActionRow',
    cell: [
      'shr-bg-action-background shr-p-1 shr-text-base',
      'forced-colors:shr-border-t-shorthand',
      '[&_.smarthr-ui-Button.shr-text-link]:shr-text-link-darken',
    ],
  },
})

type Props = ComponentPropsWithRef<'tr'>

export const BulkActionRow: FC<Props> = ({ children, className, ...rest }) => {
  const classNames = useMemo(() => {
    const { wrapper, cell } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      cell: cell(),
    }
  }, [className])

  return (
    <tr {...rest} className={classNames.wrapper}>
      <AutoColSpanTd className={classNames.cell}>{children}</AutoColSpanTd>
    </tr>
  )
}
