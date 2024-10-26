import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

// HINT: trianble部分はRetinaディスプレイなどで途切れてしまう場合があるので
// 1pxほど大きめに描画してbody部分と被るようにしています。
const balloon = tv({
  base: [
    'smarthr-ui-Balloon',
    'shr-relative',
    'shr-inline-block',
    'shr-text-sm',
    'shr-rounded-s',
    /* drop-shadow は spread-radius を受け付けないので shadow.LAYER2 に近い値をハードコーディングしている */
    'shr-drop-shadow-[0_2px_2.5px_theme(colors.transparency.30)]',
    // Safariでdrop-shadowが残り続けてしまうバグの対応
    'shr-will-change-[filter]',
    'shr-whitespace-nowrap',
    'shr-bg-white',
    'shr-text-black',
    'after:shr-block',
    'after:shr-absolute',
    'after:shr-content-[""]',
    'after:shr-bg-white',
    'contrast-more:shr-border-shorthand',
    'contrast-more:shr-border-high-contrast',
    'contrast-more:before:shr-block',
    'contrast-more:before:shr-absolute',
    'contrast-more:before:shr-content-[""]',
    'contrast-more:before:shr-bg-black',
  ],
  variants: {
    horizontal: {
      center: [
        'before:shr-left-1/2',
        'before:-shr-translate-x-[5px]',
        'after:shr-left-1/2',
        'after:-shr-translate-x-[5px]',
      ],
      right: '',
      left: '',
    },
    vertical: {
      top: [
        'before:-shr-top-[5px]',
        'before:shr-w-[10px]',
        'before:shr-h-[5px]',
        'before:[clip-path:polygon(50%_0,100%_100%,0_100%)]',
        'after:-shr-top-0.25',
        'after:shr-w-[10px]',
        'after:shr-h-[5px]',
        'after:[clip-path:polygon(50%_0,100%_100%,0_100%)]',
      ],
      bottom: [
        'before:-shr-bottom-[5px]',
        'before:shr-w-[10px]',
        'before:shr-h-[5px]',
        'before:[clip-path:polygon(0_0,100%_0,50%_100%)]',
        'after:-shr-bottom-0.25',
        'after:shr-w-[10px]',
        'after:shr-h-[5px]',
        'after:[clip-path:polygon(0_0,100%_0,50%_100%)]',
      ],
      middle: [
        'before:shr-top-1/2',
        'before:-shr-translate-y-[5px]',
        'after:shr-top-1/2',
        'after:-shr-translate-y-[5px]',
      ],
    },
  },
  compoundVariants: [
    {
      vertical: ['top', 'bottom'],
      horizontal: 'left',
      className: ['before:shr-left-1.5', 'after:shr-left-1.5'],
    },
    {
      vertical: ['top', 'bottom'],
      horizontal: 'right',
      className: ['before:shr-right-1.5', 'after:shr-right-1.5'],
    },
    {
      vertical: 'middle',
      horizontal: 'left',
      className: [
        'before:-shr-left-[5px]',
        'before:shr-w-[5px]',
        'before:shr-h-[10px]',
        'before:[clip-path:polygon(100%_0,100%_100%,0_50%)]',
        'after:-shr-left-0.25',
        'after:shr-w-[5px]',
        'after:shr-h-[10px]',
        'after:[clip-path:polygon(100%_0,100%_100%,0_50%)]',
      ],
    },
    {
      vertical: 'middle',
      horizontal: 'right',
      className: [
        'before:-shr-right-[5px]',
        'before:shr-w-[5px]',
        'before:shr-h-[10px]',
        'before:[clip-path:polygon(0_0,100%_50%,0_100%)]',
        'after:-shr-right-0.25',
        'after:shr-w-[5px]',
        'after:shr-h-[10px]',
        'after:[clip-path:polygon(0_0,100%_50%,0_100%)]',
      ],
    },
  ],
})

type Props = PropsWithChildren<
  VariantProps<typeof balloon> & {
    /** レンダリングするタグ */
    as?: 'div' | 'span'
  }
>

type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

export const Balloon: FC<Props & ElementProps> = ({
  horizontal,
  vertical,
  className,
  as: Component = 'div',
  ...props
}) => {
  const styles = useMemo(
    () => balloon({ horizontal, vertical, className }),
    [className, horizontal, vertical],
  )

  return <Component {...props} className={styles} />
}
