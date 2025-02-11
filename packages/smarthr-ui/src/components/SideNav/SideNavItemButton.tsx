import React, { FC, ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Cluster } from '../Layout'

export type SideNavSizeType = 'default' | 's'

type Props = {
  /** アイテムの識別子 */
  id: string
  /** アイテムのタイトル */
  title: ReactNode
  /** タイトルのプレフィックスの内容。通常、StatusLabel の配置に用います。 */
  prefix?: ReactNode
  /** 選択されているアイテムかどうか */
  isSelected?: boolean
  /** アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-SideNav-item',
      'data-[selected=true]:shr-relative data-[selected=true]:shr-bg-main data-[selected=true]:shr-text-white',
      'data-[selected=true]:after:shr-absolute data-[selected=true]:after:-shr-right-0.25 data-[selected=true]:after:shr-top-1/2 data-[selected=true]:after:-shr-translate-y-1/2 data-[selected=true]:after:shr-translate-x-0 data-[selected=true]:after:shr-border-b-4 data-[selected=true]:after:shr-border-l-4 data-[selected=true]:after:shr-border-r-0 data-[selected=true]:after:shr-border-t-4 data-[selected=true]:after:shr-border-solid data-[selected=true]:after:shr-border-b-transparent data-[selected=true]:after:shr-border-l-main data-[selected=true]:after:shr-border-r-transparent data-[selected=true]:after:shr-border-t-transparent data-[selected=true]:after:shr-content-[""]',
      'data-[selected=false]:hover:shr-bg-column-darken',
    ],
    button: ['shr-w-full shr-leading-none [&]:shr-box-border', 'focus-visible:shr-focus-indicator'],
    buttonInner: 'smarthr-ui-SideNav-itemTitle',
  },
  variants: {
    size: {
      default: {
        button: 'shr-p-1 shr-text-base',
      },
      s: {
        button: 'shr-px-1 shr-py-0.5 shr-text-sm',
      },
    },
  },
})

export const SideNavItemButton: FC<Props> = ({ id, title, prefix, isSelected, size, onClick }) => {
  const classNames = useMemo(() => {
    const { wrapper, button, buttonInner } = classNameGenerator()

    return {
      wrapper: wrapper(),
      button: button({ size }),
      buttonInner: buttonInner(),
    }
  }, [size])

  return (
    <li data-selected={!!isSelected} className={classNames.wrapper}>
      <UnstyledButton className={classNames.button} onClick={onClick} value={id}>
        <ButtonBodyCluster prefix={prefix} title={title} titleClassName={classNames.buttonInner} />
      </UnstyledButton>
    </li>
  )
}

const ButtonBodyCluster = memo<Pick<Props, 'prefix' | 'title'> & { titleClassName: string }>(
  ({ prefix, title, titleClassName }) => (
    <Cluster inline align="center" as="span">
      {prefix}
      <span className={titleClassName}>{title}</span>
    </Cluster>
  ),
)
