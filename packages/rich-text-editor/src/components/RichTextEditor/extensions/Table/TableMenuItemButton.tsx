import type { ComponentPropsWithRef, FC, MouseEvent, ReactNode } from 'react'

const CLASS_NAME =
  'shr-box-border shr-flex shr-w-full shr-cursor-pointer shr-items-center shr-justify-start shr-gap-0.5 shr-whitespace-nowrap shr-rounded-none shr-border-none shr-border-transparent shr-bg-transparent shr-px-1 shr-py-0.75 shr-text-left shr-font-inherit shr-text-base shr-font-normal shr-leading-none shr-text-black hover:shr-bg-white-darken focus-visible:shr-bg-white-darken focus-visible:shr-focus-indicator group-data-[keyboard=false]/table-menu:focus:shr-outline-none group-data-[keyboard=true]/table-menu:focus:shr-focus-indicator aria-disabled:shr-cursor-not-allowed aria-disabled:shr-bg-transparent aria-disabled:shr-text-disabled aria-disabled:forced-colors:shr-text-[GrayText] [&_svg]:shr-block [&_svg]:forced-colors:aria-disabled:shr-fill-[GrayText]'

const EVENT_CANCELLER = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

type Props = {
  prefix?: ReactNode
  suffix?: ReactNode
} & Omit<ComponentPropsWithRef<'button'>, 'type' | 'className' | 'prefix'>

// HINT: disabled 属性ではなく aria-disabled にするのは、smarthr-ui の Button と同じく
// 使用不可の項目もフォーカスでき、メニューのキー操作で辿れるようにするため
export const TableMenuItemButton: FC<Props> = ({
  prefix,
  suffix,
  children,
  disabled,
  onClick,
  ...rest
}) => (
  <button
    {...rest}
    type="button"
    className={CLASS_NAME}
    aria-disabled={disabled || undefined}
    onClick={disabled ? EVENT_CANCELLER : onClick}
  >
    {prefix}
    <span className={suffix ? 'shr-min-w-0 shr-flex-1' : 'shr-min-w-0'}>{children}</span>
    {suffix}
  </button>
)
