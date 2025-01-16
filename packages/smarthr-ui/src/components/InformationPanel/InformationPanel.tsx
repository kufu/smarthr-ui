'use client'

import React, { FC, PropsWithChildren, useCallback, useEffect, useId, useState } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Base, BaseElementProps } from '../Base'
import { Button } from '../Button'
import { Heading, HeadingTagTypes } from '../Heading'
import { FaCaretDownIcon, FaCaretUpIcon } from '../Icon'
import { Cluster } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { DecoratorsType } from '../../types'

type Props = PropsWithChildren<{
  /** パネルのタイトル */
  title: React.ReactNode
  /**
   * @deprecated titleTagは非推奨です
   */
  titleTag?: HeadingTagTypes
  /** `true` のとき、開閉ボタンを表示する */
  togglable?: boolean
  /** 開閉ボタン押下時に発火するコールバック関数 */
  onClickTrigger?: (active: boolean) => void
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'openButtonLabel' | 'closeButtonLabel'>
}> &
  VariantProps<typeof informationPanel>

const OPEN_BUTTON_LABEL = '開く'
const CLOSE_BUTTON_LABEL = '閉じる'

export const informationPanel = tv({
  slots: {
    wrapper: 'smarthr-ui-InformationPanel shr-shadow-layer-3',
    header: 'shr-p-1.5',
    heading: 'smarthr-ui-InformationPanel-title',
    togglableButton: 'smarthr-ui-InformationPanel-closeButton -shr-my-0.5 shr-ms-auto',
    content: [
      'smarthr-ui-InformationPanel-content',
      'shr-p-1.5 shr-pt-0 shr-text-base aria-hidden:shr-hidden',
    ],
  },
  variants: {
    type: {
      success: {},
      info: {},
      warning: {},
      error: {},
      sync: {},
    },
    active: {
      true: {},
      false: {
        header: 'shr-py-1',
      },
    },
    bold: {
      true: {
        header: 'shr-py-1',
        content: 'shr-pt-1',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      type: ['success', 'warning', 'error'],
      bold: true,
      className: {
        header: 'shr-text-white',
        heading: '[&_.smarthr-ui-Icon]:shr-fill-white',
      },
    },
    {
      type: 'success',
      bold: true,
      className: {
        header: 'shr-bg-main',
      },
    },
    {
      type: 'warning',
      bold: true,
      className: {
        header: 'shr-bg-warning-yellow shr-text-black',
        heading: [
          '[&_.smarthr-ui-WarningIcon-wrapper]:shr-fill-black',
          '[&_.smarthr-ui-WarningIcon-mark]:shr-fill-warning-yellow',
        ],
      },
    },
    {
      type: 'error',
      bold: true,
      className: {
        header: 'shr-bg-danger',
      },
    },
  ],
})

export const InformationPanel: FC<Props & Omit<BaseElementProps, keyof Props>> = ({
  title,
  titleTag,
  type = 'info',
  togglable = false,
  active: activeProps = true,
  bold,
  className,
  children,
  onClickTrigger,
  decorators,
  ...props
}) => {
  const [active, setActive] = useState(activeProps)
  const titleId = useId()
  const contentId = useId()

  const handleClickTrigger = useCallback(() => {
    if (onClickTrigger) {
      onClickTrigger(active)
    } else {
      setActive(!active)
    }
  }, [active, onClickTrigger])

  useEffect(() => {
    setActive(activeProps)
  }, [activeProps])

  const styles = useMemo(() => {
    const withActive = informationPanel({
      type,
      active: true,
      bold,
    })
    const withInactive = informationPanel({
      type,
      active: false,
      bold,
    })

    const wrapperProps = { className }

    return {
      active: {
        wrapper: withActive.wrapper(wrapperProps),
        header: withActive.header(),
        heading: withActive.heading(),
        togglableButton: withActive.togglableButton(),
        content: withActive.content(),
      },
      inactive: {
        wrapper: withInactive.wrapper(wrapperProps),
        header: withInactive.header(),
        heading: withInactive.heading(),
        togglableButton: withInactive.togglableButton(),
        content: withInactive.content(),
      },
    }
  }, [bold, type, className])

  const currentStyles = styles[active ? 'active' : 'inactive']

  return (
    <Base {...props} overflow="hidden" as="section" className={currentStyles.wrapper}>
      <Cluster align="center" justify="space-between" className={currentStyles.header}>
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Heading type="blockTitle" tag={titleTag} id={titleId} className={currentStyles.heading}>
          <ResponseMessage type={type} iconGap={0.5}>
            {title}
          </ResponseMessage>
        </Heading>
        {togglable && (
          <Button
            suffix={active ? <FaCaretUpIcon /> : <FaCaretDownIcon />}
            size="s"
            onClick={handleClickTrigger}
            aria-expanded={togglable ? active : undefined}
            aria-controls={contentId}
            className={currentStyles.togglableButton}
          >
            {active
              ? decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL
              : decorators?.openButtonLabel?.(OPEN_BUTTON_LABEL) || OPEN_BUTTON_LABEL}
          </Button>
        )}
      </Cluster>
      <div id={contentId} aria-hidden={!active} className={currentStyles.content}>
        {children}
      </div>
    </Base>
  )
}
