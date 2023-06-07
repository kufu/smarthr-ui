import React, { VFC, useCallback, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Base, BaseElementProps } from '../Base'
import { Button } from '../Button'
import { Heading, HeadingTagTypes } from '../Heading'
import {
  FaCaretDownIcon,
  FaCaretUpIcon,
  FaCheckCircleIcon,
  FaExclamationCircleIcon,
  FaInfoCircleIcon,
  FaSyncAltIcon,
  WarningIcon,
} from '../Icon'
import { Cluster, Stack } from '../Layout'

import { useClassNames } from './useClassNames'

import type { DecoratorsType } from '../../types'

type Props = {
  /** パネルのタイトル */
  title: React.ReactNode
  /** タイトル部分の HTML タグ */
  titleTag?: HeadingTagTypes
  /** 表示する情報のタイプ */
  type?: 'success' | 'info' | 'warning' | 'error' | 'sync'
  /** `true` のとき、開閉ボタンを表示する */
  togglable?: boolean
  /** パネルの開閉の状態 */
  active?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** パネル内に表示する内容 */
  children: React.ReactNode
  /** 開閉ボタン押下時に発火するコールバック関数 */
  onClickTrigger?: (active: boolean) => void
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'openButtonLabel' | 'closeButtonLabel'>
}

const OPEN_BUTTON_LABEL = '開く'
const CLOSE_BUTTON_LABEL = '閉じる'

export const InformationPanel: VFC<Props & Omit<BaseElementProps, keyof Props>> = ({
  title,
  titleTag = 'h3',
  type,
  togglable = true,
  active: activeProps = true,
  className = '',
  children,
  onClickTrigger,
  decorators,
  ...props
}) => {
  const theme = useTheme()

  const { Icon, iconColor } = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          Icon: SuccessTitleIcon,
          iconColor: theme.color.MAIN,
        }
      case 'info':
      default:
        return {
          Icon: InfoTitleIcon,
          iconColor: theme.color.TEXT_GREY,
        }
      case 'warning':
        return {
          Icon: WarningTitleIcon,
          iconColor: theme.color.WARNING,
        }
      case 'error':
        return {
          Icon: ErrorTitleIcon,
          iconColor: theme.color.DANGER,
        }
      case 'sync':
        return {
          Icon: SyncIcon,
          iconColor: theme.color.MAIN,
        }
    }
  }, [type, theme.color.DANGER, theme.color.MAIN, theme.color.TEXT_GREY, theme.color.WARNING])

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

  const classNames = useClassNames()

  return (
    <Wrapper
      {...props}
      className={`${className} ${classNames.wrapper}`}
      themes={theme}
      role="region"
      aria-labelledby={titleId}
    >
      <Stack gap={1.25}>
        <Header themes={theme} togglable={togglable}>
          <Heading type="blockTitle" tag={titleTag} id={titleId} className={classNames.title}>
            <Icon color={iconColor} text={title} iconGap={0.5} />
          </Heading>
          {togglable && (
            <TogglableButton
              suffix={active ? <FaCaretUpIcon /> : <FaCaretDownIcon />}
              size="s"
              onClick={handleClickTrigger}
              aria-expanded={togglable ? active : undefined}
              aria-controls={contentId}
              className={classNames.closeButton}
            >
              {active
                ? decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL
                : decorators?.openButtonLabel?.(OPEN_BUTTON_LABEL) || OPEN_BUTTON_LABEL}
            </TogglableButton>
          )}
        </Header>
        <Content themes={theme} id={contentId} aria-hidden={!active} className={classNames.content}>
          {children}
        </Content>
      </Stack>
    </Wrapper>
  )
}

const Wrapper = styled(Base)<{ themes: Theme }>`
  ${({ themes: { spacingByChar, shadow } }) => css`
    padding: ${spacingByChar(1.5)};
    box-shadow: ${shadow.LAYER3};
  `}
`

const Header = styled(Cluster).attrs({
  align: 'center',
  justify: 'space-between',
})<{ themes: Theme; togglable: boolean }>`
  ${({ themes: { border, fontSize, leading, space }, togglable }) => {
    // (Button(1rem + padding-block + border) - Heading(1rem * 1.25) / 2)
    const adjust = `calc((
        (${fontSize.S} + ${space(1)} + ${border.lineWidth} * 2)
        - (${fontSize.M} * ${leading.TIGHT})
      ) / -2)
    `
    return css`
      ${togglable &&
      css`
        &&& {
          margin-block: ${adjust};
        }
      `}
    `
  }}
`

const TogglableButton = styled(Button)`
  margin-inline-start: auto;
`

const createTitleIcon = (Icon: typeof FaCheckCircleIcon) => styled(Icon)`
  flex-shrink: 0;
`
const SuccessTitleIcon = createTitleIcon(FaCheckCircleIcon)
const InfoTitleIcon = createTitleIcon(FaInfoCircleIcon)
const WarningTitleIcon = createTitleIcon(WarningIcon)
const ErrorTitleIcon = createTitleIcon(FaExclamationCircleIcon)
const SyncIcon = createTitleIcon(FaSyncAltIcon)

const Content = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize } }) => css`
    font-size: ${fontSize.M};

    &[aria-hidden='true'] {
      display: none;
    }
  `}
`
