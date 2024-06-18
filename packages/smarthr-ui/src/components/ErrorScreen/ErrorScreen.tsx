import React, { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { PageHeading } from '../Heading'
import { Center, Stack } from '../Layout'
import { SmartHRLogo } from '../SmartHRLogo'
import { TextLink } from '../TextLink'

import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'

type Props = {
  /** ロゴ */
  logo?: ReactNode
  /** コンテンツの上に表示されるタイトル */
  title?: ReactNode
  /** コンテンツの下に表示されるアンカー要素のリスト */
  links?: Array<{
    /** アンカー要素のテキスト */
    label: ReactNode
    /** アンカー要素の href */
    url: string
    /** アンカー要素の target。`_blank` を設定すると外部リンクアイコンが表示されます。*/
    target?: string
  }>
  /** 表示するコンテンツ */
  children?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}

type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const errorScreen = tv({
  base: 'smarthr-ui-ErrorScreen shr-bg-background',
})

export const ErrorScreen: FC<Props & ElementProps> = ({
  logo = <SmartHRLogo fill="brand" className="shr-p-0.75" />,
  title,
  links,
  children,
  className,
  ...props
}) => {
  const styles = useMemo(() => errorScreen({ className }), [className])

  return (
    <Center {...props} minHeight="100vh" verticalCentering className={styles}>
      <Stack gap={1.5} align="center" className="[&&&]:shr-my-auto">
        <div className="smarthr-ui-ErrorScreen-logo">{logo}</div>

        <Stack align="center">
          {title && <PageHeading className="smarthr-ui-ErrorScreen-title">{title}</PageHeading>}

          {children && <div className="smarthr-ui-ErrorScreen-content">{children}</div>}

          {links?.length && (
            <Stack
              as="ul"
              gap={0.5}
              align="center"
              className="smarthr-ui-ErrorScreen-linkList shr-list-none"
            >
              {links.map((link, index) => (
                <li key={index}>
                  <TextLink
                    {...(link.target ? { target: link.target } : {})}
                    href={link.url}
                    className="smarthr-ui-ErrorScreen-link"
                  >
                    {link.label}
                  </TextLink>
                </li>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Center>
  )
}
