import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Cluster } from '../Layout'

export type SideNavSizeType = 'M' | 'S'

type AbstractProps = {
  /** アイテムの識別子 */
  id: string
  /** アイテムのタイトル
   * @deprecated SideNav で items を使う時の props です。children を使ってください。
   */
  title?: ReactNode
  /** タイトルのプレフィックスの内容。通常、StatusLabelやIconの配置に用います。 */
  prefix?: ReactNode
  /** タイトルのサフィックスの内容。通常、Prefixを使用済みの場合にStatusLabelやChipの配置に用います。 */
  suffix?: ReactNode
  /** 選択されているアイテムかどうか */
  current?: boolean
  /** アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void
}
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'li'>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-SideNav-item shr-relative',
      'data-[current=true]:shr-bg-main data-[current=true]:shr-text-white',
      'data-[current=true]:after:shr-absolute data-[current=true]:after:-shr-right-0.25 data-[current=true]:after:shr-top-1/2 data-[current=true]:after:-shr-translate-y-1/2 data-[current=true]:after:shr-translate-x-0 data-[current=true]:after:shr-border-b-4 data-[current=true]:after:shr-border-l-4 data-[current=true]:after:shr-border-r-0 data-[current=true]:after:shr-border-t-4 data-[current=true]:after:shr-border-solid data-[current=true]:after:shr-border-b-transparent data-[current=true]:after:shr-border-l-main data-[current=true]:after:shr-border-r-transparent data-[current=true]:after:shr-border-t-transparent data-[current=true]:after:shr-content-[""]',
      'data-[current=false]:hover:shr-bg-column-darken',
      '[&:has(:focus-visible)]:shr-z-1', // pseudoエレメントがliの::afterと衝突しないために子要素に適用しますが、次のエレメントに被られるからz-indexを一時的に変更します
    ],
    button: [
      'shr-w-full shr-leading-none [&]:shr-box-border',
      'focus-visible:shr-focus-indicator',
      '[[data-current=true]_&:focus-visible]:shr-focus-indicator',
      'shr-inline-flex shr-items-center',
      'shr-no-underline',

      // ::before: フォーカスリングと上のアイテムの下端の間の隙間を埋めるために、上端から1px外側に1pxの横線を描画する。
      // 非選択かつ先頭以外のボタンにフォーカスが当たったときのみ表示する
      'before:shr-absolute before:-shr-top-[1px] before:shr-left-0 before:shr-hidden before:shr-h-px before:shr-w-full before:shr-bg-border before:shr-content-[""]',
      '[:first-child_&]:before:shr-hidden [[data-current=false]:not(:first-child)_&:focus-visible]:before:shr-block [[data-current=false]_&:focus-visible]:before:shr-absolute',

      // ::after: フォーカスリングと下のアイテムの上端の間の隙間を埋めるために、下端から1px外側に1pxの横線を描画する。
      // 非選択かつ末尾以外のボタンにフォーカスが当たったときのみ表示する
      'after:shr-absolute after:-shr-bottom-[1px] after:shr-left-0 after:shr-hidden after:shr-h-px after:shr-w-full after:shr-bg-border after:shr-content-[""]',
      '[:last-child_&]:after:shr-hidden [[data-current=false]:not(:last-child)_&:focus-visible]:after:shr-block [[data-current=false]_&:focus-visible]:after:shr-absolute',
    ],
    body: 'shr-w-full',
    bodyText: 'smarthr-ui-SideNav-itemBodyText shr-grow',
  },
  variants: {
    size: {
      M: {
        button: 'shr-p-1 shr-text-base',
      },
      S: {
        button: 'shr-px-1 shr-py-0.5 shr-text-sm',
      },
    },
  },
})

export const SideNavItemButton: FC<
  Omit<Props, 'onClick'> & {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }
> = ({ id, title, prefix, suffix, current, size, onClick, children, className, ...rest }) => {
  const classNames = useMemo(() => {
    const { wrapper, button, body, bodyText } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      button: button({ size: size ?? 'M' }),
      body: body(),
      bodyText: bodyText(),
    }
  }, [className, size])

  return (
    <li {...rest} data-current={!!current} className={classNames.wrapper}>
      <UnstyledButton className={classNames.button} onClick={onClick} value={id}>
        <BodyCluster
          prefix={prefix}
          suffix={suffix}
          title={children ?? title}
          classNames={classNames}
        />
      </UnstyledButton>
    </li>
  )
}

export const SideNavItemAnchor = <T extends ElementType = 'a'>({
  id,
  title,
  prefix,
  suffix,
  current,
  size,
  onClick,
  children,
  className,
  href,
  elementAs,
  ...rest
}: Omit<Props, 'onClick'> & {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  href: string | undefined
  /** next/link などのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  elementAs?: T
}) => {
  const classNames = useMemo(() => {
    const { wrapper, button, body, bodyText } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      button: button({ size: size ?? 'M' }),
      body: body(),
      bodyText: bodyText(),
    }
  }, [className, size])

  const Anchor = elementAs || 'a'

  return (
    <li {...rest} data-current={!!current} className={classNames.wrapper}>
      <Anchor className={classNames.button} href={href} onClick={onClick} data-value={id}>
        <BodyCluster
          prefix={prefix}
          suffix={suffix}
          title={children ?? title}
          classNames={classNames}
        />
      </Anchor>
    </li>
  )
}

const BodyCluster = memo<
  Pick<Props, 'prefix' | 'suffix' | 'title'> & {
    classNames: { body: string; bodyText: string }
  }
>(({ prefix, suffix, title, classNames }) => (
  <Cluster inline align="center" className={classNames.body} as="span">
    {prefix}
    <span className={classNames.bodyText}>{title}</span>
    {suffix}
  </Cluster>
))
