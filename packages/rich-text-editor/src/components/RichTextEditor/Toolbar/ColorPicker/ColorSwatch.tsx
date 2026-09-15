import { type ComponentPropsWithRef, type FC, type KeyboardEvent, memo, useMemo } from 'react'
import { FaAIcon, FaCheckIcon } from 'smarthr-ui'
import { tv } from 'tailwind-variants'

const faceClassNameGenerator = tv({
  slots: {
    face: 'shr-border-shorthand shr-flex shr-items-center shr-justify-center shr-rounded-m',
    letter: '',
  },
  variants: {
    size: {
      // A は他のアイコンと同じ 16px。箱は押下状態のボタン（32px）に近い余白感になる大きさ
      S: { face: 'shr-size-[26px]', letter: 'shr-text-base' },
      M: { face: 'shr-size-2', letter: 'shr-text-lg' },
    },
  },
  defaultVariants: {
    size: 'M',
  },
})

const buttonClassNameGenerator = tv({
  base: [
    'shr-relative shr-inline-flex shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-p-0',
    'hover:shr-shadow-outline',
  ],
})

const CHECK_CLASS_NAME =
  'shr-absolute shr-bottom-0 shr-right-0 shr-rounded-s shr-bg-white shr-text-xs shr-text-main'

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
