import React, { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useId } from '../../hooks/useId'
import { Base, BaseElementProps } from '../Base'
import { Button } from '../Button'
import { Heading, HeadingTagTypes } from '../Heading'
import { FaCaretDownIcon, FaCaretUpIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { ResponseMessage } from '../ResponseMessage'

import type { DecoratorsType } from '../../types'

type Props = PropsWithChildren<{
  /** パネルのタイトル */
  title: React.ReactNode
  /**
   * @deprecated titleTagは非推奨です
   */
  titleTag?: HeadingTagTypes
  /** 表示する情報のタイプ */
  type?: 'success' | 'info' | 'warning' | 'error' | 'sync'
  /** `true` のとき、開閉ボタンを表示する */
  togglable?: boolean
  /** パネルの開閉の状態 */
  active?: boolean
  /** 開閉ボタン押下時に発火するコールバック関数 */
  onClickTrigger?: (active: boolean) => void
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'openButtonLabel' | 'closeButtonLabel'>
}>

const OPEN_BUTTON_LABEL = '開く'
const CLOSE_BUTTON_LABEL = '閉じる'

const informationPanel = tv({
  slots: {
    wrapper: 'smarthr-ui-InformationPanel shr-p-1.5 shr-shadow-layer-3',
    header: 'smarthr-ui-InformationPanel-title',
    togglableButton: 'smarthr-ui-InformationPanel-closeButton -shr-my-0.5 shr-ms-auto',
    content: 'smarthr-ui-InformationPanel-content shr-text-base aria-hidden:shr-hidden',
  },
})

export const InformationPanel: FC<Props & Omit<BaseElementProps, keyof Props>> = ({
  title,
  titleTag,
  type = 'info',
  togglable = true,
  active: activeProps = true,
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

  const { wrapperStyle, headerStyle, togglableButtonStyle, contentStyle } = useMemo(() => {
    const { wrapper, header, togglableButton, content } = informationPanel()
    return {
      wrapperStyle: wrapper({ className }),
      headerStyle: header(),
      togglableButtonStyle: togglableButton(),
      contentStyle: content(),
    }
  }, [className])

  return (
    <Base {...props} as="section" className={wrapperStyle}>
      <Stack gap={1.25}>
        <Cluster align="center" justify="space-between">
          {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
          <Heading type="blockTitle" tag={titleTag} id={titleId} className={headerStyle}>
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
              className={togglableButtonStyle}
            >
              {active
                ? decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL
                : decorators?.openButtonLabel?.(OPEN_BUTTON_LABEL) || OPEN_BUTTON_LABEL}
            </Button>
          )}
        </Cluster>
        <div id={contentId} aria-hidden={!active} className={contentStyle}>
          {children}
        </div>
      </Stack>
    </Base>
  )
}
