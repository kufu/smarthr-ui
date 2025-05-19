import { type ComponentPropsWithoutRef, type FC, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Cluster } from '../Layout'

export type SideNavSizeType = 'default' | 's'

type Props = {
  /** アイテムの識別子 */
  id: string
  /** アイテムのタイトル
   * @deprecated SideNav で items を使う時の props です。children を使ってください。
   */
  title?: ReactNode
  /** タイトルのプレフィックスの内容。通常、StatusLabel の配置に用います。 */
  prefix?: ReactNode
  /** 選択されているアイテムかどうか */
  current?: boolean
  /** アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

type ElementProps = Omit<ComponentPropsWithoutRef<'li'>, keyof Props>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-SideNav-item',
      'data-[current=true]:shr-relative data-[current=true]:shr-bg-main data-[current=true]:shr-text-white',
      'data-[current=true]:after:shr-absolute data-[current=true]:after:-shr-right-0.25 data-[current=true]:after:shr-top-1/2 data-[current=true]:after:-shr-translate-y-1/2 data-[current=true]:after:shr-translate-x-0 data-[current=true]:after:shr-border-b-4 data-[current=true]:after:shr-border-l-4 data-[current=true]:after:shr-border-r-0 data-[current=true]:after:shr-border-t-4 data-[current=true]:after:shr-border-solid data-[current=true]:after:shr-border-b-transparent data-[current=true]:after:shr-border-l-main data-[current=true]:after:shr-border-r-transparent data-[current=true]:after:shr-border-t-transparent data-[current=true]:after:shr-content-[""]',
      'data-[current=false]:hover:shr-bg-column-darken',
    ],
    button: [
      'shr-w-full shr-leading-none [&]:shr-box-border',
      'focus-visible:shr-focus-indicator',
      'shr-inline-flex shr-items-center',
    ],
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

export const SideNavItemButton: FC<Props & ElementProps> = ({
  id,
  title,
  prefix,
  current,
  size,
  onClick,
  children,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { wrapper, button, buttonInner } = classNameGenerator()

    return {
      wrapper: wrapper(),
      button: button({ size: size ?? 'default' }),
      buttonInner: buttonInner(),
    }
  }, [size])

  return (
    <li {...rest} data-current={!!current} className={classNames.wrapper}>
      <UnstyledButton className={classNames.button} onClick={onClick} value={id}>
        <ButtonBodyCluster
          prefix={prefix}
          title={children ?? title}
          titleClassName={classNames.buttonInner}
        />
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
