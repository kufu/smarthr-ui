import React, { FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../Button'
import { Heading, HeadingTagTypes } from '../../Heading'
import { Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { Text } from '../../Text'
import { useOffsetHeight } from '../dialogHelper'

import type { DecoratorsType } from '../../../types'

export type BaseProps = {
  /**
   * ダイアログのタイトル
   */
  title: React.ReactNode
  /**
   * ダイアログのサブタイトル
   */
  subtitle?: React.ReactNode
  /**
   * @deprecated SectioningContent(Article, Aside, Nav, Section, SectioningFragment)でDialog全体をラップして、ダイアログタイトルのHeadingレベルを設定してください
   */
  titleTag?: HeadingTagTypes
  /**
   * ダイアログの説明
   */
  description: React.ReactNode
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'closeButtonLabel'>
}

export type MessageDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  titleId: string
}

const CLOSE_BUTTON_LABEL = '閉じる'

const messegeDialogContentInner = tv({
  slots: {
    titleArea:
      'smarthr-ui-Dialog-titleArea shr-border-b-shorthand shr-my-[unset] shr-px-1.5 shr-py-1',
    body: 'smarthr-ui-Dialog-description shr-overflow-auto shr-p-1.5 shr-text-base',
    footer:
      'smarthr-ui-Dialog-buttonArea shr-border-t-shorthand shr-flex shr-justify-end shr-px-1.5 shr-py-1',
  },
})

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  title,
  subtitle,
  titleTag,
  titleId,
  description,
  onClickClose,
  decorators,
}) => {
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  const { titleAreaStyle, bodyStyleProps, footerStyle } = useMemo(() => {
    const { titleArea, body, footer } = messegeDialogContentInner()
    return {
      titleAreaStyle: titleArea(),
      bodyStyleProps: {
        style: {
          maxHeight: `calc(100vh - ${offsetHeight}px)`,
        },
        className: body(),
      },
      footerStyle: footer(),
    }
  }, [offsetHeight])

  return (
    <Section>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading tag={titleTag}>
        <Stack gap={0.25} as="span" ref={titleRef} className={titleAreaStyle}>
          {subtitle && (
            <Text size="S" color="TEXT_GREY" className="smarthr-ui-Dialog-subtitle">
              {subtitle}
            </Text>
          )}
          <Text id={titleId} size="L" className="smarthr-ui-Dialog-title">
            {title}
          </Text>
        </Stack>
      </Heading>
      <div {...bodyStyleProps}>{description}</div>
      <footer ref={bottomRef} className={footerStyle}>
        <Button onClick={onClickClose} className="smarthr-ui-Dialog-closeButton">
          {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
        </Button>
      </footer>
    </Section>
  )
}
