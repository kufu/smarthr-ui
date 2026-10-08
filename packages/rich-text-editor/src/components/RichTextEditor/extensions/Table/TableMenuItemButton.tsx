import type { ComponentPropsWithRef, FC, MouseEvent, ReactNode } from 'react'

const CLASS_NAME =
  'shr-rte-box-border shr-rte-flex shr-rte-w-full shr-rte-cursor-pointer shr-rte-items-center shr-rte-justify-start shr-rte-gap-0.5 shr-rte-whitespace-nowrap shr-rte-rounded-none shr-rte-border-none shr-rte-border-transparent shr-rte-bg-transparent shr-rte-px-1 shr-rte-py-0.75 shr-rte-text-left shr-rte-font-inherit shr-rte-text-base shr-rte-font-normal shr-rte-leading-none shr-rte-text-black hover:shr-rte-bg-white-darken focus-visible:shr-rte-bg-white-darken focus-visible:shr-rte-focus-indicator group-data-[keyboard=false]/table-menu:focus:shr-rte-outline-none group-data-[keyboard=true]/table-menu:focus:shr-rte-focus-indicator aria-disabled:shr-rte-cursor-not-allowed aria-disabled:shr-rte-bg-transparent aria-disabled:shr-rte-text-disabled aria-disabled:forced-colors:shr-rte-text-[GrayText] [&_svg]:shr-rte-block [&_svg]:forced-colors:aria-disabled:shr-rte-fill-[GrayText]'

const EVENT_CANCELLER = (e: MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  e.stopPropagation()
}

type Props = {
  prefix?: ReactNode
  suffix?: ReactNode
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void
} & Omit<ComponentPropsWithRef<'button'>, 'type' | 'className' | 'prefix' | 'onClick'>

// HINT: disabled 属性ではなく aria-disabled にするのは、smarthr-ui の Button と同じく
// 使用不可の項目もフォーカスでき、メニューのキー操作で辿れるようにするため
export const TableMenuItemButton: FC<Props> = ({
  prefix,
  suffix,
  children,
  disabled,
  handleClick,
  ...rest
}) => (
  <button
    {...rest}
    type="button"
    className={CLASS_NAME}
    aria-disabled={disabled || undefined}
    onClick={disabled ? EVENT_CANCELLER : handleClick}
  >
    {prefix}
    <span className={suffix ? 'shr-rte-min-w-0 shr-rte-flex-1' : 'shr-rte-min-w-0'}>
      {children}
    </span>
    {suffix}
  </button>
)
