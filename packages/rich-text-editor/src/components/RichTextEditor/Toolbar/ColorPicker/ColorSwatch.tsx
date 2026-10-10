import { type ComponentPropsWithRef, type FC, type KeyboardEvent, memo, useMemo } from 'react'
import { FaAIcon, FaCheckIcon } from 'smarthr-ui'

import { tv } from '../../../../libs/tv'

const faceClassNameGenerator = tv({
  slots: {
    face: 'shr-rte-border-shorthand shr-rte-flex shr-rte-items-center shr-rte-justify-center shr-rte-rounded-m',
    letter: '',
  },
  variants: {
    size: {
      // A は他のアイコンと同じ 16px。箱は押下状態のボタン（32px）に近い余白感になる大きさ
      S: { face: 'shr-rte-size-[26px]', letter: 'shr-rte-text-base' },
      M: { face: 'shr-rte-size-2', letter: 'shr-rte-text-lg' },
    },
  },
  defaultVariants: {
    size: 'M',
  },
})

const buttonClassNameGenerator = tv({
  base: [
    'shr-rte-relative shr-rte-inline-flex shr-rte-cursor-pointer shr-rte-rounded-m shr-rte-border-none shr-rte-bg-transparent shr-rte-p-0',
    'hover:shr-rte-shadow-outline',
  ],
})

const CHECK_CLASS_NAME =
  'shr-rte-absolute shr-rte-bottom-0 shr-rte-right-0 shr-rte-rounded-s shr-rte-bg-white shr-rte-text-xs shr-rte-text-main'

type FaceProps = {
  color: string
  /** color なら白地に色付きの A、backgroundColor なら色のベタ塗りで表す */
  appearance: 'color' | 'backgroundColor'
  size?: 'S' | 'M'
}

/** 色そのものを表す四角。操作を持たない表示専用 */
export const ColorSwatchFace: FC<FaceProps & Omit<ComponentPropsWithRef<'span'>, 'color'>> = memo(
  ({ color, appearance, size, className, ...rest }) => {
    const isTextColor = appearance === 'color'

    const classNames = useMemo(() => {
      const { face, letter } = faceClassNameGenerator({ size })

      return { face: face({ className }), letter: letter() }
    }, [size, className])

    const style = useMemo(
      () => (isTextColor ? { backgroundColor: '#fff', color } : { backgroundColor: color }),
      [isTextColor, color],
    )

    return (
      <span {...rest} className={classNames.face} style={style}>
        {isTextColor && <FaAIcon className={classNames.letter} />}
      </span>
    )
  },
)

type Props = FaceProps & {
  label: string
  selected: boolean
  handleClick: () => void
  handleKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void
} & Omit<ComponentPropsWithRef<'button'>, 'color' | 'onClick' | 'onKeyDown' | 'children'>

/** 文字色・背景色の選択肢ひとつ分。ツールバーとテーブルのパレットで共有する */
export const ColorSwatch: FC<Props> = memo(
  ({
    color,
    appearance,
    size,
    label,
    selected,
    handleClick,
    handleKeyDown,
    className,
    ...rest
  }) => {
    const buttonClassName = useMemo(() => buttonClassNameGenerator({ className }), [className])

    return (
      <button
        {...rest}
        type="button"
        title={label}
        className={buttonClassName}
        aria-label={label}
        aria-pressed={selected}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <ColorSwatchFace appearance={appearance} size={size} color={color} />
        {selected && <FaCheckIcon className={CHECK_CLASS_NAME} />}
      </button>
    )
  },
)
