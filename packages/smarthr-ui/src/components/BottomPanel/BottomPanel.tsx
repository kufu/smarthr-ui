import { type ComponentPropsWithRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Base } from '../Base'

type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof Props>

type Props = PropsWithChildren<{
  /** コンポーネントに適用する z-index 値 */
  zIndex?: number
}>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-BottomPanel',
    'shr-fixed shr-bottom-0 shr-z-fixed-menu shr-box-border shr-w-full shr-rounded-none shr-p-1.5',
    // Layer 3 だが、上方向への指定のためベタ書き： https://smarthr.design/products/design-tokens/shadow/
    '[box-shadow:_0_-4px_8px_2px_rgba(0,_0,_0,_0.24)]',
  ],
})

export const BottomPanel: FC<Props & ElementProps> = ({
  children,
  zIndex,
  className,
  ...props
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  const style = useMemo(() => (zIndex ? { zIndex } : undefined), [zIndex])

  return (
    <Base {...props} className={actualClassName} style={style}>
      {children}
    </Base>
  )
}
