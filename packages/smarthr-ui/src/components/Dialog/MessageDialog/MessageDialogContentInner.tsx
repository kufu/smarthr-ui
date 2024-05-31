import React, { FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../Button'
import { Heading, HeadingTagTypes } from '../../Heading'
import { Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { Text } from '../../Text'
import { useOffsetHeight } from '../dialogHelper'
import { type ContentBodyProps } from '../useDialogInnerStyle'

import type { DecoratorsType, Gap } from '../../../types'

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
   * @deprecated SectioningContent(Article, Aside, Nav, Section)でDialog全体をラップして、ダイアログタイトルのHeadingレベルを設定してください
   */
  titleTag?: HeadingTagTypes
  /**
   * ダイアログの説明
   */
  description: React.ReactNode
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'closeButtonLabel'>
} & ContentBodyProps

export type MessageDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  titleId: string
}

const CLOSE_BUTTON_LABEL = '閉じる'

const messegeDialogContentInner = tv({
  slots: {
    titleArea:
      'smarthr-ui-Dialog-titleArea shr-border-b-shorthand shr-my-[unset] shr-px-1.5 shr-py-1',
    footer:
      'smarthr-ui-Dialog-buttonArea shr-border-t-shorthand shr-flex shr-justify-end shr-px-1.5 shr-py-1',
  },
})
// FIXME: 他のダイアログと共通化したかったが別でやる
const dialogBody = tv({
  base: ['smarthr-ui-Dialog-description', 'shr-overflow-auto shr-text-base'],
  variants: {
    contentPaddingBlock: {
      0: 'shr-py-0',
      0.25: 'shr-py-0.25',
      0.5: 'shr-py-0.5',
      0.75: 'shr-py-0.75',
      1: 'shr-py-1',
      1.25: 'shr-py-1.25',
      1.5: 'shr-py-1.5',
      2: 'shr-py-2',
      2.5: 'shr-py-2.5',
      3: 'shr-py-3',
      3.5: 'shr-py-3.5',
      4: 'shr-py-4',
      8: 'shr-py-8',
      X3S: 'shr-py-0.25',
      XXS: 'shr-py-0.5',
      XS: 'shr-py-1',
      S: 'shr-py-1.5',
      M: 'shr-py-2',
      L: 'shr-py-2.5',
      XL: 'shr-py-3',
      XXL: 'shr-py-3.5',
      X3L: 'shr-py-4',
    } as { [key in Gap]: string },
    contentPaddingInline: {
      0: 'shr-px-0',
      0.25: 'shr-px-0.25',
      0.5: 'shr-px-0.5',
      0.75: 'shr-px-0.75',
      1: 'shr-px-1',
      1.25: 'shr-px-1.25',
      1.5: 'shr-px-1.5',
      2: 'shr-px-2',
      2.5: 'shr-px-2.5',
      3: 'shr-px-3',
      3.5: 'shr-px-3.5',
      4: 'shr-px-4',
      8: 'shr-px-8',
      X3S: 'shr-px-0.25',
      XXS: 'shr-px-0.5',
      XS: 'shr-px-1',
      S: 'shr-px-1.5',
      M: 'shr-px-2',
      L: 'shr-px-2.5',
      XL: 'shr-px-3',
      XXL: 'shr-px-3.5',
      X3L: 'shr-px-4',
    } as { [key in Gap]: string },
    contentBgColor: {
      BACKGROUND: 'shr-bg-background',
      COLUMN: 'shr-bg-column',
      BASE_GREY: 'shr-bg-base-grey',
      OVER_BACKGROUND: 'shr-bg-over-background',
      HEAD: 'shr-bg-head',
      BORDER: 'shr-bg-[theme(colors.grey.20)]',
      ACTION_BACKGROUND: 'shr-bg-action-background',
      WHITE: 'shr-bg-white',
      GREY_5: 'shr-bg-[theme(colors.grey.5)]',
      GREY_6: 'shr-bg-[theme(colors.grey.6)]',
      GREY_7: 'shr-bg-[theme(colors.grey.7)]',
      GREY_9: 'shr-bg-[theme(colors.grey.9)]',
      GREY_20: 'shr-bg-[theme(colors.grey.20)]',
    },
  },
})

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  title,
  subtitle,
  titleTag,
  titleId,
  contentBgColor,
  contentPadding = 1.5,
  description,
  onClickClose,
  decorators,
}) => {
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  const { titleAreaStyle, bodyStyleProps, footerStyle } = useMemo(() => {
    const { titleArea, footer } = messegeDialogContentInner()
    const paddingBlock = contentPadding instanceof Object ? contentPadding.block : contentPadding
    const paddingInline = contentPadding instanceof Object ? contentPadding.inline : contentPadding

    return {
      titleAreaStyle: titleArea(),
      bodyStyleProps: {
        style: {
          maxHeight: `calc(100svh - ${offsetHeight}px)`,
        },
        className: dialogBody({
          contentBgColor,
          contentPaddingBlock: paddingBlock,
          contentPaddingInline: paddingInline,
        }),
      },
      footerStyle: footer(),
    }
  }, [contentBgColor, contentPadding, offsetHeight])

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
