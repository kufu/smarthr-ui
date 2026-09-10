'use client'

import { type FC, type ReactNode, memo, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { FaXmarkIcon } from '../Icon'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { DrawerContentContext } from './DrawerContentContext'
import { DrawerHeadingContext } from './DrawerHeadingContext'

export type DrawerHeaderProps = {
  /** タイトル */
  title: ReactNode
  /** サブタイトル */
  subtitle?: ReactNode
  /** 見出しの id。未指定なら Drawer が自動生成した id で dialog と接続される */
  id?: string
  /** 閉じるボタン押下時。未指定なら Uncontrolled の Context を使う */
  onClickClose?: () => void
}

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-Drawer-header',
      'shr-border-b-shorthand shr-flex shr-flex-[0_0_auto] shr-items-start shr-justify-between shr-gap-1 shr-px-1.5 shr-py-1',
    ],
    closeButton: 'smarthr-ui-Drawer-closeButton shr-shrink-0',
  },
})

export const DrawerHeader: FC<DrawerHeaderProps> = ({ title, subtitle, id, onClickClose }) => {
  const { onClickClose: contextOnClickClose } = useContext(DrawerContentContext)
  const { headingId } = useContext(DrawerHeadingContext)
  const actualOnClickClose = onClickClose ?? contextOnClickClose
  const actualHeadingId = id ?? headingId

  const classNames = useMemo(() => {
    const { wrapper, closeButton } = classNameGenerator()
    return { wrapper: wrapper(), closeButton: closeButton() }
  }, [])

  return (
    <div className={classNames.wrapper}>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading>
        <Stack as="span" gap={0.25}>
          {subtitle && (
            <Text size="S" leading="TIGHT" color="TEXT_GREY">
              {subtitle}
            </Text>
          )}
          <Text id={actualHeadingId} size="L" leading="TIGHT">
            {title}
          </Text>
        </Stack>
      </Heading>
      <CloseButton className={classNames.closeButton} onClick={actualOnClickClose} />
    </div>
  )
}

const CloseButton = memo<{ onClick: () => void; className: string }>(({ onClick, className }) => {
  const { localize } = useIntl()
  const alt = localize({ id: 'smarthr-ui/Drawer/closeButtonIconAlt', defaultText: '閉じる' })

  return (
    <Button type="button" size="S" className={className} onClick={onClick}>
      <FaXmarkIcon alt={alt} />
    </Button>
  )
})
