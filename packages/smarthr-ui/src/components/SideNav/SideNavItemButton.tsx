import React, { FC, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Cluster } from '../Layout'

export type SideNavSizeType = 'default' | 's'
export type OnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void

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
  onClick?: OnClick
}

const sideNavItem = tv({
  slots: {
    wrapper: ['smarthr-ui-SideNav-item'],
    button: ['shr-w-full shr-leading-none [&]:shr-box-border', 'focus-visible:shr-focus-indicator'],
    buttonInner: 'smarthr-ui-SideNav-itemTitle',
  },
  variants: {
    selected: {
      true: {
        wrapper: [
          'shr-relative shr-bg-main shr-text-white',
          'after:shr-absolute after:-shr-right-0.25 after:shr-top-1/2 after:-shr-translate-y-1/2 after:shr-translate-x-0 after:shr-border-b-4 after:shr-border-l-4 after:shr-border-r-0 after:shr-border-t-4 after:shr-border-solid after:shr-border-b-transparent after:shr-border-l-main after:shr-border-r-transparent after:shr-border-t-transparent after:shr-content-[""]',
        ],
      },
      false: {
        wrapper: 'hover:shr-bg-column-darken',
      },
    },
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

export const SideNavItemButton: FC<Props> = ({
  id,
  title,
  prefix,
  isSelected = false,
  size,
  onClick,
}) => {
  const handleClick = onClick
    ? (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick(e, id)
    : undefined

  const { wrapperStyle, buttonStyle, buttonInnerStyle } = useMemo(() => {
    const { wrapper, button, buttonInner } = sideNavItem()
    return {
      wrapperStyle: wrapper({ selected: isSelected }),
      buttonStyle: button({ size }),
      buttonInnerStyle: buttonInner(),
    }
  }, [isSelected, size])

  return (
    <li className={wrapperStyle}>
      <UnstyledButton onClick={handleClick} className={buttonStyle}>
        <Cluster inline align="center" as="span">
          {prefix}
          <span className={buttonInnerStyle}>{title}</span>
        </Cluster>
      </UnstyledButton>
    </li>
  )
}
