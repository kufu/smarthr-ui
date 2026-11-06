'use client'

import {
  type FC,
  type MouseEvent,
  type ReactNode,
  memo,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { Heading } from '../../Heading'
import { FaXmarkIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Text } from '../../Text'

import { DrawerContext } from './DrawerContext'

import type { ExtendElementPropsWithRef } from '../../../types'

type Props = ExtendElementPropsWithRef<
  'div',
  {
    /** タイトル */
    title: ReactNode
    /** サブタイトル */
    subtitle?: ReactNode
    /** 見出しの id。未指定なら Drawer が自動生成した id で dialog と接続される */
    id?: string
  }
>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-Drawer-header',
      'shr-border-b-shorthand shr-flex shr-flex-[0_0_auto] shr-items-start shr-justify-between shr-gap-1 shr-px-1.5 shr-py-1',
    ],
    closeButton: 'smarthr-ui-Drawer-closeButton shr-shrink-0',
  },
})

export const DrawerHeader: FC<Props> = ({ title, subtitle, id, className, ...rest }) => {
  const { handleClickClose, headingId, registerHeadingId } = useContext(DrawerContext)
  const actualHeadingId = id ?? headingId

  useEffect(() => {
    registerHeadingId(actualHeadingId)

    return () => registerHeadingId(undefined)
  }, [actualHeadingId, registerHeadingId])

  const classNames = useMemo(() => {
    const { wrapper, closeButton } = classNameGenerator()

    return { wrapper: wrapper({ className }), closeButton: closeButton() }
  }, [className])

  return (
    <div {...rest} className={classNames.wrapper}>
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
      <CloseButton className={classNames.closeButton} onClick={handleClickClose} />
    </div>
  )
}

const CloseButton = memo<{
  onClick: (e?: MouseEvent<HTMLButtonElement>) => void
  className: string
}>(({ onClick, className }) => {
  const { localize } = useIntl()
  const alt = localize({ id: 'smarthr-ui/Drawer/closeButtonIconAlt', defaultText: '閉じる' })

  return (
    <Button size="S" className={className} onClick={onClick}>
      <FaXmarkIcon alt={alt} />
    </Button>
  )
})
