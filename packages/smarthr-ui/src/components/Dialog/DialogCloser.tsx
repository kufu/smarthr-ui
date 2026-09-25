import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export const DIALOG_CLOSER_CLASS_NAME = 'smarthr-ui-Dialog-closer'

const classNameGenerator = tv({
  base: [DIALOG_CLOSER_CLASS_NAME, 'shr-inline-block'],
})

// HINT: onClickは念のためomitしているが、必要に応じて利用可能にすることを検討する
type Props = PropsWithChildren<Omit<ComponentProps<'div'>, 'onClick'>>

export const DialogCloser: FC<Props> = ({ className, children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <div {...rest} className={actualClassName}>
      {children}
    </div>
  )
}
